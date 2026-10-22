| <img src="logoIES.jpg" alt="IES Pío Baroja" width="90"> | **IES Pío Baroja**<br>Departamento de Informática<br>Ciclo Superior DAM | **Lenguajes de marcas y sistemas de gestión de información**<br>UT-2. Guía docente: Cirugía web en directo |
|---|---|---|

# Guía docente: El Baroja Digital

Documento de apoyo exclusivo para el profesorado. Detalla la justificación pedagógica, el mapa curricular, el solucionario de las misiones y la propuesta metodológica para dinamizar la sesión de toma de contacto con la unidad de entornos web (HTML5 y CSS).

<div class="page-break"></div>

## Ficha técnica

- **Módulo:** Lenguajes de marcas y sistemas de gestión de información (1º DAM).
- **Unidad de trabajo:** UT-2. Utilización de lenguajes de marcas en entornos web.
- **Resultado de Aprendizaje principal:** RA2 (Utiliza lenguajes de marcas para la transmisión y presentación de información a través de la web analizando la estructura de los documentos e identificando sus elementos).
- **Duración recomendada:** 1 sesión lectiva (55 a 60 minutos).
- **Modalidad:** Individual o por parejas en el aula de informática.
- **Entorno de ejecución:** Cualquier navegador web moderno con herramientas de desarrollo (Chrome, Edge, Firefox). Compatible con GitHub Pages.

<div class="page-break"></div>

## Matriz curricular de la actividad

| Reto / Encargo | CE cubierto | Concepto técnico trabajado |
|---|---|---|
| Edición de última hora | `CE2e` | Inspección y manipulación en caliente del árbol DOM con las DevTools. |
| El mapa de la portada | `CE2c` | Identificación de etiquetas semánticas de HTML5 (`nav`, `aside`, `article`, `footer`). |
| La trastienda del documento | `CE2b` | Diferenciación entre metadatos (`<head>`) y contenido visible (`<body>`); comentarios. |
| La foto sin descripción | `CE2c`, `CE2h` | Atributos de elementos multimedia; importancia de la accesibilidad (`alt`). |
| Rayos X | `CE2f` | Separación estricta entre contenido/estructura (HTML) y presentación (CSS). |
| Cambio de imagen corporativa | `CE2g` | Declaración y uso de variables CSS (propiedades personalizadas en `:root`). |
| Caja a caja | `CE2g` | Modelo de cajas del W3C: content, padding, border y margin; `box-sizing`. |
| Rompe la rejilla | `CE2g` | Maquetación bidimensional con CSS Grid (`display: grid`, columnas y franjas). |
| El menú del revés | `CE2g` | Maquetación unidimensional con Flexbox (`display: flex`, dirección de eje). |
| Edición para móvil | `CE2b`, `CE2g` | Diseño adaptable (*responsive*), consultas de medios (`@media`) y `meta viewport`. |
| Arqueología web (Hemeroteca) | `CE2a`, `CE2d` | Evolución de estándares: obsolescencia de HTML 4.01, tablas y etiquetas de formato directo. |

<div class="page-break"></div>

## Secuenciación de la sesión (55 minutos)

### 1. Presentación y contextualización (5 min)
- Presentar brevemente el portal ficticio del instituto *El Baroja Digital*.
- Explicar la mecánica: hoy no se escribe código en el editor, sino que se inspecciona y altera el documento en vivo con **F12** para comprender cómo funciona un navegador por dentro.
- Los alumnos abren el enlace del periódico (desplegado en GitHub Pages o en local).

### 2. Fase de exploración autónoma (35 min)
- El alumnado resuelve a su ritmo los 11 encargos siguiendo el panel flotante de la *Mesa de redacción*.
- El profesor circula por el aula resolviendo atascos mecánicos (cómo usar el atajo de inspección, cómo seleccionar un nodo en el panel de estilos).
- Al completar los encargos, cada alumno genera su *Credencial de redacción* con huella de integridad.

### 3. Puesta en común socrática (15 min)
- Proyectar la portada en la pantalla del aula y lanzar las preguntas de debate indicadas a continuación para formalizar los conceptos antes de ver las diapositivas teóricas en las siguientes sesiones.

<div class="page-break"></div>

## Solucionario y claves técnicas

### Encargo 1: edición de última hora
- **Acción:** Localizar `#titular-principal` en el panel Elements y reemplazar el texto por una cadena de 10 o más caracteres distinta de la original.
- **Punto clave:** Demostrar que el cambio vive en la memoria RAM del navegador (DOM) y que el archivo del servidor no se ha alterado (se pierde con F5).

### Encargo 2: el mapa de la portada
- **Respuestas correctas:**
  - Menú de secciones: `<nav>`
  - Columna "Lo más leído": `<aside>`
  - Cada noticia individual: `<article>`
  - Pie de página: `<footer>`

### Encargo 3: la trastienda del documento
- **Clave secreta:** `LINOTIPIA`
- **Ubicación en el documento:** `<head>`
- **Punto clave:** Localizable en el comentario `<!-- Nota de cierre para la redacción: la clave de esta edición es LINOTIPIA. No publicar. -->`. Mostrar que cualquier comentario en HTML llega íntegro al cliente.

### Encargo 4: la foto sin descripción
- **Acción:** Añadir sobre `img#foto-principal` el atributo `alt="..."` con una longitud mínima de 10 caracteres.

### Encargo 5: rayos X
- **Acción:** Seleccionar en `<head>` el elemento `<link rel="stylesheet" href="css/estilos.css">` y pulsar Supr para eliminarlo del árbol DOM.
- **Punto clave:** Observar que el texto, fotos y enlaces siguen estando estructurados, pero pierden la diagramación. Explicar por qué el panel de la redacción no pierde estilos (encapsulación mediante Shadow DOM).

### Encargo 6: cambio de imagen corporativa
- **Acción:** Seleccionar `<html>` o `:root` y cambiar el valor hexadecimal de `--color-marca` por cualquier otro color válido.

### Encargo 7: caja a caja
- **Acción:** Aplicar sobre `.noticia-principal` estilos con al menos 4 px de borde (`border: 4px solid ...`) y 20 px de relleno (`padding: 20px`).
- **Punto clave:** Inspeccionar la pestaña *Computed* de las DevTools para visualizar las cuatro capas de la caja.

### Encargo 8: rompe la rejilla
- **Acción:** En `.portada`, desmarcar o modificar `display: grid` por `display: block`.
- **Punto clave:** Comprobar que las 3 columnas desaparecen y las noticias pasan a apilarse verticalmente.

### Encargo 9: el menú del revés
- **Acción:** En `.menu-secciones ul`, cambiar `flex-direction: row` por `flex-direction: row-reverse`.
- **Punto clave:** Explicar la discrepancia entre el orden visual (reverso) y el orden de tabulación y lectura de accesibilidad (orden original del DOM).

### Encargo 10: edición para móvil
- **Acción:** Activar el modo de diseño adaptable (Ctrl+Shift+M) y fijar una anchura de pantalla igual o inferior a 600 px.
- **Punto clave:** Explicar el papel de la regla `@media (max-width: 600px)` y de la etiqueta `<meta name="viewport">`.

### Encargo 11: arqueología web (hemeroteca 1999)
- **Respuestas correctas:**
  - Versión de HTML: `HTML 4.01 Transitional`
  - Etiqueta de columnas: `<table>`
  - Etiqueta de texto deslizante: `<marquee>`
- **Punto clave:** Comparar la complejidad de mantenimiento de maquetar con tablas y etiquetas directas frente a la limpieza semántica de HTML5 y CSS Grid.

<div class="page-break"></div>

## Preguntas socráticas para la puesta en común

1. **Sobre la persistencia y el DOM:** Si he cambiado el titular de la noticia principal a mi gusto, ¿por qué mis compañeros no lo ven en sus pantallas si recargan? ¿Qué diferencia hay entre el código fuente que manda el servidor y el árbol que procesa el navegador?
2. **Sobre la semántica:** ¿Por qué no usamos simplemente la etiqueta `<div>` con clases para todo? ¿A quién le importa si una sección es un `<article>` o un `<section>` si visualmente se ven idénticos?
3. **Sobre la separación de capas:** Cuando hemos eliminado la hoja de estilos, ¿ha desaparecido la información? ¿Qué pasaría si tuviéramos que rediseñar el periódico para imprimirlo en papel o adaptarlo a un lector de voz para invidentes?
4. **Sobre la historia de la web:** ¿Por qué en 1999 se usaban tablas para maquetar portadas enteras y hoy en día se considera una pésima práctica de desarrollo?
