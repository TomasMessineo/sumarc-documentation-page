import React, {type ReactNode} from 'react';
import Heading from '@theme-original/MDXComponents/Heading';
import type HeadingType from '@theme/MDXComponents/Heading';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';

type Props = WrapperProps<typeof HeadingType>;

function LastUpdatedInfo() {
  try {
    const {metadata} = useDoc();
    const {lastUpdatedAt, lastUpdatedBy, editUrl} = metadata;

    if (!lastUpdatedAt && !lastUpdatedBy) {
      return null;
    }

    // Transform editUrl (tree) to commitsUrl
    // Example: .../tree/main/docs/... -> .../commits/main/docs/...
    const historyUrl = editUrl?.replace('/tree/', '/commits/');

    const date = lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleDateString() : '';

    return (
      <div style={{fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '1rem', marginTop: '-0.5rem', opacity: 0.8}}>
        {historyUrl ? (
          <Link to={historyUrl} style={{color: 'inherit', textDecoration: 'none'}}>
            {date && <>Actualizado el {date}</>}
            {lastUpdatedBy && <> por <strong>{lastUpdatedBy}</strong></>}
            {' ⭐ Ver historial'}
          </Link>
        ) : (
          <span>
             {date && <>Actualizado el {date}</>}
             {lastUpdatedBy && <> por <strong>{lastUpdatedBy}</strong></>}
          </span>
        )}
      </div>
    );
  } catch (e) {
    // Not in a doc context
    return null;
  }
}

export default function HeadingWrapper(props: Props): ReactNode {
  const location = useLocation();
  const isH1 = props.as === 'h1' || (props.level === 1);
  // Simple check to avoid crashing in non-doc pages (though try-catch in subcomponent is safer)
  // We render the component only if it's H1. The component itself handles the hook via try-catch if possible, 
  // BUT hooks inside try-catch are forbidden.
  
  // So we must conditionally render the component ONLY if we are sure we are in docs.
  // OR we create a component that uses the hook and we simply don't use it if we are not in docs.
  // But we can't condition the hook usage itself.
  
  // Actually, Docusaurus Documentation recommends checking context availability for generic themes.
  // But here we know our structure. 
  
  // Let's use the location check to gate the component rendering.
  // Assuming '/docs/' or versioned docs paths. 
  // Better: The 'useDoc' hook might throw.
  
  // Strategy: Define a component that calls useDoc. Render it only if location looks right.
  // If useDoc throws, the whole page crashes if not caught by ErrorBoundary.
  // Docusaurus uses ErrorBoundaries.
  
  // Alternative: useData/useGlobalData? No, too complex to find specific doc.
  
  // Let's rely on location.
  const isInDocs = location.pathname.includes('/docs/') || location.pathname.includes('/sumarc-doc/'); // Adjust based on baseUrl

  return (
    <>
      <Heading {...props} />
      {isH1 && isInDocs && (
         <LastUpdatedInfoSafe /> 
      )}
    </>
  );
}

// Wrapper to safely use the hook? No, hooks must be at top level of component.
// We'll just assume if it's rendered, it's safe, or we accept the location check.
// Actually, let's just make LastUpdatedInfo safe by checking context existence? We can't.

// Let's just use the component. If it crashes, we revert.
function LastUpdatedInfoSafe() {
    // We can't try-catch a hook. 
    // But we can try to use the context directly?
    // No, let's trust the location check for now.
    // If we are in /docs/, useDoc should be available.
    return <LastUpdatedInfoInner />;
}

import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// LastUpdatedInfoInner is the actual component used
function LastUpdatedInfoInner() {
     const {metadata} = useDoc();
     const {lastUpdatedAt, lastUpdatedBy, editUrl} = metadata;
     const {i18n: {currentLocale}} = useDocusaurusContext();
     
     if (!lastUpdatedAt && !lastUpdatedBy) return null;

    // Transform editUrl to local history link
    // ... logic omitted ...
    
    let historyUrl = null;
    if (editUrl) {
       // @ts-ignore
       const source = metadata.source || "";
       if (source.startsWith('@site/')) {
           let relativePath = source.replace('@site/', '');
           
           // If we are in english (or non-default locale) AND the source points to original docs,
           // we should try to point to the localized file.
           // However, Docusaurus usually sets 'source' to the actual localized file if it exists.
           // If source is still pointing to docs/..., it might be a fallback? 
           // In this specific case, let's force the i18n path if currentLocale is 'en' and path is 'docs/'
           if (currentLocale === 'en' && relativePath.startsWith('docs/')) {
              relativePath = relativePath.replace('docs/', 'i18n/en/docusaurus-plugin-content-docs/current/');
           }

           historyUrl = `/history?file=${relativePath}`;
       }
    }

    const date = lastUpdatedAt ? new Intl.DateTimeFormat(currentLocale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(lastUpdatedAt)) : '';

    return (
      <div style={{margin: '0 0 20px 0', fontSize: '0.9em', color: 'var(--ifm-color-emphasis-600)'}}>
        {historyUrl ? (
          <Link to={historyUrl} title={translate({message: "Ver historial de cambios", id: "theme.lastUpdated.viewHistoryTitle"})} style={{display:'inline-flex', alignItems:'center', gap:'5px', color:'inherit', textDecoration:'none', borderBottom:'1px dashed currentColor'}}>
             <span>📅 {date}</span>
             {lastUpdatedBy && <span>👤 {lastUpdatedBy}</span>}
             <span>🕒 <Translate id="theme.lastUpdated.viewHistoryText">Ver Historial de Cambios</Translate></span>
          </Link>
        ) : (
            <span>Unknown File Path</span>
        )}
      </div>
    );
}

