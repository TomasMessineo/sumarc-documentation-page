import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useLocation, useHistory } from '@docusaurus/router';
import { diffWordsWithSpace } from 'diff';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Configuration
const REPO_OWNER = 'TomasMessineo';
const REPO_NAME = 'sumarc-documentation-page';
const EMPTY_SHA = 'EMPTY_START'; // Virtual SHA for empty state

type Commit = {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
};


// Helper component for Prose Diff
const ProseDiff = ({ oldText, newText }: { oldText: string, newText: string }) => {
    // Basic Diff
    const diff = diffWordsWithSpace(oldText || '', newText || '');

    return (
        <div style={{ 
            whiteSpace: 'pre-wrap', 
            lineHeight: '1.8', 
            fontFamily: 'var(--ifm-font-family-base)',
            color: 'var(--ifm-font-color-base)'
        }}>
            {diff.map((part, index) => {
                // Styles for Added/Removed
                const isAdded = part.added;
                const isRemoved = part.removed;
                
                if (isRemoved) {
                     return (
                         <span key={index} style={{
                             backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                             color: 'var(--ifm-color-danger)', 
                             textDecoration: 'line-through',
                             padding: '2px 0'
                         }}>{part.value}</span>
                     );
                }
                
                if (isAdded) {
                     return (
                         <span key={index} style={{
                             backgroundColor: 'rgba(0, 255, 0, 0.1)', 
                             color: 'var(--ifm-color-success)', 
                             fontWeight: 'bold',
                             padding: '2px 0'
                         }}>{part.value}</span>
                     );
                }
                
                return <span key={index}>{part.value}</span>;
            })}
        </div>
    );
};

// Internal component that contains the client-side logic
function HistoryContent() {
  const {colorMode} = useColorMode();
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const isDark = colorMode === 'dark';
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const filePath = params.get('file');

  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth state for Rate Limit handling
  const [githubToken, setGithubToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  
  // Initialize token from localStorage if available
  useEffect(() => {
    const savedToken = localStorage.getItem('sumarc_github_token');
    if (savedToken) setGithubToken(savedToken);
  }, []);

  // Save token handler
  const handleSaveToken = (token: string) => {
      setGithubToken(token);
      localStorage.setItem('sumarc_github_token', token);
      setShowTokenInput(false);
      // Retry fetch if there was an error
      if (error) {
          window.location.reload();
      }
  };

  // Selection state for Table View
  const [selectedShas, setSelectedShas] = useState<string[]>([]);
  
  // View mode
  const [isComparing, setIsComparing] = useState(false);

  // Data for Diff View
  const [oldContent, setOldContent] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [diffLoading, setDiffLoading] = useState(false);

  // Handler for checkboxes
  const handleCheckboxChange = (sha: string) => {
      setSelectedShas(prev => {
          if (prev.includes(sha)) {
              return prev.filter(s => s !== sha);
          } else {
              // Maintain max 2 constraint logic if needed, but for now standard toggle
              return [...prev, sha];
          }
      });
  };

  const handleStartComparison = () => {
      if (selectedShas.length !== 2) return;
      setIsComparing(true);
      
      // Determine order based on index in commit list to ensure Old -> New direction
      const idx1 = commits.findIndex(c => c.sha === selectedShas[0]);
      const idx2 = commits.findIndex(c => c.sha === selectedShas[1]);
      
      // idx1 > idx2 means idx1 is OLDER (further down the list)
      let olderSha = idx1 > idx2 ? selectedShas[0] : selectedShas[1];
      let newerSha = idx1 > idx2 ? selectedShas[1] : selectedShas[0];
      
      fetchDiffContent(olderSha, newerSha);
  };

  // Fetch commit history
  useEffect(() => {
    if (!filePath) return;

    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const cleanPath = filePath?.startsWith('/') ? filePath.slice(1) : filePath;
        const timestamp = new Date().getTime();
        
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json'
        };
        // Add auth header if token exists
        if (githubToken) {
            headers['Authorization'] = `token ${githubToken}`;
        }

        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=dev&path=${cleanPath}&t=${timestamp}`, {
            headers
        });
        
        if (!response.ok) {
           if (response.status === 403) {
             setShowTokenInput(true);
             throw new Error("API Rate Limit Exceeded.");
           }
           if (response.status === 404) throw new Error("File history not found (404). Check if file exists in main branch.");
           throw new Error(`GitHub API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setCommits(data);
        setSelectedShas([]);
        setIsComparing(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Only run if checking token initialization is done or doesn't matter, 
    // but useEffect dependency on githubToken ensures retry when token changes.
    fetchHistory();
  }, [filePath, githubToken]);

  // Fetch Diff Content on demand
  async function fetchDiffContent(oldSha: string, newSha: string) {
      setDiffLoading(true);
      try {
        const cleanPath = filePath?.startsWith('/') ? filePath.slice(1) : filePath;
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json'
        };
        if (githubToken) {
            headers['Authorization'] = `token ${githubToken}`;
        }

        // Fetch Old
        let oldText = '';
        const oldRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}?ref=${oldSha}`, { headers });
        if (oldRes.ok) {
            const oldData = await oldRes.json();
            oldText = oldData.content ? decodeURIComponent(escape(window.atob(oldData.content))) : '';
        }

        // Fetch New
        const newRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}?ref=${newSha}`, { headers });
        let newText = '';
        if (newRes.ok) {
            const newData = await newRes.json();
            newText = newData.content ? decodeURIComponent(escape(window.atob(newData.content))) : '';
        }

        setOldContent(oldText);
        setNewContent(newText);
      } catch (err) {
        console.error("Error fetching content", err);
        setOldContent("Error loading content.");
        setNewContent(err instanceof Error ? err.message : "Error loading content");
      } finally {
        setDiffLoading(false);
      }
  }

  /* ---------------- RENDERING ---------------- */

  if (!filePath) {
    return (
        <div className="container margin-vert--lg">
            <h1><Translate id="history.title">Historial de versiones</Translate></h1>
            <p><Translate id="history.noFile">No se especificó ningún archivo.</Translate></p>
        </div>
    );
  }

  // 1. Table View
  if (!isComparing) {
      return (
        <div className="margin-vert--lg" style={{maxWidth:'96%', margin:'2rem auto', padding:'0 1rem'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Link to={`/docs/${filePath.replace('.md', '').replace('docs/', '')}`}>← <Translate id="history.backToDocs">Volver a la documentación</Translate></Link>
              <button 
                className="button button--sm button--link" 
                onClick={() => setShowTokenInput(!showTokenInput)}
                title="Configurar GitHub Token"
              >
                  {githubToken ? '🔑 Token Configurado' : '🔑 Configurar Token'}
              </button>
            </div>

            {showTokenInput && (
                <div className="alert alert--warning margin-top--md">
                    <h4>GitHub API Authentication</h4>
                    <p>
                        <Translate id="history.token.msg1">La API de GitHub tiene un límite de 60 peticiones/hora para usuarios anónimos.</Translate>
                        <br/>
                        <Translate id="history.token.msg2">Si ves errores de "Rate Limit", ingresa un Personal Access Token (Classic). Se guardará localmente en tu navegador.</Translate>
                    </p>
                    <div style={{display:'flex', gap:'10px', marginBottom:'0.5rem'}}>
                        <input 
                            type="password" 
                            className="button button--outline button--secondary"
                            style={{background: 'var(--ifm-background-color)', cursor:'text', flex:1, textAlign:'left'}}
                            placeholder="ghp_..."
                            onChange={(e) => handleSaveToken(e.target.value)}
                            value={githubToken}
                        />
                         <button className="button button--secondary" onClick={() => setShowTokenInput(false)}>OK</button>
                    </div>
                    <small style={{fontSize:'0.8rem'}}>
                        <Translate id="history.token.generate">Genera uno en</Translate> <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">GitHub Settings &gt; Developer Settings</a>. <Translate id="history.token.scopes">No requiere permisos especiales (scopes) para repositorios públicos.</Translate>
                    </small>
                </div>
            )}
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1rem', marginBottom:'1rem'}}>
                <h1><Translate id="history.title">Historial de versiones</Translate></h1>
                <button 
                    className="button button--primary"
                    disabled={selectedShas.length !== 2}
                    onClick={handleStartComparison}
                    title={selectedShas.length !== 2 ? translate({message: "Selecciona exactamente 2 versiones para comparar", id: "history.tooltip.selectTwo"}) : translate({message: "Comparar versiones", id: "history.tooltip.compare"})}
                >
                    <Translate id="history.button.compare">Comparar versiones seleccionadas</Translate> {selectedShas.length > 0 ? `(${selectedShas.length})` : ''}
                </button>
            </div>
            
            <p className="margin-bottom--lg">
                <Translate id="history.description.prefix">Historial de cambios del archivo:</Translate> <strong>{filePath}</strong>. <Translate id="history.description.suffix">Selecciona dos versiones para ver las diferencias.</Translate>
            </p>

            {loading && <div className="text--center padding--lg"><div className="spinner-border"></div></div>}
            {error && <div className="alert alert--danger">{error}</div>}

            {!loading && commits.length > 0 && (
                <div style={{overflowX: 'auto', border:'1px solid var(--ifm-color-emphasis-200)', borderRadius:'8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
                    <table className="table" style={{width:'100%', marginBottom:0}}>
                        <thead style={{background:'var(--ifm-background-surface-color)'}}>
                            <tr>
                                <th style={{width:'50px', textAlign:'center'}}></th>
                                <th><Translate id="history.table.version">Versión</Translate></th>
                                <th><Translate id="history.table.date">Fecha</Translate></th>
                                <th><Translate id="history.table.author">Autor/a</Translate></th>
                                <th><Translate id="history.table.comments">Comentarios</Translate></th>
                            </tr>
                        </thead>
                        <tbody>
                            {commits.map((commit, index) => {
                                const isSelected = selectedShas.includes(commit.sha);
                                const isLatest = index === 0;
                                // Disable checkbox if 2 are already selected AND this one isn't one of them
                                const isDisabled = selectedShas.length >= 2 && !isSelected;

                                return (
                                    <tr key={commit.sha} style={{background: isSelected ? 'var(--ifm-color-emphasis-100)' : 'inherit'}}>
                                        <td style={{textAlign:'center', verticalAlign:'middle'}}>
                                            <input 
                                                type="checkbox"
                                                checked={isSelected}
                                                disabled={isDisabled}
                                                onChange={() => handleCheckboxChange(commit.sha)}
                                                style={{cursor: isDisabled ? 'not-allowed' : 'pointer', transform:'scale(1.2)'}}
                                            />
                                        </td>
                                        <td style={{verticalAlign:'middle'}}>
                                            <div style={{fontWeight:'bold', color:'var(--ifm-color-primary)'}}>
                                                {isLatest ? <Translate id="history.version.current">ACTUAL</Translate> : `v.${commits.length - index}`}
                                            </div>
                                            <code style={{fontSize:'0.75rem', color:'var(--ifm-color-emphasis-600)'}} title={commit.sha}>{commit.sha.substring(0,7)}</code>
                                        </td>
                                        <td style={{verticalAlign:'middle'}}>
                                            {new Date(commit.commit.author.date).toLocaleDateString(currentLocale)} 
                                            <br/>
                                            <span style={{fontSize:'0.8rem', color:'var(--ifm-color-emphasis-600)'}}>
                                                {new Date(commit.commit.author.date).toLocaleTimeString(currentLocale, {hour:'2-digit', minute:'2-digit'})}
                                            </span>
                                        </td>
                                        <td style={{verticalAlign:'middle'}}>
                                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                                <img 
                                                    src={`https://github.com/${commit.commit.author.name}.png?size=24`} 
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    alt="" 
                                                    style={{borderRadius:'50%', width:'24px', height:'24px', background:'#eee'}}
                                                />
                                                {commit.commit.author.name}
                                            </div>
                                        </td>
                                        <td style={{verticalAlign:'middle'}}>
                                            {commit.commit.message}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      );
  }

  // 2. Comparison View
  return (
      <div className="container margin-vert--lg">
        <div style={{marginBottom:'1rem'}}>
             <button className="button button--secondary button--sm" onClick={() => setIsComparing(false)}>
                ← <Translate id="history.backToList">Volver a la lista de versiones</Translate>
             </button>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
            <h1 style={{margin:0}}><Translate id="history.compare.title">Comparación de Cambios</Translate></h1>
            <div>
                 <Translate id="history.compare.label">Compare:</Translate> <span className="badge badge--danger" style={{marginRight:'5px'}}><Translate id="history.compare.base">Base (Antigua)</Translate></span>
                 ➔ <span className="badge badge--success" style={{marginLeft:'5px'}}><Translate id="history.compare.target">Objetivo (Nueva)</Translate></span>
            </div>
        </div>
        
        {diffLoading ? (
            <div style={{padding:'4rem', textAlign:'center'}}>
                <div className="spinner-border" role="status"></div>
                <h2><Translate id="history.loadingDiff">Cargando diferencias...</Translate></h2>
            </div>
        ) : (
            <div style={{
                fontSize:'16px', 
                fontFamily: 'var(--ifm-font-family-base)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                background: 'var(--ifm-background-surface-color)',
                borderRadius: '8px',
                padding: '40px',
                border: '1px solid var(--ifm-color-emphasis-200)'
            }}>
                {newContent === oldContent && oldContent !== '' && (
                    <div className="alert alert--info margin-bottom--md">
                        <strong><Translate id="history.noChanges">Sin cambios:</Translate></strong> <Translate id="history.noChangesMsg">El contenido de las versiones seleccionadas es idéntico.</Translate>
                    </div>
                )}


                <ProseDiff oldText={oldContent} newText={newContent} />
            </div>
        )}
      </div>
  );
}

// Main page component - Safe for SSG
export default function HistoryPage() {
  const {i18n: {currentLocale}} = useDocusaurusContext();
  return (
    <Layout title={translate({message: "Historial de Página", id: "history.pageTitle"})} description={translate({message: "Historial de cambios", id: "history.pageDescription"})}>
       <BrowserOnly fallback={<div className="container margin-vert--lg"><Translate id="history.loading">Cargando historial...</Translate></div>}>
         {() => <HistoryContent />}
       </BrowserOnly>
    </Layout>
  );
}
