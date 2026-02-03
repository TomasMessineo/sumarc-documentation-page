import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useLocation, useHistory } from '@docusaurus/router';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import Link from '@docusaurus/Link';

// Configuration
const REPO_OWNER = 'TomasMessineo';
const REPO_NAME = 'sumarc-documentation-page';

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

export default function HistoryPage() {
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const filePath = params.get('file');

  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected commits for comparison
  const [newCommitSha, setNewCommitSha] = useState<string | null>(null);
  const [oldCommitSha, setOldCommitSha] = useState<string | null>(null);

  const [oldContent, setOldContent] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [diffLoading, setDiffLoading] = useState(false);

  // Fetch commit history
  useEffect(() => {
    if (!filePath) return;

    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        // Remove leading slash if present
        const cleanPath = filePath?.startsWith('/') ? filePath.slice(1) : filePath;
        
        // Use repo-relative path directly. 
        // Note: Docusaurus stores docs in "docs/" or "versioned_docs/".
        // The filePath coming from "editUrl" usually includes the full path from repo root.
        // E.g. "docs/intro.md"
        
        // Use sha=dev param to fetch from dev branch if needed. ideally it should be configurable or dynamic.
        // For now hardcoding or using default branch.
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=dev&path=${cleanPath}`);
        if (!response.ok) {
           if (response.status === 403) throw new Error("Rate limit exceeded. Please try again later.");
           if (response.status === 404) throw new Error("File history not found (404). Check if file exists in main branch.");
           throw new Error(`GitHub API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setCommits(data);
        
        // Default selection: Latest (New) vs Previous (Old)
        if (data.length > 0) {
            setNewCommitSha(data[0].sha);
            if (data.length > 1) {
                setOldCommitSha(data[1].sha);
            } else {
                // If only 1 commit, compare with empty? Or just select same.
                setOldCommitSha(data[0].sha);
            }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [filePath]);

  // Fetch content for diff
  useEffect(() => {
    if (!newCommitSha || !oldCommitSha || !filePath) return;

    async function fetchDiffContent() {
      setDiffLoading(true);
      try {
        const cleanPath = filePath?.startsWith('/') ? filePath.slice(1) : filePath;

        // Fetch Old
        const oldRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}?ref=${oldCommitSha}`);
        const oldData = await oldRes.json();
        const oldText = oldData.content ?  decodeURIComponent(escape(window.atob(oldData.content))) : ''; // UTF-8 decode

        // Fetch New
        const newRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}?ref=${newCommitSha}`);
        const newData = await newRes.json();
        const newText = newData.content ? decodeURIComponent(escape(window.atob(newData.content))) : '';

        setOldContent(oldText);
        setNewContent(newText);
      } catch (err) {
        console.error("Error fetching content", err);
        setOldContent("Error loading content. Rate limit?");
        setNewContent("Error loading content. Rate limit?");
      } finally {
        setDiffLoading(false);
      }
    }

    fetchDiffContent();
  }, [newCommitSha, oldCommitSha, filePath]);

  if (!filePath) {
    return (
      <Layout title="Historial" description="Selecciona un archivo para ver su historial">
        <div className="container margin-vert--lg">
            <h1>Historial de cambios</h1>
            <p>No se especificó ningún archivo. Navega a una página de documentación y haz clic en "Ver historial".</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Historial de Página" description={`Historial de ${filePath}`}>
      <div className="container margin-vert--lg">
        <Link to={`/docs/${filePath.replace('.md', '').replace('docs/', '')}`}>← Volver a la documentación</Link>
        <h1>Historial: {filePath}</h1>
        
        {loading && <p>Cargando historial...</p>}
        {error && <div className="admonition admonition-danger alert alert--danger">{error}</div>}

        {!loading && commits.length === 0 && !error && <p>No se encontró historial para este archivo.</p>}

        <div className="row">
            {/* Sidebar: Commit List */}
            <div className="col col--3" style={{maxHeight:'80vh', overflowY:'auto', borderRight:'1px solid var(--ifm-color-emphasis-200)'}}>
                <h3>Versiones</h3>
                <ul style={{listStyle:'none', padding:0}}>
                    {commits.map((commit, index) => (
                        <li key={commit.sha} style={{marginBottom:'1rem', padding:'10px', background: 'var(--ifm-card-background-color)', borderRadius:'8px', border: newCommitSha === commit.sha ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-200)' }}>
                            <div style={{fontSize:'0.8rem', color:'var(--ifm-color-emphasis-600)'}}>
                                {new Date(commit.commit.author.date).toLocaleDateString()}
                            </div>
                            <div style={{fontWeight:'bold', marginBottom:'5px'}}>
                                {commit.commit.message.split('\n')[0]}
                            </div>
                            <div style={{fontSize:'0.8rem'}}>
                                👤 {commit.commit.author.name}
                            </div>
                            <div style={{marginTop:'5px', display:'flex', gap:'5px'}}>
                                <button 
                                    className={`button button--sm ${newCommitSha === commit.sha ? 'button--primary' : 'button--outline button--secondary'}`}
                                    onClick={() => setNewCommitSha(commit.sha)}
                                    title="Ver esta versión (Derecha)"
                                >
                                    Ver
                                </button>
                                <button 
                                    className={`button button--sm ${oldCommitSha === commit.sha ? 'button--danger' : 'button--outline button--secondary'}`}
                                    onClick={() => setOldCommitSha(commit.sha)}
                                    title="Comparar contra esta (Izquierda)"
                                >
                                    Base
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main: Diff Viewer */}
            <div className="col col--9">
                <h3>
                    Comparando: <span style={{color:'var(--ifm-color-danger)'}}>{oldCommitSha?.substring(0,7)}</span> 
                    {' ➔ '} 
                    <span style={{color:'var(--ifm-color-primary)'}}>{newCommitSha?.substring(0,7)}</span>
                </h3>
                
                {diffLoading ? (
                    <div style={{padding:'2rem', textAlign:'center'}}>Cargando diferencias...</div>
                ) : (
                    <div style={{fontSize:'12px'}}>
                        <ReactDiffViewer 
                            oldValue={oldContent} 
                            newValue={newContent} 
                            splitView={true}
                            compareMethod={DiffMethod.WORDS}
                            useDarkTheme={false} // Force light theme or detect docusaurus theme context? 
                            // Custom styles to match Docusaurus (basic)
                            styles={{
                                diffContainer: {
                                    borderRadius: '8px',
                                    border: '1px solid var(--ifm-color-emphasis-200)',
                                    overflow: 'hidden'
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
      </div>
    </Layout>
  );
}
