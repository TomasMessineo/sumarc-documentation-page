---
sidebar_position: 2
---

# Information on CSL

**CSL (Citation Style Language)** is an open XML-based language that describes the format of citations and bibliographies. It is the de facto standard used by modern reference managers like Zotero, Mendeley, and Papers.

:::tip Official Documentation
For more technical details, visit [citationstyles.org](https://citationstyles.org/).
:::

## Key Concepts

A CSL file works like a "stylesheet" for references. It defines how information should be ordered, punctuated, and presented.

### Basic Structure
A CSL file has two main sections:
1.  `<citation>`: Defines how in-text citations look (e.g., `(Smith, 2023)`).
2.  `<bibliography>`: Defines how the reference list looks at the end of the document.

Within these sections, logical elements called **Macros** are organized.

### Language Components

#### 1. Macros (`<macro>`)
They are reusable functions. Instead of repeating logic, formatting rules for specific parts (like author, date, or title) are encapsulated and then called.

*   **Example**: `<macro name="title">` defines how the title is displayed (italics, quotes, etc.) depending on the document type.

#### 2. Conditionals (`<choose>`, `<if>`, `<else>`)
Allow displaying different information based on context or available data.

```xml
<choose>
  <!-- 1. If it is a thesis... -->
  <if type="thesis">
     <text value="Doctoral Thesis"/>
  </if>
  <!-- 2. If not thesis, but has DOI... -->
  <else-if variable="DOI">
     <text prefix="https://doi.org/" variable="DOI"/>
  </else-if>
  <!-- 3. Final Fallback -->
  <else>
     <text value="Unidentified Document"/>
  </else>
</choose>
```

#### 3. Groups and Delimiters (`<group>`)
Prevent common punctuation problems (like `Author, , Title`). A group with a delimiter only inserts the separator if the elements it contains exist.

```xml
<group delimiter=", ">
  <text variable="genre"/>      <!-- Ex: Master's Thesis -->
  <text variable="publisher"/>  <!-- Ex: National University -->
</group>
```
*   If both exist: `Master's Thesis, National University`
*   If publisher missing: `Master's Thesis` (no trailing comma).

## Relationship with CSL-JSON

CSL is just the set of rules. To work, it needs data. In JATS Parser, this data is supplied in **CSL-JSON** format.

When the CSL says `<text variable="title"/>`, the CiteProc processor internally looks for a `"title"` key in the JSON object passed to it.

> **Important**: The CSL file does not "search" for information in the OJS database. It only formats what JATS Parser sends it in the JSON.
