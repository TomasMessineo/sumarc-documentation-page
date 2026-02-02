---
sidebar_position: 4
---

# 4. Inyección de Formato de Fecha en CSL

## 1. Funcionalidad
El plugin `JatsParser` permite que las referencias bibliográficas respeten el formato de fecha corta configurado en la revista OJS. El formato de fecha se adapta dinámicamente a las preferencias de la revista y al idioma del artículo, en lugar de utilizar un formato fijo.

## 2. Configuración en OJS
Para modificar el formato en el que aparecen las fechas en las referencias bibliográficas, el gestor de la revista debe seguir estos pasos en el panel de administración:

1.  Ir a **Sitio Web** > **Configuración** > **Fecha y hora**.
2.  Buscar el campo **Formato de fecha (corta)**.
3.  Ingresar el formato deseado.
    *   **Ejemplos comunes:**
        *   `d-m-Y`  → 20-01-2025
        *   `d.m.Y`  → 20.01.2025
        *   `d de F de Y` → 20 de enero de 2025
    *   **Tokens disponibles:**
        *   `d`: Día con cero inicial (01-31)
        *   `j`: Día sin cero inicial (1-31)
        *   `m`: Mes con cero inicial (01-12)
        *   `n`: Mes sin cero inicial (1-12)
        *   `M`: Nombre corto del mes (ene, feb)
        *   `F`: Nombre completo del mes (enero, febrero)
        *   `Y`: Año (2025)

**Nota sobre Idiomas:** El sistema respeta el idioma **del artículo (envío)**. Esto es fundamental para garantizar la coherencia en revistas multilingües:
*   Si un artículo está configurado en **Inglés ("en")**, el sistema utilizará:
    1.  El formato de fecha corta definido para Inglés en OJS.
    2.  Los nombres de meses en Inglés ("January" en lugar de "Enero").
*   Si un artículo está en **Español ("es")**, utilizará el formato y nombres en Español.

Esto ocurre independientemente del idioma en el que el administrador esté visualizando el panel de control. Se toma siempre el `Locale Key` del artículo/envío.

## 3. Implementación Técnica

### Resumen
El procesamiento de fechas se basa en un mecanismo que intercepta la generación de citas en CSL.

1.  **Orquestación:** `JatsParserPlugin` obtiene el formato de fecha basado en el *locale* del envío (submission) y lo pasa al `Document`.
2.  **Lógica:** La clase `DateFormatter` recibe este formato, lo parsea (soportando formatos PHP y `strftime` de OJS) y lo convierte a estructuras XML compatibles con CSL (`<date-part>`).
3.  **Inyección:** Se sustituye dinámicamente la macro de fecha en el archivo `.csl` antes de procesarlo con `citeproc-php`.

### Clase `DateFormatter`

La clase `DateFormatter` procesa los formatos de fecha de PHP/OJS y el estándar de citación CSL (Citation Style Language). Su función principal es recibir una cadena de formato simple (como `d-m-Y`) y transformarla en una estructura lógica de macros XML que un motor de citación pueda interpretar.

**¿Qué hace exactamente esta clase?**

Imagina que en OJS configuras que las fechas se vean así: `15 de Febrero, 2026`. PHP entiende eso como una cadena de texto simple, pero el sistema de citas (CSL) necesita saber exactamente qué parte es el día, el mes y qué palabras son conectores.

La clase realiza tres tareas:

1.  **Desarmado (Tokenización):** Toma tu formato y lo rompe en piezas, identificando variables (`d`, `Y`) y texto decorativo ("de").
2.  **Lógica de Pivote (Pegamento):** Decide dónde poner los separadores. Si un separador va antes del año, lo pega como sufijo del mes; si va después, como prefijo del siguiente elemento.
3.  **Fabricación del XML:** Construye el bloque `<date-part>` que CSL necesita.

<details>
<summary><strong>Ver Detalles del Código (Para Desarrolladores)</strong></summary>

#### A. Clase `src/JATSParser/HTML/CSL/DateFormatter.php`

```php
<?php
namespace JATSParser\HTML\CSL;

class DateFormatter {
    public function injectOJSDateFormat(string $cslContent, string $dateFormat): string {
        // ...
    }
}
```

#### B. Integración en `JatsParserPlugin.inc.php`

```php
$lang = str_replace('_', '-', $submissionFile->getSubmissionLocale());
$dateFormat = $context->getSetting('dateFormatShort');

if (is_array($dateFormat)) {
    $locale = $submissionFile->getSubmissionLocale(); 
    $dateFormat = $dateFormat[$locale] ?? reset($dateFormat);
}

$htmlDocument->setReferences($citationStyle, $lang, false, $dateFormat);
```

#### C. Integración en `src/JATSParser/HTML/Document.php`

```php
use JATSParser\HTML\CSL\DateFormatter;

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

## 4. Resumen: ¿Por qué es importante?

Sin esta funcionalidad, si un editor cambiaba el formato de fecha en el panel de control, las citas bibliográficas no reflejaban el cambio, manteniendo siempre el formato fijo definido en el estilo CSL.

*   **Es automático:** Si cambias el formato en OJS, la bibliografía se actualiza sola.
*   **Es políglota:** Si el artículo está en inglés, pondrá "January"; si está en español, pondrá "Enero", usando siempre el formato correcto.
*   **Es a prueba de errores:** Fallbacks para artículos sin fecha.

