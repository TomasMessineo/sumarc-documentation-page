# Guía de Modificación de Texture

Esta guía detalla el proceso técnico para extender las funcionalidades de Texture y adaptar el soporte de referencias bibliográficas, incluyendo la adición de nuevos tipos de colaboradores (*person-group types*) y campos personalizados.

:::info Contexto
Esta documentación surge del trabajo realizado para **SUMARC**, donde fue necesario ampliar el esquema JATS soportado por Texture para cumplir con requisitos editoriales específicos.
:::

## Alcance

Los pasos descritos permiten:

1.  Agregar nuevos roles de personas (*person-group*) y campos a cualquier tipo de referencia.
2.  Asegurar su correcta visualización en la interfaz.
3.  Garantizar la importación desde XML JATS.
4.  Garantizar la exportación correcta de vuelta a JATS.

---

## Caso 1: Implementación de nuevos *person-group-types*

Aunque los ejemplos utilizan un nuevo rol (`coordinator`), el procedimiento es generalizable a cualquier `person-group-type` definido en JATS.

### Paso 1: Extender el schema de la referencia

**Objetivo**: Permitir que el modelo interno de Texture reconozca el nuevo campo.

**Ubicación**: Buscar la definición del schema correspondiente al tipo de referencia deseado, por ejemplo, `BookRef.schema`.

**Acción**: Agregar una nueva entrada utilizando `substance.CHILDREN('ref-contrib')`.

```javascript
BookRef.schema = {
  type: 'book-ref',
  authors: substance.CHILDREN('ref-contrib'),
  editors: substance.CHILDREN('ref-contrib'),
  coordinators: substance.CHILDREN('ref-contrib'), // ← NUEVO
  translators: substance.CHILDREN('ref-contrib'),
  // ... resto del schema
};
```

> **Importante**: Si el campo no existe en el schema, no podrá ser persistido ni serializado.

### Paso 2: Agregar rendering en la vista previa

**Objetivo**: Mostrar correctamente el nuevo rol en la previsualización de la referencia dentro del editor.

**Ubicación**: Buscar la función `renderer` asociada al tipo de referencia, por ejemplo `bookRenderer`.

**Acción**: Insertar el bloque de rendering después de los *person-groups* existentes.

```javascript
function bookRenderer($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId);
  let fragments = [];
  
  // Authors (existente)
  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    );
  }

  // ← NUEVO person-group
  if (entity.coordinators && entity.coordinators.length > 0) {
    let coordinatorLabel = entity.coordinators.length > 1 ? 'coords' : 'coord';
    fragments = fragments.concat(
      ' ',
      _renderAuthors($$, entity.coordinators, entityDb),
      ' (',
      coordinatorLabel,
      ').'
    );
  }
  // ... resto del renderer
}
```

**Convención de etiquetas**:
*   Singular: `coord`, `ed`, `trans`, `comp`, `curator`
*   Plural: `coords`, `eds`, `translators`, `comps`, `curators`

### Paso 3: Agregar etiquetas de la interfaz (UI labels)

**Objetivo**: Habilitar la edición del nuevo campo en la interfaz gráfica.

**Ubicación**: Configuración de labels.

**Acción**: Agregar dos labels por cada nuevo campo (visualización y edición).

```javascript
config.addLabel('coordinators', 'Coordinators');
config.addLabel('edit-coordinators', 'Edit Coordinators');
```

So se omite este paso, el campo no será accesible desde la UI.

### Paso 4: Importación desde JATS

**Objetivo**: Poblar el nuevo campo al cargar un XML existente.

**Ubicación**: Función `_importElementCitation`.

**Acción**: Agregar la importación del nuevo `person-group-type` usando `_importPersonGroup`.

```javascript
function _importElementCitation(el, node, doc, importer) {
  // ... código existente ...
  node.authors = _importPersonGroup(el, doc, 'author');
  node.editors = _importPersonGroup(el, doc, 'editor');
  node.coordinators = _importPersonGroup(el, doc, 'coordinator'); // ← NUEVO
  // ...
}
```

> **Nota crítica**: El valor `'coordinator'` debe coincidir exactamente con el atributo `person-group-type` presente en el XML JATS.

### Paso 5: Exportación de XML JATS

**Objetivo**: Asegurar que el nuevo campo se serialice correctamente al guardar.

**Ubicación**: Función `_exportElementCitation`.

**Acción**: Agregar una llamada a `_exportPersonGroup`.

```javascript
function _exportElementCitation(node, exporter) {
  // ... código existente ...
  el.append(_exportPersonGroup($$, doc, node.authors, 'author'));
  el.append(_exportPersonGroup($$, doc, node.editors, 'editor'));
  el.append(_exportPersonGroup($$, doc, node.coordinators, 'coordinator')); // ← NUEVO
  // ...
}
```

---

## Caso 2: Implementación de campos personalizados en referencias

Este apartado documenta cómo extender un tipo de referencia para incorporar metadatos adicionales.

> **Ejemplo**: A continuación utilizaremos como caso práctico la extensión del tipo de referencia `Thesis` (Tesis) para agregar campos exigidos por el flujo editorial.

### Paso 1: Extensión del schema

**Ubicación**: Definición de `ThesisRef.schema`.

**Acción**: Agregar propiedades de tipo `substance.STRING`.

```javascript
ThesisRef.schema = {
  // ... campos existentes
  degree: substance.STRING,
  awardingInstitution: substance.STRING,
  publicationNumber: substance.STRING,
  // ...
};
```

### Paso 2: Importación desde XML JATS

**Ubicación**: Helper `_setCitationObjects` dentro de `ElementCitationConverter.prototype.import`.

**Acción**: Mapear desde XML al modelo.

```javascript
degree: getText(el, 'degree'),
awardingInstitution: getText(el, 'institution'),
publicationNumber: getText(el, 'pub-id[pub-id-type=other]'),
```

### Paso 3: Exportación a JATS

**Ubicación**: Helper `_exportElementCitation`.

**Acción**: Inyectar la creación de los elementos XML.

```javascript
el.append(_createTextElement$1($$, node.degree, 'degree'));
el.append(_createTextElement$1($$, node.awardingInstitution, 'institution'));
el.append(
  _createTextElement$1($$, node.publicationNumber, 'pub-id', {
    'pub-id-type': 'other'
  })
);
```

### Paso 4: Interfaz de usuario (labels)

**Objetivo**: Habilitar la etiquetas multilenguaje en la UI.

**Acción**:

```javascript
config.addLabel('degree', { en: 'Degree', es: 'Grado' });
config.addLabel('awardingInstitution', {
  en: 'Awarding Institution',
  es: 'Institución Otorgante'
});
config.addLabel('publicationNumber', {
  en: 'Publication Number',
  es: 'Número de Publicación'
});
```
