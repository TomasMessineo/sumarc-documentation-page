# Citation Parser

**citation-parser-ojs** is a module developed specifically to equip the converter with **reference recognition** capabilities.

In its original version, `docxToJats` converted the bibliography into a block of plain text or "mixed citations" (`<mixed-citation>`). This module intercepts that text and applies analysis logic to generate structured citations (`<element-citation>`).

## How It Works (Regex)

The parser uses **Regular Expressions (Regex)** designed for **APA 7th Edition** style.

1.  **Segmentation**: Identifies common separation patterns (authors, year in parentheses, title, source).
2.  **Extraction**: Captures specific data groups.
    *   **Authors**: Surnames and initials.
    *   **Year**: `(\d{4})`
    *   **Title**: Text up to the period following the journal or publisher title.
    *   **Source**: Identification of DOIs (`10.xxxx/`) or URLs.
3.  **XML Construction**: Generates the corresponding JATS node.

### Processing Example

**Input (DOCX):**
> Pérez, J. (2023). XML Analysis. Journal of Informatics, 5(2), 10-20. https://doi.org/10.1234/ri.v5i2

**Output (Generated JATS):**
```xml
<ref id="B1">
  <label>1</label>
  <element-citation publication-type="journal">
    <person-group person-group-type="author">
      <name>
        <surname>Pérez</surname>
        <given-names>J.</given-names>
      </name>
    </person-group>
    <year iso-8601-date="2023">2023</year>
    <article-title>XML Analysis</article-title>
    <source>Journal of Informatics</source>
    <volume>5</volume>
    <issue>2</issue>
    <fpage>10</fpage>
    <lpage>20</lpage>
    <pub-id pub-id-type="doi">10.1234/ri.v5i2</pub-id>
  </element-citation>
</ref>
```

## Extensibility
Although currently optimized for APA 7, the pattern-based architecture allows adding new classes to support other citation styles in the future.
