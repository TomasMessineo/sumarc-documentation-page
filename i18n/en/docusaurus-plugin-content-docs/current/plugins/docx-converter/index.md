# DocxConverter

**DocxConverter** is an OJS 3 plugin (versions 3.3 and 3.4) that allows converting Microsoft Word documents (`.docx`) to the JATS XML standard.

:::info Source
This plugin is maintained by SEDICI and is based on the original work by Vitaliy-1.
[View repository on GitHub](https://github.com/sedici/docxConverter/tree/dev)
:::

## Main Function
Automates the creation of a base JATS XML structure from a DOCX file, facilitating the start of the semantic tagging process. The result is compatible with editors like **Texture**.

## Supported Features
The converter supports a wide range of DOCX/OOXML elements:

*   **Text and Formatting:**
    *   Paragraphs and line breaks.
    *   Bold, italic, underline, strikethrough.
    *   Superscripts and subscripts.
*   **Structure:**
    *   Headings and sections (nested).
    *   Lists (ordered and unordered, nested).
*   **Complex Components:**
    *   **Tables:** Support for merged cells (rowspan/colspan) and captions.
    *   **Figures:** JPEG and PNG images with their captions.
    *   **External links.**
*   **Citations:**
    *   Raw citations (plain text).
    *   Support for structured references using Zotero plugins for Word.

## Known Limitations
Some elements may require subsequent manual adjustment:
*   Complex formulas.
*   Complex metadata embedded in the body (it is recommended to use OJS metadata).
*   The plugin does **not** automatically extract complex bibliographic metadata (title, year, authors) from a plain text reference list; these are saved as "mixed-citation".

## Usage Flow
1.  **Upload:** In the *Copyediting* or *Production* stage of OJS, upload the DOCX file as a "Draft File".
2.  **Conversion:** A button or option **"Convert to JATS XML"** will appear below the uploaded file.
3.  **Result:** If the conversion is successful, a new XML file will appear in the list, ready to be edited with Texture.

## Recommendations for Authors
To obtain the best results, the original document must be well structured:
*   Use Word heading styles (Heading 1, Heading 2...) for sections.
*   Do not use manual formatting to simulate lists; use the word processor's list tools.
*   Ensure that tables are real tables and not tabbed text.
