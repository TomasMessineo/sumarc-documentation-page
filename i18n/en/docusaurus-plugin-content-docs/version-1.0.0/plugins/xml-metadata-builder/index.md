# XMLMetadataBuilder

**XMLMetadataBuilder** is a plugin developed for **Open Journal Systems (OJS)** with the purpose of enriching and completing the metadata of **JATS XML** files within the editorial workflow.

In the context of digital scientific production, the quality of an article is not defined solely by its textual content, but also by the quantity and precision of its metadata. These constitute the basis for indexing, interoperability, preservation, and evaluation of academic production.

:::info Source
Development repository:
[View repository on GitHub](https://github.com/san-fernandez/pruebaPluginMetadata)
:::

## Integration in the Editorial Workflow

The plugin is activated specifically in the **Production** phase of the OJS editorial workflow, once the article has passed the review and copyediting stages.

![XMLMetadataBuilder Process](/img/process-xmlmetadatabuilder.jpg)

1.  The editor selects an XML file marked as *production-ready* from the "XML Enricher" tab.
2.  The system allows previewing the metadata that will be injected.
3.  Enrichment is executed before generating final galley proofs (PDF, HTML), ensuring metadata is complete from the source.

## System Architecture

The plugin adopts a modular layered architecture, designed to decouple data extraction from XML construction.

![XMLMetadataBuilder Architecture](/img/arquitectura-xmlmetadatabuilder.png)

The system is structured into four central components:

### 1. MetadataExtractor
Responsible for **extracting and normalizing** all relevant metadata from the OJS database (authors, affiliations, dates, licenses). Acts as a bridge abstracting the complexity of OJS, producing a homogeneous data structure for processing.

### 2. JATSBuilder
Transforms normalized metadata into a valid XML structure compliant with the **JATS Publishing Schema** standard.
*   Builds the complete `<front>` element.
*   Ensures compatibility with strict profiles like **SciELO**.
*   Guarantees the correct order of elements and attributes.

### 3. XMLMetadataProcessor
Orchestrates the enrichment process operating on the original XML document via a DOM tree.
*   Coordinates extraction and construction.
*   Replaces the existing `<front>` section with the enriched version.
*   **Preserves intact** the body (`<body>`) and references (`<back>`) of the original document.

### 4. EnrichmentService
Entry point from the OJS user interface.
*   Manages file reading and writing.
*   Persists changes in the system.
*   Handles creation of galley proofs and dependent files.

## Impact on Interoperability

Adopting this enrichment system brings direct benefits for editorial quality:

*   **Reduction of validation errors**: Generated XMLs present significantly fewer errors in validators like SciELO's.
*   **Standards compliance**: Alignment with **JATS4R** (JATS for Reuse) recommendations.
*   **Digital Preservation**: By completing structural metadata (dates, licenses, identifiers), it ensures the article is interpretable in the long term.
*   **Technological Sovereignty**: Being natively integrated into SUMARC, it avoids dependence on external tools ("black boxes") for metadata curation.

## Key Features

*   **Automatic Extraction:** Obtains data directly from OJS objects (`Submission`, `Publication`, `Context`).
*   **Preview:** Allows visualizing changes before applying them.
*   **File Management:** Creates enriched versions without destroying the original (optional) and facilitates its publication as a galley.


