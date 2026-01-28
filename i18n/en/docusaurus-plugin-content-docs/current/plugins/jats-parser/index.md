---
title: JATSParser
---

This development transforms the plugin from a rigid tool into a flexible and modular ecosystem. The separation of concerns between JATS XML processing, catalog orchestration, layout (TPL), and styling (CSS) fulfills the main objective of eliminating the programming barrier, providing a powerful tool for customizing the presentation of scientific articles.

## Objectives of the New Design

*   **Autonomy and Design Decentralization:** Allow each journal to have full autonomy over the visual structure of its PDF output, without relying on software developments for every aesthetic change.
*   **Elimination of the Programming Barrier:** Facilitate modifications through a configuration interface and the use of standard web technologies (HTML/CSS) instead of complex PHP code.
*   **Style Flexibility:** Implementation of "CSS Cascading" to apply aesthetic changes without invalidating the base logic.
*   **Digital Preservation:** Ensure that output files comply with the **PDF/A** standard, guaranteeing that content is self-contained for long-term archiving.

## Technical Architecture

The architecture has been redefined to decouple content processing from its visual presentation:

1.  **JATS XML Processing:** Conversion of the JATS structure into a usable intermediate format (functional HTML).
2.  **"Catalog" Model:** Everything is based on a catalog model (`catalog.xml`), where the structure of the PDF is defined. The system processes this XML, validates the existence of referenced files, and generates the document.
3.  **Template Engine (Smarty):** It uses `.tpl` files (pseudo-HTML) providing the structure for different components.
4.  **PDF Generation (mPDF):** The **mPDF** library is used due to its integration with Smarty and its ability to comply with technical standards like PDF/A.

## Key Features

*   **Integrity Validation:** The system validates the entire integrity of the template (existence of the catalog, structural files, and references) before generating the PDF.
*   **Image and Logo Handling:** Images are defined in the catalog. It supports uploading institutional and journal logos, which are not fixed parts of the TPL but configurable resources.
*   **Internal Navigation:** Support for navigable citations and references within the document.
*   **Template Inheritance:** Ability to extend a base template, overwriting only the necessary files (HTML, CSS, or images) while keeping the originals as backup.

---
For details on how to build and configure templates, consult the **[Template Configuration Guide](./pdf-templates.md)**.
