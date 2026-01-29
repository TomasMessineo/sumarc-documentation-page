1. Mapeo de Datos (Thesis.php)

Se modificó la clase JATSParser\Back\Thesis (JATSParser/src/JATSParser/Back/Thesis.php) para mejorar la extracción de metadatos y asignarlos correctamente a los campos CSL, permitiendo distinguir entre la institución que otorga el grado y la base de datos o repositorio donde se encuentra la tesis.
Cambios realizados:
Institución y Publisher:

Lógica Anterior:
Se buscaba una institución o nombre de editor.
Nueva Lógica:

    Se busca primero <institution-name> o <institution>. Si existe, se asigna a la variable "publisherName" (que corresponde a la Institución que otorga el grado). En el CSL-JSON esto debe ir en el tag "publisher", el cual define la entidad que publica o emite el recurso.
    Si además existe <publisher-name>, se asigna a "pubIdType['archive']" (que corresponde a la Base de Datos/Repositorio). En el CSL-JSON esta información debe ir en el campo "archive", el cual representa al repositorio o archivo donde el ítem está almacenado o preservado.
    Si no hay institución, se usa <publisher-name> como fallback para publisherName.
    En cuanto al número de la publicación, se prioriza el tag <publication-number>, y sino se busca el tag <pub-id pub-id-type="other">.

Código Relevante:

// Institución y ubicación
// Lógica:
// 1. Si existe <institution> (o <institution-name>), se considera la Institución otorgante → se mapea a 'publisher' en el CSL-JSON.
// 2. Si ADEMÁS existe <publisher-name>, se interpreta como la Base de datos / Servicio → se mapea a 'archive' en el CSL-JSON.
// 3. Si solo existe <publisher-name> (y no hay institución), se usa como 'publisher'.

$instName = $this->extractFromElement($reference, ".//institution-name[1]|.//institution[1]");
$pubDesc = $this->extractFromElement($reference, ".//publisher-name[1]");

if (!empty($instName)) {
    $this->publisherName = $instName;
    if (!empty($pubDesc)) {
        // Mapear publisher-name a archive para tesis publicadas (base de datos)
        $this->pubIdType['archive'] = $pubDesc;
    }
} else {
    // Caso de respaldo: no se encontró la institución, se asume que publisher-name es la institución
    $this->publisherName = $pubDesc;
}

2. Ajustes en Estilo CSL (apa-spanish-SUMARC.csl)

Se modificó el archivo de estilo CSL (src/JATSParser/Back/CSL/apa-spanish-SUMARC.csl) para alterar el orden y la agrupación de los elementos en la referencia bibliográfica.
Objetivo: Obtener el formato: Autor (Año). Título (Número de publicación) [Grado, Institución Otorgante]. Archivo/Repositorio.
Cambios realizados:

    Macro number:
    Se eliminó la lógica que agrupaba el "Grado" e "Institución" dentro del paréntesis junto con el número. Ahora esta macro solo imprime el número de publicación (si existe), resultando en (Nos. 123).
    Nota: Se mantiene la etiqueta dentro de la macro para que aparezca entre paréntesis debido a la llamada en parenthetical.

    Macro format (Información entre corchetes):
    Se añadió un bloque específico para type="thesis".
    Esta sección ahora se encarga de imprimir el "Grado" (genre) y la "Institución" (publisher) entre corchetes.
    La condición verifica si hay DOI, URL o Archive (lo cual es cierto en este caso porque se mapea el repositorio a archive) para incluir la institución.

Código Relevante (Macro format):

<macro name="format">
  <choose>
    <if type="thesis">
      <group delimiter=", ">
        <text variable="genre" text-case="capitalize-first"/>
        <choose>
          <if variable="archive DOI URL" match="any">
            <text variable="publisher"/>
          </if>
        </choose>
      </group>
    </if>
    <!-- ... resto del código ... -->

Código Relevante (Macro number):

<macro name="number">
  <choose>
    <if variable="number">
      <choose>
        <if type="thesis">
          <group delimiter=" ">
            <label variable="number" form="short" text-case="capitalize-first"/>
            <text variable="number"/>
          </group>
        </if>
        <!-- ... else para otros tipos ... -->
      </choose>
    </if>
  </choose>
</macro>

Resultado Final

Con estos cambios, una referencia de tesis en JATS XML con la estructura completa ahora se renderiza correctamente como:
Apellido, N. (2025). Título de la tesis (Nos. 12345) [Grado, Universidad Otorgante]. Nombre del Repositorio.
Donde:

    Número de publicación -> Nos.12345: Viene de <publication-number> o <pub-id pub-id-type="other">.
    [Grado, Universidad Otorgante]: Vienen de <degree> e <institution> respectivamente.
    Nombre del Repositorio: Viene de <publisher-name>.

Comparativa: Antes vs. Después

A continuación se muestra cómo se renderizaba una referencia de tesis anteriormente en comparación con la nueva implementación:

Antes (Formato CSL Antiguo):
Apellido, N. (2025). Título de la tesis (Tesis de Maestría, Universidad Otorgante Nos. 12345). Repositorio.
Nota: El grado, la institución y el número aparecían agrupados dentro del paréntesis, lo cual no cumplía con el requerimiento específico.

Después (Con Correcciones):
Apellido, N. (2025). Título de la tesis (Nos. 12345) [Tesis de Maestría, Universidad Otorgante]. Repositorio.
Nota: El número queda aislado en paréntesis: (Nos. 12345) y los datos descriptivos de la tesis aparecen separados en corchetes [...], siguiendo el estándar APA como se había planteado.