# JATSParser

Este desarrollo transforma el plugin de una herramienta rígida a un ecosistema flexible y modular. La separación de responsabilidades entre el procesamiento del XML JATS, la orquestación del catálogo, la maquetación (TPL) y los estilos (CSS) cumple con el objetivo principal de eliminar la barrera de programación, otorgando una herramienta poderosa para personalizar la presentación de artículos científicos.

## Objetivos del Nuevo Diseño

*   **Autonomía y Descentralización del Diseño:** Permitir que cada revista tenga total autonomía sobre la estructura visual de su salida en PDF, sin depender de desarrollos de software para cada cambio estético.
*   **Eliminación de la Barrera de la Programación:** Facilitar modificaciones mediante una interfaz de configuración y el uso de tecnologías web estándar (HTML/CSS) en lugar de código PHP complejo.
*   **Flexibilidad de Estilos:** Implementación de "Cascading de CSS" para aplicar cambios estéticos sin invalidar la lógica base.
*   **Preservación Digital:** Garantizar que los archivos de salida cumplan con el estándar **PDF/A**, asegurando que el contenido sea autosuficiente para el archivado a largo plazo.

## Arquitectura Técnica

La arquitectura se ha redefinido para desacoplar el procesamiento del contenido de su presentación visual:

1.  **Procesamiento XML JATS:** Conversión de la estructura JATS a un formato intermedio utilizable (HTML funcional).
2.  **Modelo de "Catálogo":** Todo se basa en un modelo de catálogo (`catalog.xml`), donde se define la estructura que tendrá el PDF. El sistema procesa este XML, valida la existencia de los archivos referenciados y genera el documento.
3.  **Motor de Plantillas (Smarty):** Se utilizan archivos `.tpl` (pseudo-HTML) que contienen la estructura de los distintos componentes.
4.  **Generación de PDF (mPDF):** Se utiliza la librería **mPDF** debido a su integración con Smarty y su capacidad de cumplir con estándares técnicos como PDF/A.

## Funcionalidades Clave

*   **Validación de Integridad:** El sistema valida toda la integridad de la plantilla (existencia del catálogo, archivos estructurales y referencias) antes de generar el PDF.
*   **Manejo de Imágenes y Logos:** Las imágenes se definen en el catálogo. Se soporta la subida de logos institucionales y de la revista, que no son parte fija del TPL sino recursos configurables.
*   **Navegación Interna:** Soporte para citas y referencias navegables dentro del documento.
*   **Herencia de Plantillas:** Capacidad de extender una plantilla base, sobrescribiendo solo los archivos necesarios (HTML, CSS o imágenes) mientras se mantienen los originales como respaldo.

---
Para detalles sobre cómo construir y configurar las plantillas, consulte la **[Guía de Configuración de Plantillas](./pdf-templates.md)**.
