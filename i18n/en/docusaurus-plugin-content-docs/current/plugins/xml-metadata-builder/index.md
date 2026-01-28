# XMLMetadataBuilder

**XMLMetadataBuilder** is a generic plugin for OJS 3.4 designed to automate the enrichment of JATS XML files by injecting accurate bibliographic and editorial metadata extracted directly from the OJS system.

:::info Source
Development repository:
[View repository on GitHub](https://github.com/san-fernandez/pruebaPluginMetadata)
:::

## Main Function
The main objective of the plugin is to take a "raw" JATS XML file (which may contain only the body of the text) and populate it with all the necessary information in the `<front>` section to comply with the **JATS Publishing DTD 1.4** standard.

This eliminates the need to manually upload redundant metadata into the XML, ensuring that the file information matches exactly what is recorded in OJS.

## Key Features

*   **Automatic Extraction:** Gets data directly from OJS objects (`Submission`, `Publication`, `Context`), including:
    *   **Journal:** Title, eISSN, publisher.
    *   **Article:** Title, abstract, keywords, DOIs, publication dates.
    *   **Authors:** Names, affiliations, ORCIDs, email, contribution roles.
    *   **License:** Information de copyrights and Creative Commons licenses.
*   **Preview:** Allows visualizing how the `<front>` block of the XML will look before applying final changes.
*   **File Management:** Creates a new enriched file (e.g., `article-enriched.xml`) without validating the original, and can automatically publish it as a galley.
*   **Modular Architecture:** Clearly separates extraction logic (`MetadataExtractor`) from XML construction (`JATSBuilder`), facilitating maintenance.

## Workflow
1.  In the **Production** stage, the editor selects an existing XML file.
2.  Accesses the enrichment tool provided by the plugin.
3.  The system generates a preview of the injected metadata.
4.  Upon confirmation, the new enriched XML file is generated and saved in the system.

## Technical Components
*   **MetadataExtractor:** Class responsible for mapping data from the OJS database to intermediate data structures.
*   **JATSBuilder:** Uses `DOMDocument` to manipulate the XML and build the correct JATS tag structure.
*   **EnrichmentService:** Service that coordinates file reading, processing, and result saving.
