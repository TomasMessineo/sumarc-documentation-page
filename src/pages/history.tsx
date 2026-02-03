import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useLocation, useHistory } from '@docusaurus/router';
import { diffWordsWithSpace } from 'diff';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';

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
  const isDark = colorMode === 'dark';
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const filePath = params.get('file');

  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        // Fetch from dev branch with cache busting (query param only to avoid CORS preflight issues)
        const timestamp = new Date().getTime();
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=dev&path=${cleanPath}&t=${timestamp}`);
        if (!response.ok) {
           if (response.status === 403) throw new Error("Rate limit exceeded. Please try again later.");
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

    fetchHistory();
  }, [filePath]);

  // Fetch Diff Content on demand
  async function fetchDiffContent(oldSha: string, newSha: string) {
      setDiffLoading(true);
      try {
        const cleanPath = filePath?.startsWith('/') ? filePath.slice(1) : filePath;

        // Fetch Old
        let oldText = '';
        const oldRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}?ref=${oldSha}`);
        if (oldRes.ok) {
            const oldData = await oldRes.json();
            oldText = oldData.content ? decodeURIComponent(escape(window.atob(oldData.content))) : '';
        }

        // Fetch New
        const newRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}?ref=${newSha}`);
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
            <h1>Historial de versiones</h1>
            <p>No se especificó ningún archivo.</p>
        </div>
    );
  }

  // 1. Table View
  if (!isComparing) {
      return (
        <div className="margin-vert--lg" style={{maxWidth:'96%', margin:'2rem auto', padding:'0 1rem'}}>
            <Link to={`/docs/${filePath.replace('.md', '').replace('docs/', '')}`}>← Volver a la documentación</Link>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1rem', marginBottom:'1rem'}}>
                <h1>Historial de versiones</h1>
                <button 
                    className="button button--primary"
                    disabled={selectedShas.length !== 2}
                    onClick={handleStartComparison}
                    title={selectedShas.length !== 2 ? "Selecciona exactamente 2 versiones para comparar" : "Comparar versiones"}
                >
                    Comparar versiones seleccionadas {selectedShas.length > 0 ? `(${selectedShas.length})` : ''}
                </button>
            </div>
            
            <p className="margin-bottom--lg">
                Historial de cambios del archivo: <strong>{filePath}</strong>. Selecciona dos versiones para ver las diferencias.
            </p>

            {loading && <div className="text--center padding--lg"><div className="spinner-border"></div></div>}
            {error && <div className="alert alert--danger">{error}</div>}

            {!loading && commits.length > 0 && (
                <div style={{overflowX: 'auto', border:'1px solid var(--ifm-color-emphasis-200)', borderRadius:'8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
                    <table className="table" style={{width:'100%', marginBottom:0}}>
                        <thead style={{background:'var(--ifm-background-surface-color)'}}>
                            <tr>
                                <th style={{width:'50px', textAlign:'center'}}></th>
                                <th>Versión</th>
                                <th>Fecha</th>
                                <th>Autor/a</th>
                                <th>Comentarios</th>
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
                                                {isLatest ? 'ACTUAL' : `v.${commits.length - index}`}
                                            </div>
                                            <code style={{fontSize:'0.75rem', color:'var(--ifm-color-emphasis-600)'}} title={commit.sha}>{commit.sha.substring(0,7)}</code>
                                        </td>
                                        <td style={{verticalAlign:'middle'}}>
                                            {new Date(commit.commit.author.date).toLocaleDateString()} 
                                            <br/>
                                            <span style={{fontSize:'0.8rem', color:'var(--ifm-color-emphasis-600)'}}>
                                                {new Date(commit.commit.author.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
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
                ← Volver a la lista de versiones
             </button>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
            <h1 style={{margin:0}}>Comparación de Cambios</h1>
            <div>
                 Compare: <span className="badge badge--danger" style={{marginRight:'5px'}}>Base (Antigua)</span>
                 ➔ <span className="badge badge--success" style={{marginLeft:'5px'}}>Objetivo (Nueva)</span>
            </div>
        </div>
        
        {diffLoading ? (
            <div style={{padding:'4rem', textAlign:'center'}}>
                <div className="spinner-border" role="status"></div>
                <h2>Cargando diferencias...</h2>
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
                        <strong>Sin cambios:</strong> El contenido de las versiones seleccionadas es idéntico.
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
  return (
    <Layout title="Historial de Página" description="Historial de cambios">
       <BrowserOnly fallback={<div className="container margin-vert--lg">Cargando historial...</div>}>
         {() => <HistoryContent />}
       </BrowserOnly>
    </Layout>
  );
}
