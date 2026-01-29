# Citation Parser

**citation-parser-ojs** es un módulo desarrollado específicamente para dotar al convertidor de capacidades de **reconocimiento de referencias**.

En su versión original, `docxToJats` convertía la bibliografía en un bloque de texto plano o "citas mixtas" (`<mixed-citation>`). Este módulo intercepta ese texto y aplica una lógica de análisis para generar citas estructuradas (`<element-citation>`).

## Cómo Funciona (Regex)

El parser utiliza **Expresiones Regulares (Regex)** diseñadas para el estilo **APA 7ma Edición**.

1.  **Segmentación**: Identifica patrones comunes de separación (autores, año entre paréntesis, título, fuente).
2.  **Extracción**: Captura grupos de datos específicos.
    *   **Autores**: Apellidos e iniciales.
    *   **Año**: `(\d{4})`
    *   **Título**: Texto hasta el punto seguido del título de la revista o editorial.
    *   **Fuente**: Identificación de DOIs (`10.xxxx/`) o URLs.
3.  **Construcción XML**: Genera el nodo JATS correspondiente.

### Ejemplo de Procesamiento

**Entrada (DOCX):**
> Pérez, J. (2023). Análisis de XML. Revista de Informática, 5(2), 10-20. https://doi.org/10.1234/ri.v5i2

**Salida (JATS Generado):**
```xml
<ref id="B1">
  <label>1</label>
  <element-citation publication-type="journal">
    <person-group person-group-type="author">
      <name>
        <surname>Pérez</surname>
        <given-names>J.</given-names>
      </name>
    </person-group>
    <year iso-8601-date="2023">2023</year>
    <article-title>Análisis de XML</article-title>
    <source>Revista de Informática</source>
    <volume>5</volume>
    <issue>2</issue>
    <fpage>10</fpage>
    <lpage>20</lpage>
    <pub-id pub-id-type="doi">10.1234/ri.v5i2</pub-id>
  </element-citation>
</ref>
```

## Extensibilidad
Aunque actualmente está optimizado para APA 7, la arquitectura basada en patrones permite añadir nuevas clases para soportar otros estilos de citación en el futuro.
