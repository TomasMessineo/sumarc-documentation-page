# Texture Modification Guide

This guide details the technical process for extending Texture functionality and adapting bibliographic reference support, including adding new *person-group types* and custom fields.

:::info Context
This documentation arises from the work done for **SUMARC**, where it was necessary to extend the JATS schema supported by Texture to meet specific editorial requirements.
:::

## Scope

The steps described below allow you to:

1.  Add new person roles (*person-group*) and fields to any type of reference.
2.  Ensure their correct visualization in the interface.
3.  Guarantee import from JATS XML.
4.  Guarantee correct export back to JATS.

---

## Case 1: Implementation of new *person-group-types*

Although the examples use a new role (`coordinator`), the procedure is generalizable to any `person-group-type` defined in JATS.

### Step 1: Extend the reference schema

**Objective**: Allow Texture's internal model to recognize the new field.

**Location**: Find the schema definition corresponding to the desired reference type, for example, `BookRef.schema`.

**Action**: Add a new entry using `substance.CHILDREN('ref-contrib')`.

```javascript
BookRef.schema = {
  type: 'book-ref',
  authors: substance.CHILDREN('ref-contrib'),
  editors: substance.CHILDREN('ref-contrib'),
  coordinators: substance.CHILDREN('ref-contrib'), // ← NEW
  translators: substance.CHILDREN('ref-contrib'),
  // ... rest of schema
};
```

> **Important**: If the field does not exist in the schema, it cannot be persisted or serialized.

### Step 2: Add rendering in the preview

**Objective**: Correctly display the new role in the reference preview within the editor.

**Location**: Find the `renderer` function associated with the reference type, for example `bookRenderer`.

**Action**: Insert the rendering block after the existing *person-groups*.

```javascript
function bookRenderer($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId);
  let fragments = [];
  
  // Authors (existing)
  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    );
  }

  // ← NEW person-group
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
  // ... rest of renderer
}
```

**Label Convention**:
*   Singular: `coord`, `ed`, `trans`, `comp`, `curator`
*   Plural: `coords`, `eds`, `translators`, `comps`, `curators`

### Step 3: Add UI labels

**Objective**: Enable editing of the new field in the graphical interface.

**Location**: Label configuration.

**Action**: Add two labels for each new field (visualization and editing).

```javascript
config.addLabel('coordinators', 'Coordinators');
config.addLabel('edit-coordinators', 'Edit Coordinators');
```

If this step is omitted, the field will not be accessible from the UI.

### Step 4: Import from JATS

**Objective**: Populate the new field when loading an existing XML.

**Location**: `_importElementCitation` function.

**Action**: Add the import of the new `person-group-type` using `_importPersonGroup`.

```javascript
function _importElementCitation(el, node, doc, importer) {
  // ... existing code ...
  node.authors = _importPersonGroup(el, doc, 'author');
  node.editors = _importPersonGroup(el, doc, 'editor');
  node.coordinators = _importPersonGroup(el, doc, 'coordinator'); // ← NEW
  // ...
}
```

> **Critical Note**: The value `'coordinator'` must match exactly the `person-group-type` attribute present in the JATS XML.

### Step 5: Export to JATS XML

**Objective**: Ensure the new field is serialized correctly when saving.

**Location**: `_exportElementCitation` function.

**Action**: Add a call to `_exportPersonGroup`.

```javascript
function _exportElementCitation(node, exporter) {
  // ... existing code ...
  el.append(_exportPersonGroup($$, doc, node.authors, 'author'));
  el.append(_exportPersonGroup($$, doc, node.editors, 'editor'));
  el.append(_exportPersonGroup($$, doc, node.coordinators, 'coordinator')); // ← NEW
  // ...
}
```

---

## Case 2: Implementation of custom fields in references

This section documents how to extend a reference type to incorporate additional metadata.

> **Example**: Below we will use the extension of the `Thesis` reference type as a practical case to add fields required by the editorial workflow.

### Step 1: Extend schema

**Location**: `ThesisRef.schema` definition.

**Action**: Add properties of type `substance.STRING`.

```javascript
ThesisRef.schema = {
  // ... existing fields
  degree: substance.STRING,
  awardingInstitution: substance.STRING,
  publicationNumber: substance.STRING,
  // ...
};
```

### Step 2: Import from JATS XML

**Location**: `_setCitationObjects` helper within `ElementCitationConverter.prototype.import`.

**Action**: Map from XML to model.

```javascript
degree: getText(el, 'degree'),
awardingInstitution: getText(el, 'institution'),
publicationNumber: getText(el, 'pub-id[pub-id-type=other]'),
```

### Step 3: Export to JATS

**Location**: `_exportElementCitation` helper.

**Action**: Inject the creation of XML elements.

```javascript
el.append(_createTextElement$1($$, node.degree, 'degree'));
el.append(_createTextElement$1($$, node.awardingInstitution, 'institution'));
el.append(
  _createTextElement$1($$, node.publicationNumber, 'pub-id', {
    'pub-id-type': 'other'
  })
);
```

### Step 4: User Interface (labels)

**Objective**: Enable multi-language labels in the UI.

**Action**:

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
