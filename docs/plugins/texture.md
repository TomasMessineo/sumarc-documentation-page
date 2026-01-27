# Texture

**Texture** es el editor visual WYSIWYG (What You See Is What You Get) integrado en SUMARC para la manipulación directa de archivos JATS XML dentro del flujo de trabajo de OJS.

:::info Fuente
Versión personalizada por SEDICI basada en el proyecto Texture de PKP/Substance.
[Ver repositorio en GitHub](https://github.com/sedici/texture/tree/stable-3_4_0)
:::

## Función Principal
Permitir a editores y autores corregir y refinar el contenido semántico de un artículo sin necesidad de editar código XML directamente. Texture presenta el documento como un manuscrito tradicional pero mantiene la estructura JATS por debajo.

## Flujo de Trabajo
1.  En la etapa de **Producción** de OJS, se debe tener un archivo JATS XML (generalmente generado previamente por DocxConverter).
2.  Al hacer clic en editar, se abre la interfaz de Texture.
3.  El usuario realiza cambios visuales (corregir texto, ajustar figuras, editar citas).
4.  Al guardar, Texture actualiza el archivo XML en el servidor.

## Etiquetas JATS Soportadas (Selección)
Texture soporta un subconjunto robusto de etiquetas JATS esenciales para publicaciones científicas:

| Elemento | Descripción | Estado |
| :--- | :--- | :---: |
| `p` | Párrafos de texto. | ✅ |
| `sec` | Secciones y subsecciones con títulos. | ✅ |
| `list` | Listas ordenadas y desordenadas. | ✅ |
| `fig` / `graphic` | Figuras e imágenes. | ✅ |
| `table-wrap` | Tablas complejas. | ✅ |
| `disp-quote` | Citas textuales destacadas. | ✅ |
| `disp-formula` / `tex-math` | Ecuaciones matemáticas (LaTeX). | ✅ |
| `code` | Bloques de código. | ✅ |

### No Soportado
Algunos elementos muy específicos como estructuras químicas (`chem-struct-wrap`) o multimedia (`media`) pueden no tener representación visual directa o soporte de edición.

## Manejo de Imágenes
Para que las imágenes se visualicen en Texture:
1.  Deben cargarse como **archivos dependientes** en OJS en la misma etapa que el XML.
2.  Texture los vinculará automáticamente si las referencias en el XML coinciden.
