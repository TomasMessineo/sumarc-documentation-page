# XMLMetadataBuilder

**XMLMetadataBuilder** es un plugin genérico para OJS 3.4 diseñado para automatizar el enriquecimiento de archivos JATS XML inyectando metadatos bibliográficos y editoriales precisos extraídos directamente del sistema OJS.

:::info Fuente
Repositorio de desarrollo:
[Ver repositorio en GitHub](https://github.com/san-fernandez/pruebaPluginMetadata)
:::

## Función Principal
El objetivo principal del plugin es tomar un archivo XML JATS "crudo" (que puede contener solo el cuerpo del texto) y completarlo con toda la información necesaria en la sección `<front>` para cumplir con el estándar **JATS Publishing DTD 1.4**.

Esto elimina la necesidad de cargar manualmente metadatos redundantes en el XML, garantizando que la información del archivo coincida exactamente con lo registrado en OJS.

## Características Clave

*   **Extracción Automática:** Obtiene datos directamente de los objetos de OJS (`Submission`, `Publication`, `Context`), incluyendo:
    *   **Revista:** Título, eISSN, editorial.
    *   **Artículo:** Título, resumen (abstract), palabras clave, DOIs, fechas de publicación.
    *   **Autores:** Nombres, afiliaciones, ORCIDs, correo electrónico, roles de contribución.
    *   **Licencia:** Información de derechos de autor y licencias Creative Commons.
*   **Previsualización:** Permite visualizar cómo quedará el bloque `<front>` del XML antes de aplicar los cambios definitivos.
*   **Gestión de Archivos:** Crea un nuevo archivo enriquecido (por ejemplo, `articulo-enriched.xml`) sin sobrescribir el original, y puede publicarlo automáticamente como una galerada.
*   **Arquitectura Modular:** Separa claramente la lógica de extracción (`MetadataExtractor`) de la construcción del XML (`JATSBuilder`), facilitando el mantenimiento.

## Flujo de Trabajo
1.  En la etapa de **Producción**, el editor selecciona un archivo XML existente.
2.  Accede a la herramienta de enriquecimiento proporcionada por el plugin.
3.  El sistema genera una vista previa de los metadatos inyectados.
4.  Al confirmar, se genera y guarda el nuevo archivo XML enriquecido en el sistema.

## Componentes Técnicos
*   **MetadataExtractor:** Clase encargada de mapear los datos de la base de datos de OJS a estructuras de datos intermedias.
*   **JATSBuilder:** Utiliza `DOMDocument` para manipular el XML y construir la estructura de etiquetas JATS correcta.
*   **EnrichmentService:** Servicio que coordina la lectura del archivo, el procesamiento y el guardado del resultado.
