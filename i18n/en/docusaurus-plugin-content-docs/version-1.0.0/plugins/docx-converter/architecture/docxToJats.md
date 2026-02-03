# docxToJats Library

**docxToJats** is the main engine responsible for processing DOCX files. It is an independent PHP library that complies with OOXML (Office Open XML) standards.

## Functionalities

*   **OOXML Decompression**: Understands that a `.docx` is a ZIP container for XMLs (`document.xml`, `styles.xml`, etc.) and processes them individually.
*   **Style Mapping**: Translates Word styles (e.g., "Heading 1", "Normal", "Emphasis") to JATS tags (`<sec>`, `<p>`, `<bold>`).
*   **Resource Management**: Extracts and renames images embedded in the Word document so they can be referenced from the XML.

:::info Origin
This library is a *fork* maintained by Vitaliy-1, to which SEDICI actively contributes, especially in the integration with the citation parser.
:::
