---
title: Configuración de Plantillas PDF
---

# Configuración y Creación de Plantillas

El sistema de plantillas se basa en un modelo de **Catálogo**, definido mediante un archivo XML que describe la estructura y los componentes del PDF final.

## Propuestas para el Desarrollo de Plantillas

Una plantilla consta de:
1.  **Archivo de Descripción (`catalog.xml`)**: Define el nombre, descripción, versión, plantilla base (para herencia) y el listado de archivos incluidos.
2.  **Archivos Pseudo-HTML (`.tpl`)**: Contienen la estructura de los distintos componentes (header, body, footer). Incluyen:
    *   Variables para reemplazar (metadatos, contenido).
    *   Estructuras de control (iteradores para múltiples idiomas).
    *   Inclusión de otros archivos.
3.  **Archivos CSS**: Definen reglas estructurales (columnas, márgenes) y aspectos visuales (fuentes, colores).
4.  **Imágenes**: Logos de revista, institución, licencias, etc.

## Funcionamiento del Catálogo

El proceso de generación sigue estos pasos:
1.  **Búsqueda**: El plugin busca el directorio de la plantilla que utiliza la revista.
2.  **Carga de Archivos**:
    *   Si es una plantilla base, carga todos sus archivos.
    *   Si es una plantilla extendida, carga primero la base y luego reemplaza con los archivos modificados de la extendida.
3.  **Cascading CSS**: Carga los CSS de la plantilla base y luego los de la extendida, aprovechando la cascada de estilos para no "pisar" definiciones innecesariamente.
4.  **Procesamiento**:
    *   Reemplaza variables por sus valores (metadatos o resultados de lógica).
    *   Inserta el CSS procesado.
    *   Genera el PDF final validando la integridad de todos los componentes.

## Estructura de Archivos

Una estructura típica de plantilla incluye:

```text
NombrePlantilla/
├── catalog.xml           # Definición del catálogo
├── styles.css            # Estilos globales
├── header.tpl            # Componente de encabezado
├── body.tpl              # Componente del cuerpo del artículo
├── footer.tpl            # Componente de pie de página
└── images/               # Logos y gráficos
```

## Características Técnicas

*   **Rutas Relativas:** El catálogo maneja las rutas de manera interna para evitar dependencias absolutas.
*   **Validación:** Se valida que el catálogo exista, que las partes del apartado "build" estén presentes y que los archivos referenciados sean accesibles.
*   **Márgenes:** Aunque mPDF permite márgenes, se optó por definir márgenes globales estáticos para el documento y permitir ajustes finos (incrementales) mediante CSS si es necesario.
*   **Imágenes por Defecto:** Si una imagen definida no carga correctamente, el sistema utiliza una imagen vacía de reemplazo para no romper la generación.

## Gestión de Plantillas

Desde el panel de configuración (en desarrollo):
*   **Listar:** Ver todas las plantillas disponibles.
*   **Exportar:** Descargar una plantilla completa (original o modificada) como ZIP.
*   **Importar:** Subir nuevas plantillas mediante ZIP.
*   **Seleccionar:** Elegir la plantilla activa para la revista.
*   **Personalizar:** Crear una copia de una plantilla base en el directorio privado de la revista para editar sus archivos HTML/CSS.
