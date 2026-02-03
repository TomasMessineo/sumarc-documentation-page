---
sidebar_position: 3
---

# Custom Style (APA)

Although there are repositories with thousands of CSL styles (like the [official repository](https://github.com/citation-style-language/styles)), in JATS Parser we use a **custom version of APA** to meet specific editorial needs that the standard implementation does not cover.

## Why a custom CSL?

The standard community APA style, while technically correct, sometimes produces outputs that do not align with local stylistic preferences or particularities of the Spanish language in the context of our journals.

Behaviors detected and corrected include:
*   Use of `&` instead of `y` (and) for authors (typical of English).
*   Date format style `(Year, Month Day)` vs the preferred `(Day Month Year)`.
*   Redundant punctuation or unnecessary commas in certain types of theses or reports.

## Technical Implementation

In the JATS Parser code, style loading is done dynamically using the `seboettg/citeproc-php` library:

```php
// 1. Get the configured style name (ex: "apa-custom")
$styleName = $this->getCitationStyle(); 

// 2. Load the CSL Style XML
$style = StyleSheet::loadStyleSheet($styleName);

// 3. Instantiate the processor with the style, language, and data (JSON)
$citeProc = new CiteProc($style, $this->citationLang, $jsonRefs);
```

### Common Customizations

We can modify the `.csl` file to alter the presentation without touching PHP code.

**Example: Change date format**
Original (Standard APA):
```xml
<date variable="issued">
  <date-part name="year"/>
  <date-part name="month" prefix=", "/>
  <date-part name="day" prefix=" "/>
</date>
<!-- Result: 2023, January 23 -->
```

Custom (Localized):
```xml
<date variable="issued">
  <date-part name="day" suffix=" de "/>
  <date-part name="month" suffix=" de "/>
  <date-part name="year"/>
</date>
<!-- Result: 23 de Enero de 2023 -->
```

## Resources
*   [Official CSL Style Repository](https://github.com/citation-style-language/styles)
*   [Visual CSL Editor](https://editor.citationstyles.org/about/) (Useful for creating or modifying styles graphically).
