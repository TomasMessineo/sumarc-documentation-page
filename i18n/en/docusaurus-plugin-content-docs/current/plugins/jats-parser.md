# JATSParser

**JATSParser** is an advanced galley generation engine (publication formats) for OJS 3. It transforms JATS XML files into visually rich PDF and HTML documents.

:::info Source
Developed and extended by SEDICI.
[View repository on GitHub](https://github.com/sedici/JATSParserPlugin/tree/stable-3_4)
:::

## Key Features

### 1. Dynamic PDF Generation
Uses the **TCPDF** library to generate PDF files on the fly from the XML.
*   **Customizable Templates:** Implements a *Strategy* pattern that allows defining multiple designs (Templates) for different journals or article types without touching the base code.
*   **Modular Components:** PDFs are built by assembling components (`Header`, `Body`, `Footer`, `TemplateBody`) and reusable *Renderers*.

### 2. Multi-language Support
The plugin is prepared to handle metadata and content in several languages (Spanish, English, Portuguese), using centralized translation files (`Translations.php`) for automatic labels in the PDF (e.g. "Keywords", "Palabras clave").

### 3. Citation Tables
An exclusive functionality that allows managing and visualizing bibliographic references according to specific standards.
*   **APA 7 Support:** Includes styles and logic to format citations in APA 7th edition standard.
*   **Interface in OJS:** Allows editors to review and adjust how citations will look in the final PDF.

### 4. HTML Rendering
In addition to PDF, it generates an HTML version of the article for direct reading in the browser, improving accessibility and SEO of the content.

## Technical Structure
*   **`JatsParserPlugin.php`:** Entry point that orchestrates fetching metadata and selecting the template strategy.
*   **`PDFBodyHelper.php`:** Crucial class that adapts the HTML/XML content of the article body to be compatible with the TCPDF rendering engine.
*   **Renderers:** Reusable scripts for common elements like author lists, Creative Commons licenses, ORCID logos, etc.

## Configuration and Customization
To create a new look for a journal, developers can create a new folder in `Templates/` following the predefined component structure, making the system highly extensible.
