# XMLMetadataBuilder

**XMLMetadataBuilder** es un plugin desarrollado para **Open Journal Systems (OJS)** con el propósito de enriquecer y completar los metadatos de los archivos **XML JATS** dentro del flujo editorial.

En el contexto de la producción científica digital, la calidad de un artículo no se define únicamente por su contenido textual, sino también por la cantidad y precisión de sus metadatos. Estos constituyen la base para la indexación, interoperabilidad, preservación y evaluación de la producción académica.

:::info Fuente
Repositorio de desarrollo:
[Ver repositorio en GitHub](https://github.com/san-fernandez/pruebaPluginMetadata)
:::

## Integración en el Flujo Editorial

El plugin se activa específicamente en la fase de **Producción** del flujo editorial de OJS, una vez que el artículo ha superado las etapas de revisión y corrección.

![Proceso XMLMetadataBuilder](/img/process-xmlmetadatabuilder.jpg)

1.  El editor selecciona un archivo XML marcado como *production-ready* desde la pestaña “Enriquecedor XML”.
2.  El sistema permite previsualizar los metadatos que serán inyectados.
3.  Se ejecuta el enriquecimiento antes de generar las galeradas finales (PDF, HTML), asegurando que los metadatos estén completos desde el origen.

## Arquitectura del Sistema

El plugin adopta una arquitectura modular en capas, diseñada para desacoplar la extracción de datos de la construcción del XML.

![Arquitectura XMLMetadataBuilder](/img/arquitectura-xmlmetadatabuilder.png)

El sistema se estructura en cuatro componentes centrales:

### 1. MetadataExtractor
Responsable de **extraer y normalizar** todos los metadatos relevantes desde la base de datos de OJS (autores, afiliaciones, fechas, licencias). Actúa como un puente que abstrae la complejidad de OJS, produciendo una estructura de datos homogénea para su procesamiento.

### 2. JATSBuilder
Transforma los metadatos normalizados en una estructura XML válida conforme al estándar **JATS Publishing Schema**.
*   Construye el elemento `<front>` completo.
*   Asegura la compatibilidad con perfiles estrictos como **SciELO**.
*   Garantiza el orden correcto de elementos y atributos.

### 3. XMLMetadataProcessor
Orquesta el proceso de enriquecimiento operando sobre el documento XML original mediante un árbol DOM.
*   Coordina la extracción y construcción.
*   Reemplaza la sección `<front>` existente por la versión enriquecida.
*   **Preserva intactos** el cuerpo (`<body>`) y las referencias (`<back>`) del documento original.

### 4. EnrichmentService
Punto de entrada desde la interfaz de usuario de OJS.
*   Gestiona la lectura y escritura de archivos.
*   Persiste los cambios en el sistema.
*   Maneja la creación de galeradas y archivos dependientes.

## Impacto en la Interoperabilidad

La adopción de este sistema de enriquecimiento trae beneficios directos para la calidad editorial:

*   **Reducción de errores de validación**: Los XML generados presentan significativamente menos errores en validadores como el de SciELO.
*   **Cumplimiento de estándares**: Alineación con las recomendaciones de **JATS4R** (JATS for Reuse).
*   **Preservación Digital**: Al completar metadatos estructurales (fechas, licencias, identificadores), se asegura que el artículo sea interpretable a largo plazo.
*   **Soberanía Tecnológica**: Al estar integrado nativamente en SUMARC, se evita la dependencia de herramientas externas ("cajas negras") para la curaduría de metadatos.

## Características Clave

*   **Extracción Automática:** Obtiene datos directamente de los objetos de OJS (`Submission`, `Publication`, `Context`).
*   **Previsualización:** Permite visualizar los cambios antes de aplicarlos.
*   **Gestión de Archivos:** Crea versiones enriquecidas sin destruir el original (opcional) y facilita su publicación como galerada.

