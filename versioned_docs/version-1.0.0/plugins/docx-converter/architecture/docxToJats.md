# Librería docxToJats

**docxToJats** es el motor principal encargado del procesamiento de archivos DOCX. Es una librería PHP independiente que cumple con los estándares OOXML (Office Open XML).

## Funcionalidades

*   **Descompresión OOXML**: Entiende que un `.docx` es un ZIP contenedor de XMLs (`document.xml`, `styles.xml`, etc.) y los procesa individualmente.
*   **Mapeo de Estilos**: Traduce los estilos de Word (ej. "Heading 1", "Normal", "Emphasis") a etiquetas JATS (`<sec>`, `<p>`, `<bold>`).
*   **Gestión de Recursos**: Extrae y renombra imágenes incrustadas en el documento Word para que sean referenciables desde el XML.

:::info Origen
Esta librería es un *fork* mantenido por Vitaliy-1, al cual SEDICI contribuye activamente, especialmente en la integración con el parser de citas.
:::
