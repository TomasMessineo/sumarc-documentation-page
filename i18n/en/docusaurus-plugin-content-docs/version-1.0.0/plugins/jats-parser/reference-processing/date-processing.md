---
sidebar_position: 4
---

# 4. CSL Date Format Injection

## 1. Functionality
The `JatsParser` plugin allows bibliographic references to respect the short date format configured in the OJS journal. The date format adapts dynamically to journal preferences and the article language, instead of using a fixed format.

## 2. OJS Configuration
To modify the format in which dates appear in bibliographic references, the journal manager must follow these steps in the administration panel:

1.  Go to **Website** > **Setup** > **Date & Time**.
2.  Find the **Date format (short)** field.
3.  Enter the desired format.
    *   **Common examples:**
        *   `d-m-Y`  → 20-01-2025
        *   `d.m.Y`  → 20.01.2025
        *   `d of F of Y` → 20 of January of 2025
    *   **Available Tokens:**
        *   `d`: Day with leading zero (01-31)
        *   `j`: Day without leading zero (1-31)
        *   `m`: Month with leading zero (01-12)
        *   `n`: Month without leading zero (1-12)
        *   `M`: Short month name (Jan, Feb)
        *   `F`: Full month name (January, February)
        *   `Y`: Year (2025)

**Note on Languages:** The system respects the **article (submission) language**. This is fundamental for consistency in multilingual journals:
*   If an article is configured in **English ("en")**, the system will use:
    1.  The short date format defined for English in OJS.
    2.  English month names.
*   If an article is in **Spanish ("es")**, it will use the Spanish format and names.

This happens regardless of the language in which the administrator is viewing the dashboard. It always takes the submission's `Locale Key`.

---

## 3. Technical Implementation

### Solution Summary
The `DateFormatter` class acts as a "translator" between the simple OJS text format and the strict CSL standard.

### What exactly does the `DateFormatter` class do?

This class performs three fundamental tasks to convert a human-readable date (e.g., `February 15, 2026`) into instructions for the citation engine:

1.  **Breakdown (Tokenization)**
    It takes the configured format (e.g., `d-m-Y`) and breaks it down. It gracefully identifies which parts are date variables (`d` is day, `Y` is year) and which parts are decorative text or separators (such as hyphens or the word "of").

2.  **Pivot Logic (Glue)**
    CSL requires separators to be associated with a specific element. The class decides where to "glue" these separators:
    *   If the separator is before the year, it is associated as a *suffix* of the preceding month or day.
    *   If it is after the year, it is associated as a *prefix* of the following element.
    This prevents common errors such as double spaces or floating punctuation.

3.  **XML Fabrication**
    Finally, it reconstructs the date in the XML format that CSL understands.
    *   Instead of sending plain text `d-m-Y`, it generates:
        ```xml
        <date-part name="day" form="numeric" suffix="-"/>
        <date-part name="month" form="numeric" suffix="-"/>
        <date-part name="year" form="long"/>
        ```

<details>
<summary><strong>View Code Details (For Developers)</strong></summary>

#### A. Class `src/JATSParser/HTML/CSL/DateFormatter.php`
This class contains all the conversion logic described above.

```php
<?php
namespace JATSParser\HTML\CSL;

class DateFormatter {

    /**
     * Injects the OJS date format into the CSL content.
     */
    public function injectOJSDateFormat(string $cslContent, string $dateFormat): string {
        // ... (Injection and mapping implementation)
    }
    // ...
}
```

#### B. Integration in `JatsParserPlugin.inc.php`
This file retrieves the journal's date format configuration and selects the correct locale.

```php
$lang = str_replace('_', '-', $submissionFile->getSubmissionLocale());
$dateFormat = $context->getSetting('dateFormatShort');

// Fix: Use the SUBMISSION language, not the administrative session one
if (is_array($dateFormat)) {
    $locale = $submissionFile->getSubmissionLocale(); 
    $dateFormat = $dateFormat[$locale] ?? reset($dateFormat);
}

// $dateFormat is passed as 4th parameter
$htmlDocument->setReferences($citationStyle, $lang, false, $dateFormat);
```

#### C. Integration in `src/JATSParser/HTML/Document.php`
The document uses the `DateFormatter` to apply the format before generating the references.

```php
use JATSParser\HTML\CSL\DateFormatter; // Import

// ...

public function setReferences(..., string $dateFormat = null): void {
    // ...
    if (!empty($this->jatsDocument->getReferences())) {
        // Pass dateFormat to extractReferences
        $this->extractReferences($this->jatsDocument->getReferences(), $dateFormat);
    }
}

protected function extractReferences(array $references, string $dateFormat = null): void {
    if ($dateFormat) {
        $cslContent = file_get_contents($styleName);
        if ($cslContent) {
            $dateFormatter = new DateFormatter();
            $cslContent = $dateFormatter->injectOJSDateFormat($cslContent, $dateFormat);
            
            $tempStyleFile = tempnam(sys_get_temp_dir(), 'csl_') . '.csl';
            file_put_contents($tempStyleFile, $cslContent);
            $styleName = $tempStyleFile;
        }
    }
}
```

</details>


## 4. Summary: Why is it important?

Without this functionality, if an editor changed the date format in the dashboard, bibliographic citations did not reflect the change, always keeping the fixed format defined in the CSL style.

*   **It's Automatic:** If you change the format in OJS, the bibliography updates itself.
*   **It's Polyglot:** If the article is in English, it will put "January"; if in Spanish, "Enero", always using the correct format.
*   **It's Error-proof:** Fallbacks for articles without dates.
