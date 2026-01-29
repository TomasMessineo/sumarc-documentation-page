# DocxConverter

**DocxConverter** es un plugin para OJS 3 (versiones 3.3 y 3.4) que permite convertir documentos en formato Microsoft Word (`.docx`) al estándar JATS XML.

:::info Fuente
Este plugin es mantenido por SEDICI y está basado en el trabajo original de Vitaliy-1.
[Ver repositorio en GitHub](https://github.com/sedici/docxConverter/tree/dev)
:::

## Función Principal
Automatizar la creación de una estructura base JATS XML a partir de un archivo DOCX, facilitando el inicio del proceso de marcación semántica. El resultado es compatible con editores como **Texture**.

## Características Soportadas
El convertidor soporta una amplia gama de elementos de DOCX/OOXML:

*   **Texto y Formato:**
    *   Párrafos y saltos de línea.
    *   Negrita, cursiva, subrayado, tachado.
    *   Superíndices y subíndices.
*   **Estructura:**
    *   Encabezados y secciones (anidados).
    *   Listas (ordenadas y desordenadas, anidadas).
*   **Componentes Complejos:**
    *   **Tablas:** Soporte para celdas fusionadas (rowspan/colspan) y leyendas.
    *   **Figuras:** Imágenes JPEG y PNG con sus leyendas.
    *   **Enlaces externos.**
*   **Citas:**
    *   Citas crudas (texto plano).
    *   Soporte para referencias estructuradas mediante plugins de Zotero para Word.

## Limitaciones Conocidas
Algunos elementos pueden requerir ajuste manual posterior:
*   Fórmulas complejas.
*   Metadatos complejos incrustados en el cuerpo (se recomienda usar los metadatos de OJS).
*   El plugin **no** extrae automáticamente metadatos bibliográficos complejos (título, año, autores) de una lista de referencias en texto plano; estas se guardan como "mixed-citation".

## Flujo de Uso
1.  **Carga:** En la etapa de *Copyediting* o *Production* de OJS, suba el archivo DOCX como un "Borrador" (Draft File).
2.  **Conversión:** Aparecerá un botón o opción **"Convert to JATS XML"** debajo del archivo cargado.
3.  **Resultado:** Si la conversión es exitosa, aparecerá un nuevo archivo XML en la lista, listo para ser editado con Texture.

## Recomendaciones para Autores
Para obtener los mejores resultados, el documento original debe estar bien estructurado:
*   Usar los estilos de título de Word (Título 1, Título 2...) para las secciones.
*   No usar formato manual para simular listas; usar las herramientas de lista del procesador de texto.
*   Asegurar que las tablas sean reales y no texto tabulado.
