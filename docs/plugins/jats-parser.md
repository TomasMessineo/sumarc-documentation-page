# JATSParser

**JATSParser** es un motor avanzado de generación de galeradas (formatos de publicación) para OJS 3. Transforma archivos JATS XML en documentos PDF y HTML visualmente ricos.

:::info Fuente
Desarrollado y extendido por SEDICI.
[Ver repositorio en GitHub](https://github.com/sedici/JATSParserPlugin/tree/stable-3_4)
:::

## Características Principales

### 1. Generación de PDF Dinámica
Utiliza la librería **TCPDF** para generar archivos PDF al vuelo a partir del XML.
*   **Plantillas Personalizables:** Implementa un patrón *Strategy* que permite definir múltiples diseños (Templates) para diferentes revistas o tipos de artículo sin tocar el código base.
*   **Componentes Modulares:** Los PDFs se construyen ensamblando componentes (`Header`, `Body`, `Footer`, `TemplateBody`) y *Renderers* reutilizables.

### 2. Soporte Multilenguaje
El plugin está preparado para manejar metadatos y contenido en varios idiomas (Español, Inglés, Portugués), utilizando archivos de traducción centralizados (`Translations.php`) para etiquetas automáticas en el PDF (ej. "Palabras clave", "Keywords").

### 3. Tabla de Citas (Citation Tables)
Una funcionalidad exclusiva que permite gestionar y visualizar las referencias bibliográficas según normas específicas.
*   **Soporte APA 7:** Incluye estilos y lógica para formatear citas en norma APA 7ma edición.
*   **Interfaz en OJS:** Permite a los editores revisar y ajustar cómo se verán las citas en el PDF final.

### 4. Renderizado HTML
Además de PDF, genera una versión HTML del artículo para lectura directa en el navegador, mejorando la accesibilidad y el SEO del contenido.

## Estructura Técnica
*   **`JatsParserPlugin.php`:** Punto de entrada que orquesta la obtención de metadatos y la selección de la estrategia de plantilla.
*   **`PDFBodyHelper.php`:** Clase crucial que adapta el contenido HTML/XML del cuerpo del artículo para que sea compatible con el motor de renderizado de TCPDF.
*   **Renderers:** Scripts reutilizables para elementos comunes como listas de autores, licencias Creative Commons, logos ORCID, etc.

## Configuración y Personalización
Para crear una nueva apariencia para una revista, los desarrolladores pueden crear una nueva carpeta en `Templates/` siguiendo la estructura predefinida de componentes, lo que hace al sistema altamente extensible.
