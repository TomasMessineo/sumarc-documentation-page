Funcionalidad

Se desarrolló una nueva funcionalidad en el plugin JATSParser la cual permite que las referencias bibliográficas generadas mediante CiteProc respeten el formato de "fecha corta" configurado en la revista OJS. Anteriormente, el formato de fecha estaba fijo en el archivo CSL, ignorando las preferencias de la revista y el idioma del artículo.

Para modificar el formato en el que aparecen las fechas en las referencias bibliográficas, el gestor de la revista debe seguir estos pasos en el panel de administración de OJS:

    Ir a Sitio Web > Configuración > Fecha y hora.
    Buscar el campo Formato de fecha (corta).
    Ingresar el formato deseado.

Ejemplos comunes:

    d-m-Y → 20-01-2025
    d.m.Y → 20.01.2025
    d de F de Y → 20 de enero de 2025

Tokens disponibles:

    d: Día con cero inicial (01-31)
    j: Día sin cero inicial (1-31)
    m: Mes con cero inicial (01-12)
    n: Mes sin cero inicial (1-12)
    M: Nombre corto del mes (ene, feb)
    F: Nombre completo del mes (enero, febrero)
    Y: Año (2025)

Nota sobre Idiomas: El sistema respeta el idioma del artículo (envío).
Si un artículo está configurado en Inglés ("en"), el sistema utilizará el formato de fecha corta definido para Inglés en OJS. Esto hará que, por ejemplo, los nombres de meses en la referencia aparezcan en inglés (ej: "January" en lugar de "Enero"). Si un artículo está en Español ("es"), utilizará el formato y nombres en Español. Y así con cualquier otro idioma.
Para cada idioma instalado en OJS se puede definir el formato de fecha que se desea utilizar.
Implementación
El procesamiento de fechas se basa en un mecanismo que intercepta la generación de citas en CSL.

    Orquestación: JatsParserPlugin obtiene el formato de fecha basado en el locale del envío (submission) y lo pasa al Document.
    Lógica: La clase DateFormatter recibe este formato, lo parsea (soportando formatos PHP y strftime de OJS) y lo convierte a estructuras XML compatibles con CSL (<date-part>).
    Inyección: Se sustituye dinámicamente la macro de fecha en el archivo .csl antes de procesarlo con citeproc-php.

Clase "DateFormatter"

La clase DateFormatter es un una nueva clase diseñada para procesar los formatos de fecha de PHP/OJS y el estándar de citación CSL (Citation Style Language).
Su función principal es recibir una cadena de formato simple (como d-m-Y) y transformarla en una estructura lógica de macros XML que un motor de citación pueda interpretar, respetando separadores, conectores e idiomas.
Métodos Principales:

¿Qué hace exactamente esta clase?

Imagina que en OJS configuras que las fechas se vean así: 15 de Febrero, 2026.
PHP entiende eso como una cadena de texto simple, pero el sistema de citas (CSL) es muy "especial": no acepta texto suelto, necesita que le digas exactamente qué parte es el día, qué parte es el mes y qué palabras van en medio.

La clase DateFormatter hace tres trabajos sucios:
1. Desarma la fecha (La "Tokenización")

Toma tu formato (ej. d-m-Y) y lo rompe en piezas. Es lo suficientemente inteligente para saber que:

    d es el Día.

    - es un Separador.

    m es el Mes.

    Y es el Año.

    Incluso sabe que si escribes la palabra "de", es texto decorativo y no una instrucción de fecha.

2. Decide dónde poner los "pegamentos" (Lógica de Pivote)

CSL exige que los espacios o guiones estén "pegados" a un número. Esta clase decide:

    Si el separador va antes del año (como en 15 de Febrero), lo pega como un "sufijo" del mes.

    Si el separador va después del año, lo pega como un "prefijo" de lo que sigue.
    Esto evita que la cita se rompa o que aparezcan espacios dobles extraños.

3. Fabrica el XML final

Una vez que tiene todo ordenado, construye un bloque de código XML que el motor de citas puede leer.

    En lugar de enviarle: d-m-Y

    Le envía esto:
    XML

    <date-part name="day" form="numeric" suffix="-"/>
    <date-part name="month" form="numeric" suffix="-"/>
    <date-part name="year" form="long"/>

En resumen: ¿Por qué es importante?

Sin esta clase, si un editor cambiaba el formato de fecha en el panel de control de la revista, las citas bibliográficas no cambiaban o se veían mal.

Con esta clase:

    Es automático: Si cambias el formato en OJS, la bibliografía se actualiza sola.

    Es políglota: Si el artículo está en inglés, pondrá "January"; si está en español, pondrá "Enero", usando siempre el formato correcto.

    Es a prueba de errores: Si un artículo no tiene fecha de publicación, la clase inserta automáticamente un aviso de "s.f." (sin fecha) para que la cita no quede vacía.

¿Te parece que con esta analogía del "traductor" queda más claro para tus compañeros de trabajo? Si quieres, puedo resumir esto en tres puntos clave para que los pongas en la "Descripción" del ticket.

injectOJSDateFormat(string $cslContent, string $dateFormat)

    Qué hace: Toma un archivo CSL completo y busca una macro específica llamada date-bib.
    Lógica: Genera un nuevo bloque XML de fecha basado en el formato dinámico de OJS y lo inyecta mediante expresiones regulares (preg_replace), reemplazando la macro antigua por una nueva que incluye validaciones (como mostrar "s.f." o "no date" si no hay fecha de publicación).

*mapPhpDateToCsl(string $format)*

Es el "cerebro" de la clase. Realiza la conversión técnica en tres pasos:

    Normalización: Si el formato viene con símbolos de % (estilo antiguo strftime), los traduce a letras de formato date() de PHP.
    Tokenización: Analiza la cadena carácter por carácter. Utiliza una estrategia específica para distinguir si una letra es un comando de fecha (como la d de día) o si es parte de una palabra (como la "d" en la preposición "de").

Estrategia "Pivot by Year" (Pivote por Año):

CSL no permite poner texto suelto entre las etiquetas de fecha. Todo el texto decorativo debe "colgar" de un número como prefijo o sufijo.
La lógica: La clase busca dónde está el Año.

    Todo lo que esté antes del año, se pega como un sufijo del elemento anterior.
    Todo lo que esté después del año, se pega como un prefijo del elemento siguiente.
    Esto garantiza que la estructura XML sea válida y las distancias entre palabras sean perfectas.

Resumen visual rápido:

Si tu formato es Día - Mes - Año:
El XML dirá: "Día (con un guion al final)" + "Mes (con un guion al final)" + "Año".
Resultado: 15- 05- 2026 → 15-05-2026

Si tu formato es Año / Mes / Día:
El XML dirá: "Año" + "Mes (con una barra al principio)" + "Día (con una barra al principio)".
Resultado: 2026 /05 /15 → 2026/05/15

createDatePartXml(...)


Un método auxiliar que construye la etiqueta XML <date-part />. Se encarga de limpiar los caracteres especiales (como espacio innecesarios) usando htmlspecialchars para que el XML resultante sea válido.
Flujo de Datos (Ejemplo Práctico)
Si el sistema recibe el formato: j \d\e F \d\e Y

    Entrada: j de F de Y
    Identificación de Partes:
    j -> día (numeric)
    F -> mes (long)
    Y -> año (long)
    Identificación de Separadores: " de "
    Construcción CSL:
    Como "j" está antes del año, recibe el primer " de " como suffix.
    Como "F" está antes del año, recibe el segundo " de " como suffix.
    Resultado XML:

    <date-part name="day" form="numeric" suffix=" de "/>
    <date-part name="month" form="long" suffix=" de "/>
    <date-part name="year" form="long"/>

Integración en JatsParserPlugin.inc.php

En este archivo se obtiene la configuración de formato de fecha desde el contexto de la revista y se selecciona el locale correcto.

// Método "SetReferences" 
$lang = str_replace('_', '-', $submissionFile->getSubmissionLocale());
$dateFormat = $context->getSetting('dateFormatShort');

// Fix: Usar el idioma del ENVÍO, no el de la sesión administrativa
if (is_array($dateFormat)) {
    $locale = $submissionFile->getSubmissionLocale(); 
    $dateFormat = $dateFormat[$locale] ?? reset($dateFormat);
}

// Se pasa $dateFormat como 4to parámetro
$htmlDocument->setReferences($citationStyle, $lang, false, $dateFormat);

Integración en src/JATSParser/HTML/Document.php

El documento utiliza el DateFormatter para aplicar el formato antes de generar las referencias.

use JATSParser\HTML\CSL\DateFormatter; // Importar
// ...

public function setReferences(..., string $dateFormat = null): void {
    // ...
    if (!empty($this->jatsDocument->getReferences())) {
        // Pasar dateFormat a extractReferences
        $this->extractReferences($this->jatsDocument->getReferences(), $dateFormat);
    }
}

protected function extractReferences(array $references, string $dateFormat = null): void {
    // ...
    if ($dateFormat) {
        $cslContent = file_get_contents($styleName);
        if ($cslContent) {
            // Instanciar formateador y procesar
            $dateFormatter = new DateFormatter();
            $cslContent = $dateFormatter->injectOJSDateFormat($cslContent, $dateFormat);

            // Guardar temporal con .csl para que citeproc lo lea
            $tempStyleFile = tempnam(sys_get_temp_dir(), 'csl_') . '.csl';
            file_put_contents($tempStyleFile, $cslContent);
            $styleName = $tempStyleFile;
        }
    }
    // ...
}
