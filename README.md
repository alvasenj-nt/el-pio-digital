| <img src="logoIES.jpg" alt="IES Pío Baroja" width="90"> | **IES Pío Baroja**<br>Departamento de Informática<br>Ciclo Superior DAM | **Lenguajes de marcas y sistemas de gestión de información**<br>UT-2. Cirugía web en directo: El Baroja Digital |
|---|---|---|

# El Baroja Digital: cirugía web en directo

Recurso interactivo de toma de contacto para la unidad de tecnologías web (HTML5 y CSS). El alumnado asume el rol de técnico de redacción y realiza intervenciones directas sobre el código del periódico digital del centro mediante las herramientas de desarrollador del navegador (DevTools).

El recurso funciona de forma 100 % estática y autónoma, por lo que puede desplegarse en **GitHub Pages** o abrirse directamente en local con cualquier navegador moderno.

<div class="page-break"></div>

## Objetivo de la sesión

Comprender de forma práctica e intuitiva, antes de entrar en la teoría formal:
- La separación estricta entre la estructura de la información (HTML) y su presentación visual (CSS).
- El árbol de nodos del documento (DOM) que genera el navegador en memoria.
- Las principales etiquetas semánticas de HTML5 frente al maquetado histórico con tablas.
- El modelo de cajas y los sistemas modernos de maquetación (Flexbox y CSS Grid).
- El diseño adaptable (*responsive*) mediante puntos de ruptura y metadatos de ventana gráfica.

<div class="page-break"></div>

## Puesta en marcha

### Opción A: ejecución local directa

1. Clona o descarga la carpeta del repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Navega hasta `LenguajeDeMarcas/UT-2/el-baroja-digital/`.
3. Abre el archivo `index.html` en tu navegador habitual (Google Chrome, Firefox o Microsoft Edge).

No se requiere ningún servidor web ni instalación de paquetes externos.

### Opción B: publicación en GitHub Pages

1. Sube los archivos a la raíz de una rama o a la carpeta `/docs` de un repositorio público en GitHub.
2. En los ajustes del repositorio (**Settings > Pages**), selecciona la fuente de despliegue correspondiente.
3. El periódico quedará accesible de forma pública a través de la URL proporcionada por GitHub.

<div class="page-break"></div>

## Cómo resolver los encargos

1. Abre el periódico en el navegador y pulsa **F12** (o clic derecho > *Inspeccionar*) para abrir las herramientas de desarrollador.
2. Pulsa en el botón flotante inferior derecho **Mesa de redacción** para desplegar el panel de encargos.
3. Lee el enunciado y la pista del encargo activo.
4. Realiza la modificación indicada en el panel *Elements* o *Styles* de las DevTools.
5. El sistema detecta automáticamente la alteración en el DOM en tiempo real y marca el encargo como superado, desbloqueando la explicación técnica de lo ocurrido.
6. Al superar los 11 encargos, escribe tu nombre completo para expedir la **Credencial de redacción** con código de verificación.

<div class="page-break"></div>

## Catálogo de intervenciones

| Fase | Encargo | Tipo | Acción requerida |
|---|---|---|---|
| 1. El esqueleto | Edición de última hora | Automático | Modificar el titular del `<h2>` principal desde el árbol DOM. |
| 1. El esqueleto | El mapa de la portada | Cuestionario | Identificar las etiquetas semánticas (`nav`, `aside`, `article`, `footer`). |
| 1. El esqueleto | La trastienda del documento | Cuestionario | Encontrar el comentario oculto con la clave en el `<head>`. |
| 1. El esqueleto | La foto sin descripción | Automático | Añadir el atributo `alt` descriptivo en la imagen principal. |
| 2. La piel | Rayos X | Automático | Eliminar la etiqueta `<link>` del archivo de estilos CSS. |
| 2. La piel | Cambio de imagen corporativa | Automático | Cambiar el valor de la variable `--color-marca` en `:root`. |
| 2. La piel | Caja a caja | Automático | Aplicar `border` y `padding` a la caja de la noticia principal. |
| 2. La piel | Rompe la rejilla | Automático | Modificar la propiedad `display` del contenedor `.portada`. |
| 2. La piel | El menú del revés | Automático | Cambiar `flex-direction` a `row-reverse` en el menú de navegación. |
| 2. La piel | Edición para móvil | Automático | Simular pantalla móvil estrecha (<= 600 px) con la barra de dispositivos. |
| 3. La hemeroteca | Arqueología web | Cuestionario | Analizar el código de la portada de 1999 (HTML 4.01, tablas y marquee). |
