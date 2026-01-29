# Technical Architecture

The **DocxConverter** plugin is not a monolith, but orchestrates the operation of two specialized PHP libraries.

## Component Structure

1.  **OJS Plugin (`docxConverter`)**: This is the interface layer. It is responsible for displaying the button in the workflow, managing input/output files, and calling the conversion library.
2.  **Conversion Library (`docxToJats`)**: This is the main engine. It reads the OOXML file (compressed ZIP) and transforms its components (paragraphs, styles, tables) into JATS XML.
3.  **Citation Parser (`citation-parser`)**: This is a specialized module injected into `docxToJats`. It is exclusively responsible for analyzing the text of the bibliography to give it semantic structure.

:::note Modular Development
This separation allows updating or improving the citation parser (for example, to support Vancouver or Chicago) without modifying the document conversion core.
:::
