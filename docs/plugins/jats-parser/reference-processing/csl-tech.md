---
sidebar_position: 2
---

# Información sobre CSL

**CSL (Citation Style Language)** es un lenguaje abierto basado en XML que describe el formato de citas y bibliografías. Es el estándar de facto utilizado por gestores de referencias modernos como Zotero, Mendeley y Papers.

:::tip Documentación Oficial
Para más detalles técnicos, visita [citationstyles.org](https://citationstyles.org/).
:::

## Conceptos Clave

Un archivo CSL funciona como una "hoja de estilos" para referencias. Define cómo debe ordenarse, puntuarse y presentarse la información.

### Estructura Básica
Un archivo CSL tiene dos secciones principales:
1.  `<citation>`: Define cómo se ven las citas dentro del texto (ej. `(Pérez, 2023)`).
2.  `<bibliography>`: Define cómo se ve la lista de referencias al final del documento.

Dentro de estas secciones, se organizan elementos lógicos llamados **Macros**.

### Componentes del Lenguaje

#### 1. Macros (`<macro>`)
Son funciones reutilizables. En lugar de repetir lógica, se encapsulalas reglas para formatear partes específicas (como autor, fecha o título) y luego se las llama.

*   **Ejemplo**: `<macro name="title">` define cómo se muestra el título (en cursiva, entre comillas, etc.) dependiendo del tipo de documento.

#### 2. Condicionales (`<choose>`, `<if>`, `<else>`)
Permiten mostrar información diferente según el contexto o los datos disponibles.

```xml
<choose>
  <!-- 1. Si es una tesis... -->
  <if type="thesis">
     <text value="Tesis Doctoral"/>
  </if>
  <!-- 2. Si no es tesis, pero tiene DOI... -->
  <else-if variable="DOI">
     <text prefix="https://doi.org/" variable="DOI"/>
  </else-if>
  <!-- 3. Fallback final -->
  <else>
     <text value="Documento sin identificar"/>
  </else>
</choose>
```

#### 3. Grupos y Delimitadores (`<group>`)
Evitan problemas comunes de puntuación (como `Autor, , Título`). Un grupo con delimitador solo inserta el separador si los elementos que contiene existen.

```xml
<group delimiter=", ">
  <text variable="genre"/>      <!-- Ej: Tesis de Maestría -->
  <text variable="publisher"/>  <!-- Ej: Universidad Nacional -->
</group>
```
*   Si ambos existen: `Tesis de Maestría, Universidad Nacional`
*   Si falta la editorial: `Tesis de Maestría` (sin coma sobrante).

## Relación con CSL-JSON

CSL es solo el conjunto de reglas. Para funcionar, necesita datos. En JATS Parser, estos datos se suministran en formato **CSL-JSON**.

Cuando el CSL dice `<text variable="title"/>`, el procesador CiteProc busca internamente una clave `"title"` en el objeto JSON que le pasamos.

> **Importante**: El archivo CSL no "busca" información en la base de datos de OJS. Solo formatea lo que JATS Parser le envía en el JSON.
