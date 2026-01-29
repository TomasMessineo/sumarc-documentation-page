# Arquitectura Técnica

El plugin **DocxConverter** no es un monolito, sino que orquesta el funcionamiento de dos librerías especializadas en PHP.

## Estructura de Componentes

1.  **Plugin OJS (`docxConverter`)**: Es la capa de interfaz. Se encarga de mostrar el botón en el flujo de trabajo, gestionar los archivos de entrada/salida y llamar a la librería de conversión.
2.  **Librería de Conversión (`docxToJats`)**: Es el motor principal. Lee el archivo OOXML (ZIP comprimido) y transforma sus componentes (párrafos, estilos, tablas) a JATS XML.
3.  **Parser de Citas (`citation-parser`)**: Es un módulo especializado inyectado en `docxToJats`. Se encarga exclusivamente de analizar el texto de la bibliografía para darle estructura semántica.

:::note Desarrollo Modular
Esta separación permite actualizar o mejorar el parser de citas (por ejemplo, para soportar Vancouver o Chicago) sin necesidad de modificar el nucleo de conversión de documentos.
:::
