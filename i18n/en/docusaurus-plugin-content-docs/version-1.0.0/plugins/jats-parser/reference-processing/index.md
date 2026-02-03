---
sidebar_position: 1
---

# Reference Processing

JATS Parser integrates the **CiteProc-PHP** library for the automated generation of bibliographic references and citations in the final document (PDF/HTML).

This integration allows converting raw reference metadata (extracted from JATS XML) into perfectly formatted citations following international standards like **APA 7th Edition**, without manual intervention.

:::info Base Technology
To achieve this, JATS Parser relies on two key components of the open bibliometrics ecosystem:
1.  **Citation Style Language (CSL)**: An XML standard for describing how references should look.
2.  **CiteProc**: A *"citation processor"* that takes data and a CSL style, and produces formatted output.
:::

## Workflow

The reference generation process follows these steps:

1.  **Extraction**: JATS Parser reads references (`<ref-list>`) from the JATS XML file.
2.  **Mapping (CSL-JSON)**: Converts each reference to a standardized intermediate object (JSON).
3.  **Processing**: Instantiates the `CiteProc` class, loading the desired CSL style (e.g., `apa-custom.csl`).
4.  **Rendering**: CiteProc applies CSL rules over JSON data and returns HTML/Text of the complete reference.

This modular approach allows us to change the citation style of an entire journal simply by changing the `.csl` file, without touching the plugin code.
