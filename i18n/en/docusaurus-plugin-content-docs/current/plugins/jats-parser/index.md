# JATSParser

**JATSParser** is a plugin designed to transform the structured content of **JATS XML** files into high-quality final reading formats, such as **PDF** and **HTML for viewers**.

Its main function is to interpret the semantics of the JATS (Journal Article Tag Suite) standard and convert it into a human-friendly visual presentation, all without losing the richness of metadata and the original structure of the scientific article.

## Key Features

*   **PDF/A Generation:** Produces PDF documents that comply with long-term digital archiving and preservation standards.
*   **Customizable Template System:** Allows designing the article's appearance (headers, footers, typography, columns) using standard technologies like HTML and CSS, without touching the plugin's source code.
*   **Reference and Citation Processing:** Integrates citation engines (CSL) to automatically render bibliographic references in the desired format (e.g., APA, Harvard), ensuring internal navigability between the in-text citation and the final bibliography.
*   **Web Visualization:** Facilitates the creation of responsive HTML views generated directly from the XML.

## Why use JATSParser?

JATSParser automates the final output directly from the validated XML in the OJS editorial workflow, eliminating the need for manual layout processes or complex programming. This guarantees:
1.  **Metadata Integrity:** Retrieves metadata directly loaded in OJS, ensuring that if the information is complete in the system, the resulting PDF will be as detailed as possible.
2.  **Consistency:** The final document reflects exactly the data and structure defined in the XML.
3.  **Efficiency:** The manual graphic layout step is eliminated.
4.  **Preservation:** Files optimized for digital repositories are generated.

For details on how to configure and customize visual outputs, consult the **[Template Guide](./pdf-templates.md)**.
