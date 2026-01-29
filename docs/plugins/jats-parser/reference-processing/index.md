---
sidebar_position: 1
---

# Procesamiento de Referencias

JATS Parser integra la librería **CiteProc-PHP** para la generación automatizada de referencias bibliográficas y citas en el documento final (PDF/HTML).

Esta integración permite transformar los metadatos crudos de las referencias (extraídos del XML JATS) en citas perfectamente formateadas según estándares internacionales como **APA 7ma Edición**, sin necesidad de intervención manual.

:::info Tecnología Base
Para lograr esto, JATS Parser se apoya en dos componentes clave del ecosistema de bibliometría abierta:
1.  **Citation Style Language (CSL)**: Un estándar XML para describir cómo deben lucir las referencias.
2.  **CiteProc**: Un *"procesador de citas"* que toma datos y un estilo CSL, y produce la salida formateada.
:::

## Flujo de Trabajo

El proceso de generación de referencias sigue estos pasos:

1.  **Extracción**: JATS Parser lee las referencias (`<ref-list>`) del archivo XML JATS.
2.  **Mapeo (CSL-JSON)**: Convierte cada referencia a un objeto intermedio estandarizado (JSON).
3.  **Procesamiento**: Instancia la clase `CiteProc`, cargando el estilo CSL deseado (por ejemplo, `apa-custom.csl`).
4.  **Renderizado**: CiteProc aplica las reglas del CSL sobre los datos JSON y devuelve el HTML/Texto de la referencia completa.

Este enfoque modular nos permite cambiar el estilo de citación de toda una revista simplemente cambiando el archivo `.csl`, sin tocar el código del plugin.
