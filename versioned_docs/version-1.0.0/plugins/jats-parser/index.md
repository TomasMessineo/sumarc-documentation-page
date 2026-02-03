# JATSParser

**JATSParser** es un plugin diseñado para transformar el contenido estructurado de los archivos **XML JATS** en formatos de lectura final de alta calidad, como **PDF** y **HTML para visores**.

Su función principal es interpretar la semántica del estándar JATS (Journal Article Tag Suite) y convertirla en una presentación visual amigable para el lector humano, todo ello sin perder la riqueza de los metadatos y la estructura original del artículo científico.

## Características Principales

*   **Generación de PDF/A:** Produce documentos PDF que cumplen con estándares de archivo y preservación digital a largo plazo.
*   **Sistema de Plantillas Personalizables:** Permite diseñar la apariencia del artículo (encabezados, pies de página, tipografía, columnas) utilizando tecnologías estándar como HTML y CSS, sin tocar el código fuente del plugin.
*   **Procesamiento de Referencias y Citas:** Integra motores de citación (CSL) para renderizar automáticamente las referencias bibliográficas en el formato deseado (ej. APA, Harvard), asegurando navegabilidad interna entre la cita en el texto y la bibliografía final.
*   **Visualización Web:** Facilita la creación de vistas HTML responsivas generadas directamente desde el XML.

## ¿Por qué usar JATSParser?

JATSParser automatiza la salida final directamente desde el XML validado en el flujo editorial de OJS, eliminando la necesidad de procesos de maquetación manual o programación compleja. Esto garantiza:
1.  **Integridad de Metadatos:** Recupera directamente los metadatos cargados en OJS, asegurando que si la información está completa en el sistema, el PDF resultante será lo más detallado posible.
2.  **Consistencia:** El documento final refleja exactamente los datos y estructura definidos en el XML.
3.  **Eficiencia:** Se elimina el paso manual de maquetación gráfica.
4.  **Preservación:** Se generan archivos optimizados para repositorios digitales.

Para detalles sobre cómo configurar y personalizar las salidas visuales, consulte la **[Guía de Plantillas](./pdf-templates.md)**.
