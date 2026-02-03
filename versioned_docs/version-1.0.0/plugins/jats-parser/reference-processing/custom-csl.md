---
sidebar_position: 3
---

# 3. Estilo Personalizado (APA)

Aunque existen repositorios con miles de estilos CSL (como el [repositorio oficial](https://github.com/citation-style-language/styles)), en JATS Parser utilizamos una versión **personalizada de APA** para satisfacer necesidades editoriales específicas que la implementación estándar no cubre.

## ¿Por qué un CSL propio?

El estilo APA estándar de la comunidad, si bien es correcto técnicamente, a veces produce salidas que no se alinean con las preferencias estilísticas locales o particularidades del idioma español en el contexto de nuestras revistas.

Se han detectado y corregido comportamientos como:
*   Uso de `&` en lugar de `y` en autores (típico del inglés).
*   Formato de fechas en estilo `(Año, Mes Día)` vs el preferido `(Día de Mes de Año)`.
*   Puntuación redundante o comas innecesarias en ciertos tipos de tesis o informes.

## Implementación Técnica

En el código de JATS Parser, la carga del estilo se realiza dinámicamente mediante la librería `seboettg/citeproc-php`:

```php
// 1. Obtenemos el nombre del estilo configurado (ej: "apa-custom")
$styleName = $this->getCitationStyle(); 

// 2. Cargamos el XML del estilo CSL
$style = StyleSheet::loadStyleSheet($styleName);

// 3. Instanciamos el procesador con el estilo, el idioma y los datos (JSON)
$citeProc = new CiteProc($style, $this->citationLang, $jsonRefs);
```

### Personalizaciones Comunes

Podemos modificar el archivo `.csl` para alterar la presentación sin tocar código PHP.

**Ejemplo: Cambiar formato de fecha**
Original (APA Estándar):
```xml
<date variable="issued">
  <date-part name="year"/>
  <date-part name="month" prefix=", "/>
  <date-part name="day" prefix=" "/>
</date>
<!-- Resultado: 2023, January 23 -->
```

Personalizado (Español):
```xml
<date variable="issued">
  <date-part name="day" suffix=" de "/>
  <date-part name="month" suffix=" de "/>
  <date-part name="year"/>
</date>
<!-- Resultado: 23 de Enero de 2023 -->
```

## Recursos
*   [Repositorio Oficial de Estilos CSL](https://github.com/citation-style-language/styles)
*   [Editor Visual de CSL](https://editor.citationstyles.org/about/) (Útil para crear o modificar estilos gráficamente).
