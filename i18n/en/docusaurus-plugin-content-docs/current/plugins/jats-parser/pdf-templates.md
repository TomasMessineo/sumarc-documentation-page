---
title: PDF Template Configuration
---

# Template Configuration and Creation

The template system is based on a **Catalog** model, defined by an XML file that describes the structure and components of the final PDF.

## Proposals for Template Development

A template consists of:
1.  **Description File (`catalog.xml`)**: Defines the name, description, version, base template (for inheritance), and the list of included files.
2.  **Pseudo-HTML Files (`.tpl`)**: Contain the structure of the different components (header, body, footer). They include:
    *   Variables for replacement (metadata, content).
    *   Control structures (iterators for multiple languages).
    *   Inclusion of other files.
3.  **CSS Files**: Define structural rules (columns, margins) and visual aspects (fonts, colors).
4.  **Images**: Journal logos, institutional logos, licenses, etc.

## Catalog Operation

The generation process follows these steps:
1.  **Search**: The plugin looks for the directory of the template used by the journal.
2.  **File Loading**:
    *   If it is a base template, it loads all its files.
    *   If it is an extended template, it loads the base one first and then replaces it with the modified files from the extended one.
3.  **CSS Cascading**: Loads the base template CSS and then the extended one, leveraging the style cascade to avoid unnecessarily overwriting definitions.
4.  **Processing**:
    *   Replaces variables with their values (metadata or logic results).
    *   Inserts the processed CSS.
    *   Generates the final PDF validating the integrity of all components.

## File Structure

A typical template structure includes:

```text
TemplateName/
├── catalog.xml           # Catalog definition
├── styles.css            # Global styles
├── header.tpl            # Header component
├── body.tpl              # Article body component
├── footer.tpl            # Footer component
└── images/               # Logos and graphics
```

## Technical Characteristics

*   **Relative Paths:** The catalog handles paths internally to avoid absolute dependencies.
*   **Validation:** It validates that the catalog exists, that the "build" section parts are present, and that referenced files are accessible.
*   **Margins:** Although mPDF allows margins, it was decided to define static global margins for the document and allow fine (incremental) adjustments via CSS if necessary.
*   **Default Images:** If a defined image does not load correctly, the system uses an empty replacement image to avoid breaking generation.

## Template Management

From the configuration panel (in development):
*   **List:** View all available templates.
*   **Export:** Download a complete template (original or modified) as a ZIP.
*   **Import:** Upload new templates via ZIP.
*   **Select:** Choose the active template for the journal.
*   **Customize:** Create a copy of a base template in the journal's private directory to edit its HTML/CSS files.
