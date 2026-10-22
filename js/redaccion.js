/* ==========================================================================
   El Baroja Digital - Mesa de redacción
   Panel de encargos que detecta los cambios hechos con las DevTools.
   Vive dentro de un Shadow DOM: sus estilos no dependen de la hoja de la
   página, así que sigue funcionando aunque se elimine estilos.css.
   El progreso se guarda en localStorage del navegador.
   ========================================================================== */
(() => {
    'use strict';

    const ALMACEN = 'baroja-redaccion-v1';
    const BASE = new URL('..', document.currentScript.src).href;
    const EN_PORTADA = Boolean(document.getElementById('titular-principal'));
    const TITULAR_ORIGINAL = 'El servidor del instituto resiste la avalancha de matrículas gracias a una caché de 200 líneas';
    const COLOR_ORIGINAL = '#8e44ad';

    // Resumen de respuestas: evita que la solución aparezca en claro en el código.
    const resumen = (texto) => {
        let x = 5381;
        for (const c of texto.trim().toLowerCase()) x = ((x << 5) + x + c.codePointAt(0)) >>> 0;
        return x.toString(36);
    };

    const raiz = document.documentElement;
    const estilo = (el) => (el ? getComputedStyle(el) : null);
    const cssActivo = () => getComputedStyle(raiz).getPropertyValue('--css-activo').trim() === '1';
    const px = (v) => parseFloat(v) || 0;

    const ETIQUETAS = [
        ['', 'Elige...'], ['div', 'div'], ['header', 'header'], ['nav', 'nav'], ['main', 'main'],
        ['section', 'section'], ['article', 'article'], ['aside', 'aside'], ['footer', 'footer']
    ];

    /* ---------------------------------------------------------------
       Catálogo de encargos. En los textos, `x` se muestra como código.
       --------------------------------------------------------------- */
    const FASES = {
        1: 'El esqueleto: HTML',
        2: 'La piel: CSS',
        3: 'La hemeroteca'
    };

    const MISIONES = [
        {
            id: 'titular', fase: 1, titulo: 'Edición de última hora', tipo: 'auto',
            encargo: 'La noticia principal ha cambiado hace un minuto y la imprenta no espera. Cambia el titular de la portada por uno tuyo (al menos 10 caracteres) sin tocar ningún fichero.',
            pista: 'Clic derecho sobre el titular > Inspeccionar. En el panel Elements, haz doble clic sobre el texto del `<h2>`, escribe y pulsa Enter.',
            aprendizaje: 'Lo que estás editando no es el fichero `index.html`, sino el DOM: el árbol de nodos que el navegador construye al analizar el HTML. Las DevTools modifican ese árbol en memoria; por eso el cambio desaparece al recargar. El fichero del servidor sigue intacto.',
            comprobar: () => {
                const el = document.getElementById('titular-principal');
                if (!el) return false;
                const t = el.textContent.replace(/\s+/g, ' ').trim();
                return t.length >= 10 && t !== TITULAR_ORIGINAL;
            }
        },
        {
            id: 'mapa', fase: 1, titulo: 'El mapa de la portada', tipo: 'quiz',
            encargo: 'El equipo de accesibilidad necesita saber qué etiqueta envuelve cada bloque de la portada. Inspecciona la página y elige la etiqueta de cada zona.',
            pista: 'Activa el selector de elementos (Ctrl+Shift+C) y pasa el ratón por la portada: la etiqueta flotante muestra el nombre del elemento.',
            aprendizaje: 'HTML5 incorpora etiquetas semánticas que describen el papel de cada bloque: `nav` para la navegación principal, `article` para un contenido autónomo que tendría sentido fuera de la página, `aside` para contenido complementario y `footer` para el pie. Un `div` no dice nada; un lector de pantalla o un buscador sí entienden estas etiquetas.',
            campos: [
                { etiqueta: 'Menú de secciones', opciones: ETIQUETAS, clave: '377dmy' },
                { etiqueta: 'Columna «Lo más leído»', opciones: ETIQUETAS, clave: '46w1aj' },
                { etiqueta: 'Cada noticia individual', opciones: ETIQUETAS, clave: 'i0g9gp' },
                { etiqueta: 'Pie de página', opciones: ETIQUETAS, clave: '1yg2hn8' }
            ]
        },
        {
            id: 'trastienda', fase: 1, titulo: 'La trastienda del documento', tipo: 'quiz',
            encargo: 'Alguien de la redacción ha dejado la clave de esta edición en un lugar del código que el lector nunca ve. Encuéntrala.',
            pista: 'Ctrl+U muestra el código fuente tal como llegó del servidor. Busca texto entre `<!--` y `-->`.',
            aprendizaje: 'Todo documento HTML tiene dos partes: `<head>`, con metadatos que no se muestran (`title`, `charset`, `viewport`, `description`, enlaces a hojas de estilo y scripts), y `<body>`, con el contenido visible. Los comentarios llegan al navegador de cualquier visitante: nunca dejes en ellos contraseñas ni notas internas.',
            campos: [
                { etiqueta: 'Clave de la edición', texto: true, clave: '7wlei6' },
                {
                    etiqueta: '¿En qué parte del documento estaba?',
                    opciones: [['', 'Elige...'], ['body', 'body'], ['head', 'head'], ['main', 'main'], ['footer', 'footer']],
                    clave: 'ykiwl3'
                }
            ]
        },
        {
            id: 'alt', fase: 1, titulo: 'La foto sin descripción', tipo: 'auto',
            encargo: 'La foto de la noticia principal se ha publicado sin texto alternativo: un lector de pantalla solo anuncia «imagen» y el buscador no sabe qué contiene. Añádele un atributo `alt` descriptivo (al menos 10 caracteres).',
            pista: 'Inspecciona la foto. En Elements, clic derecho sobre `<img>` > Add attribute, y escribe `alt="..."`.',
            aprendizaje: 'Los atributos añaden información a un elemento: `src` indica el fichero, `width` y `height` reservan el hueco antes de que cargue la imagen y `alt` describe su contenido cuando no se puede ver. `alt` es obligatorio en `<img>` y es lo primero que revisa un validador o una auditoría de accesibilidad.',
            comprobar: () => {
                const img = document.getElementById('foto-principal');
                return Boolean(img && img.hasAttribute('alt') && img.getAttribute('alt').trim().length >= 10);
            }
        },
        {
            id: 'sincss', fase: 2, titulo: 'Rayos X', tipo: 'auto',
            encargo: 'Elimina la hoja de estilos de la portada y observa qué queda. Cuando termines, recarga (F5) para devolverla a su estado.',
            pista: 'En Elements, despliega `<head>`, selecciona `<link rel="stylesheet" href="css/estilos.css">` y pulsa Supr. En Firefox también sirve Ver > Estilo de página > Sin estilo.',
            aprendizaje: 'El contenido sigue ahí: titulares, listas, enlaces y fotos. Solo ha desaparecido la presentación. Separar estructura (HTML) y presentación (CSS) permite cambiar el diseño de un sitio entero editando un único fichero, reutilizar estilos en cientos de páginas y adaptar el mismo contenido a móvil, impresora o lector de pantalla.',
            comprobar: () => EN_PORTADA && !cssActivo()
        },
        {
            id: 'marca', fase: 2, titulo: 'Cambio de imagen corporativa', tipo: 'auto',
            encargo: 'El periódico ha cambiado de dueño y quiere otro color corporativo. Cámbialo en toda la portada modificando un único valor.',
            pista: 'Selecciona `<html>` en Elements. En el panel Styles busca la regla `:root` y cambia el valor de `--color-marca` (puedes pulsar sobre el cuadrado de color).',
            aprendizaje: '`--color-marca` es una propiedad personalizada (variable CSS). Todas las reglas que usan `var(--color-marca)` reciben el cambio a la vez: antetítulos, bordes, la letra capital, el bloque del tiempo. Es la base de los temas claro y oscuro de cualquier web actual.',
            comprobar: () => {
                if (!EN_PORTADA || !cssActivo()) return false;
                const v = getComputedStyle(raiz).getPropertyValue('--color-marca').trim().toLowerCase();
                return v !== '' && v !== COLOR_ORIGINAL;
            }
        },
        {
            id: 'caja', fase: 2, titulo: 'Caja a caja', tipo: 'auto',
            encargo: 'Maquetación quiere destacar la noticia principal: rodéala con un borde de al menos 4 px en los cuatro lados y separa el contenido del borde con un relleno de al menos 20 px en cada lado.',
            pista: 'Selecciona `<article class="noticia-principal">`. En Styles, dentro de `element.style`, escribe `border: 6px solid black;` y `padding: 24px;`. Después abre la pestaña Computed y observa el diagrama de cajas.',
            aprendizaje: 'Cada elemento es una caja con cuatro capas: content (el contenido), padding (relleno interior), border (borde) y margin (separación con las cajas vecinas). Esta portada usa `box-sizing: border-box`, de modo que el ancho incluye borde y relleno, y la rejilla no se descuadra al engordar la caja.',
            comprobar: () => {
                if (!EN_PORTADA || !cssActivo()) return false;
                const s = estilo(document.querySelector('.noticia-principal'));
                if (!s) return false;
                const lados = ['Top', 'Right', 'Bottom', 'Left'];
                return lados.every((l) => px(s[`border${l}Width`]) >= 4 && s[`border${l}Style`] !== 'none' && px(s[`padding${l}`]) >= 20);
            }
        },
        {
            id: 'rejilla', fase: 2, titulo: 'Rompe la rejilla', tipo: 'auto',
            encargo: 'Desactiva la rejilla que organiza la portada en tres columnas y observa cómo se apilan todos los bloques.',
            pista: 'Selecciona `<main class="portada">`. En Styles, desmarca la casilla de `display: grid` o cambia su valor por `block`.',
            aprendizaje: 'Las columnas no dependen del HTML, sino de una sola declaración: `display: grid` con `grid-template-columns: repeat(3, 1fr)`. CSS Grid reparte el espacio en filas y columnas a la vez; la noticia principal ocupa dos columnas con `grid-column: span 2`. Vuelve a activarlo y pulsa la etiqueta «grid» junto a `<main>` en Elements para ver la rejilla dibujada.',
            comprobar: () => {
                if (!EN_PORTADA || !cssActivo()) return false;
                const s = estilo(document.querySelector('.portada'));
                return Boolean(s && s.display !== 'grid' && s.display !== 'none');
            }
        },
        {
            id: 'menu', fase: 2, titulo: 'El menú del revés', tipo: 'auto',
            encargo: 'Broma interna de la redacción: haz que las secciones del menú aparezcan en orden inverso, empezando por Hemeroteca, sin mover ni una etiqueta `<li>`.',
            pista: 'Selecciona el `<ul>` que hay dentro de `<nav>`. En Styles, cambia `flex-direction: row` por `row-reverse`.',
            aprendizaje: 'El menú es un contenedor Flexbox: coloca sus hijos en una dirección (fila o columna) y controla su orden, alineación y reparto del espacio. El orden visual cambia, pero el del HTML, que es el que sigue un lector de pantalla o la tecla Tab, no. Por eso conviene usarlo con cuidado.',
            comprobar: () => {
                if (!EN_PORTADA || !cssActivo()) return false;
                const s = estilo(document.querySelector('.menu-secciones ul'));
                return Boolean(s && s.display.includes('flex') && s.flexDirection.endsWith('-reverse'));
            }
        },
        {
            id: 'movil', fase: 2, titulo: 'Edición para móvil', tipo: 'auto',
            encargo: 'La mayoría de los lectores entra desde el móvil. Comprueba cómo se ve la portada en una pantalla de 600 px de ancho o menos.',
            pista: 'Activa la barra de dispositivos con Ctrl+Shift+M (Chrome, Edge o Firefox, con las DevTools abiertas) y elige un modelo de móvil.',
            aprendizaje: 'La portada pasa a una sola columna gracias a una media query: `@media (max-width: 600px) { ... }`. Sus reglas solo se aplican en pantallas estrechas. Para que funcione, el `<head>` incluye `<meta name="viewport" content="width=device-width, initial-scale=1.0">`; sin ella, el móvil simula un escritorio de 980 px y lo encoge todo.',
            comprobar: () => EN_PORTADA && cssActivo() && window.innerWidth <= 600
        },
        {
            id: 'hemeroteca', fase: 3, titulo: 'Arqueología web', tipo: 'quiz',
            enlace: { texto: 'Abrir la portada de 1999', href: 'hemeroteca/1999.html' },
            encargo: 'Abre la primera portada del periódico, publicada en 1999, y examina su código fuente como lo haría un perito.',
            pista: 'En la página de 1999 pulsa Ctrl+U. El DOCTYPE es la primera línea del documento.',
            aprendizaje: 'En 1999 no había un CSS fiable en todos los navegadores: se maquetaba con tablas anidadas y el aspecto se fijaba con etiquetas como `<font>` o `<center>` y atributos como `bgcolor`. HTML 4.01 y XHTML intentaron separar estructura y presentación; HTML5, hoy un estándar vivo (HTML Living Standard) mantenido por el WHATWG, declaró obsoletas esas etiquetas y simplificó el DOCTYPE a `<!DOCTYPE html>`.',
            campos: [
                {
                    etiqueta: '¿Qué versión de HTML declara su DOCTYPE?',
                    opciones: [['', 'Elige...'], ['html32', 'HTML 3.2'], ['html401t', 'HTML 4.01 Transitional'], ['xhtml10s', 'XHTML 1.0 Strict'], ['html5', 'HTML5']],
                    clave: 'q1cmmb'
                },
                {
                    etiqueta: '¿Con qué etiqueta se reparte la página en columnas?',
                    opciones: [['', 'Elige...'], ['div', 'div'], ['frameset', 'frameset'], ['table', 'table'], ['section', 'section']],
                    clave: '4jwyod'
                },
                {
                    etiqueta: '¿Qué etiqueta hace desfilar el texto de última hora?',
                    opciones: [['', 'Elige...'], ['blink', 'blink'], ['marquee', 'marquee'], ['span', 'span'], ['ticker', 'ticker']],
                    clave: '1e6nsvp'
                }
            ]
        }
    ];

    /* ---------------------------------------------------------------
       Estado persistente
       --------------------------------------------------------------- */
    const cargar = () => {
        try {
            return Object.assign({ hechas: {}, nombre: '', abierto: false }, JSON.parse(localStorage.getItem(ALMACEN)) || {});
        } catch {
            return { hechas: {}, nombre: '', abierto: false };
        }
    };
    let estado = cargar();
    const guardar = () => localStorage.setItem(ALMACEN, JSON.stringify(estado));
    let expandida = MISIONES.find((m) => !estado.hechas[m.id])?.id || null;

    /* ---------------------------------------------------------------
       Utilidades de presentación
       --------------------------------------------------------------- */
    const escapar = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const fmt = (s) => escapar(s).replace(/`([^`]+)`/g, '<code>$1</code>');
    const total = MISIONES.length;
    const hechas = () => MISIONES.filter((m) => estado.hechas[m.id]).length;

    /* ---------------------------------------------------------------
       Construcción del panel en Shadow DOM
       --------------------------------------------------------------- */
    const host = document.createElement('div');
    host.id = 'mesa-redaccion';
    host.setAttribute('aria-label', 'Panel de encargos');
    const sombra = host.attachShadow({ mode: 'open' });

    sombra.innerHTML = `
    <style>
        :host { all: initial; }
        * { box-sizing: border-box; }
        .raiz {
            --acento: #8e44ad; --acento-claro: #c99be0; --fondo: #16101c; --capa: #211a29;
            --capa-2: #2b2235; --linea: rgba(255,255,255,.09); --texto: #ece6f1; --apagado: #a99fb4;
            --ok: #3ecf8e;
            font-family: "Inter", "Segoe UI", system-ui, sans-serif; font-size: 14px; line-height: 1.5;
            color: var(--texto);
        }
        button { font: inherit; cursor: pointer; }
        code {
            font-family: "Cascadia Code", Consolas, monospace; font-size: .88em;
            background: rgba(201,155,224,.14); color: #e6c9f3; padding: .05em .35em; border-radius: 4px;
        }
        .lanzador {
            position: fixed; right: 18px; bottom: 18px; z-index: 2147483646;
            display: flex; align-items: center; gap: 10px; padding: 10px 16px 10px 10px;
            border: 1px solid rgba(201,155,224,.35); border-radius: 999px;
            background: linear-gradient(135deg, #2a1d36, #16101c); color: var(--texto);
            box-shadow: 0 10px 30px rgba(30,10,45,.45); transition: transform .2s ease, box-shadow .2s ease;
        }
        .lanzador:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(142,68,173,.45); }
        .lanzador.latido { animation: latido 2.2s ease-in-out infinite; }
        @keyframes latido { 0%,100% { box-shadow: 0 0 0 0 rgba(142,68,173,.55); } 50% { box-shadow: 0 0 0 12px rgba(142,68,173,0); } }
        .anillo { width: 34px; height: 34px; }
        .anillo circle { fill: none; stroke-width: 4; }
        .anillo .pista-anillo { stroke: rgba(255,255,255,.12); }
        .anillo .valor { stroke: var(--acento-claro); stroke-linecap: round; transition: stroke-dashoffset .6s ease; transform: rotate(-90deg); transform-origin: 50% 50%; }
        .lanzador strong { font-weight: 600; letter-spacing: .01em; }
        .lanzador span { color: var(--apagado); font-size: 12px; display: block; }

        .panel {
            position: fixed; top: 16px; right: 16px; bottom: 80px; z-index: 2147483647; width: 410px;
            display: flex; flex-direction: column; background: var(--fondo);
            border: 1px solid var(--linea); border-radius: 16px; overflow: hidden;
            box-shadow: 0 24px 60px rgba(10,4,16,.55);
            transform: translateX(calc(100% + 30px)); opacity: 0; pointer-events: none;
            transition: transform .35s cubic-bezier(.2,.8,.2,1), opacity .25s ease;
        }
        .panel.abierto { transform: none; opacity: 1; pointer-events: auto; }
        .cab {
            padding: 18px 20px 14px; border-bottom: 1px solid var(--linea);
            background: radial-gradient(120% 140% at 0% 0%, rgba(142,68,173,.35), transparent 60%);
        }
        .cab-fila { display: flex; justify-content: space-between; align-items: start; gap: 12px; }
        .cab h2 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: .01em; }
        .cab p { margin: 4px 0 0; color: var(--apagado); font-size: 13px; }
        .cerrar { background: none; border: 1px solid var(--linea); color: var(--apagado); border-radius: 8px; width: 30px; height: 30px; font-size: 18px; line-height: 1; }
        .cerrar:hover { color: var(--texto); border-color: var(--acento-claro); }
        .barra { margin-top: 14px; height: 6px; border-radius: 99px; background: rgba(255,255,255,.08); overflow: hidden; }
        .barra i { display: block; height: 100%; background: linear-gradient(90deg, var(--acento), var(--acento-claro)); border-radius: 99px; transition: width .6s ease; }
        .contador { margin-top: 6px; font-size: 12px; color: var(--apagado); display: flex; justify-content: space-between; gap: 12px; }

        .lista { flex: 1; overflow-y: auto; padding: 8px 12px 16px; scrollbar-width: thin; scrollbar-color: #4a3a58 transparent; }
        .fase { margin: 14px 8px 6px; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--acento-claro); }
        .tarjeta { margin: 6px 0; border: 1px solid var(--linea); border-radius: 12px; background: var(--capa); transition: border-color .2s ease, background .2s ease; }
        .tarjeta:hover { border-color: rgba(201,155,224,.3); }
        .tarjeta.hecha { border-color: rgba(62,207,142,.28); }
        .tarjeta.destello { animation: destello 1.4s ease; }
        @keyframes destello { 0% { background: rgba(62,207,142,.35); } 100% { background: var(--capa); } }
        .tarjeta-cab { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: none; border: 0; color: inherit; text-align: left; }
        .num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 600; background: var(--capa-2); color: var(--apagado); border: 1px solid var(--linea); }
        .hecha .num { background: var(--ok); color: #08281a; border-color: transparent; }
        .tit { flex: 1; font-weight: 600; }
        .estado { font-size: 11px; padding: 2px 8px; border-radius: 99px; background: rgba(255,255,255,.06); color: var(--apagado); }
        .hecha .estado { background: rgba(62,207,142,.15); color: var(--ok); }
        .cuerpo { padding: 0 16px 16px 54px; display: none; }
        .tarjeta.expandida .cuerpo { display: block; animation: aparecer .25s ease; }
        @keyframes aparecer { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        .cuerpo p { margin: 0 0 10px; }
        details { margin: 8px 0 12px; border-left: 2px solid rgba(201,155,224,.4); padding-left: 10px; color: var(--apagado); }
        summary { cursor: pointer; color: var(--acento-claro); font-weight: 600; font-size: 13px; }
        details p { margin: 6px 0 0; }
        .campo { margin: 10px 0; }
        .campo label { display: block; font-size: 12.5px; color: var(--apagado); margin-bottom: 4px; }
        select, input[type=text] {
            width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--linea);
            background: var(--capa-2); color: var(--texto); font: inherit;
        }
        select:focus, input:focus { outline: 2px solid var(--acento); outline-offset: 1px; }
        .boton {
            display: inline-block; margin-top: 6px; padding: 8px 14px; border-radius: 8px; border: 0;
            background: var(--acento); color: #fff; font-weight: 600; text-decoration: none; transition: filter .2s ease;
        }
        .boton:hover { filter: brightness(1.15); }
        .boton.sec { background: transparent; border: 1px solid rgba(201,155,224,.45); color: var(--acento-claro); margin-right: 6px; }
        .aviso { margin-top: 8px; font-size: 13px; color: #ff9b9b; min-height: 1em; }
        .espera { font-size: 12.5px; color: var(--apagado); font-style: italic; }
        .aprendido { margin-top: 10px; padding: 12px 14px; border-radius: 10px; background: rgba(62,207,142,.08); border: 1px solid rgba(62,207,142,.25); }
        .aprendido h4 { margin: 0 0 6px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ok); }
        .aprendido p { margin: 0; }

        .credencial { margin: 12px 4px 4px; padding: 18px; border-radius: 14px; background: linear-gradient(135deg, #8e44ad, #3d1d4d); box-shadow: inset 0 0 0 1px rgba(255,255,255,.15); }
        .credencial h3 { margin: 0; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; opacity: .85; }
        .credencial .medio { font-family: "UnifrakturMaguntia", serif; font-size: 26px; margin: 4px 0 10px; }
        .credencial .nombre { font-size: 20px; font-weight: 600; min-height: 1.4em; }
        .credencial .datos { margin-top: 8px; font-size: 12px; opacity: .85; display: flex; justify-content: space-between; gap: 8px; }
        .credencial input { margin-top: 12px; background: rgba(0,0,0,.25); border-color: rgba(255,255,255,.2); }

        .pie { padding: 10px 16px; border-top: 1px solid var(--linea); display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--apagado); }
        .pie button { background: none; border: 0; color: var(--apagado); text-decoration: underline; padding: 0; }
        .pie button:hover { color: #ff9b9b; }

        .tostada {
            position: fixed; left: 50%; top: 20px; z-index: 2147483647; transform: translate(-50%, -140%);
            padding: 12px 18px; border-radius: 12px; background: #0f2a1e; color: #d8ffec; border: 1px solid rgba(62,207,142,.45);
            box-shadow: 0 12px 30px rgba(0,0,0,.35); font-weight: 600; opacity: 0; visibility: hidden;
            transition: transform .4s cubic-bezier(.2,.8,.2,1), opacity .3s ease, visibility .4s;
        }
        .tostada.visible { transform: translate(-50%, 0); opacity: 1; visibility: visible; }
        .tostada span { display: block; font-weight: 400; font-size: 12.5px; color: #9fe3c2; }

        @media (max-width: 600px) {
            .panel { top: auto; left: 8px; right: 8px; bottom: 72px; width: auto; height: 62vh; }
            .lanzador { right: 10px; bottom: 10px; }
        }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
    </style>
    <div class="raiz">
        <button class="lanzador" type="button" aria-expanded="false">
            <svg class="anillo" viewBox="0 0 36 36" aria-hidden="true">
                <circle class="pista-anillo" cx="18" cy="18" r="15"></circle>
                <circle class="valor" cx="18" cy="18" r="15" stroke-dasharray="94.25" stroke-dashoffset="94.25"></circle>
            </svg>
            <div><strong>Mesa de redacción</strong><span class="lanzador-cuenta"></span></div>
        </button>
        <section class="panel" role="dialog" aria-label="Mesa de redacción">
            <header class="cab">
                <div class="cab-fila">
                    <div>
                        <h2>Mesa de redacción</h2>
                        <p>Encargos de hoy. Abre las herramientas de desarrollador con F12 y trabaja sobre la página.</p>
                    </div>
                    <button class="cerrar" type="button" aria-label="Cerrar panel">&times;</button>
                </div>
                <div class="barra"><i></i></div>
                <div class="contador"><span class="cuenta"></span><span>Recargar la página no borra tu progreso</span></div>
            </header>
            <div class="lista"></div>
            <footer class="pie">
                <span>El Baroja Digital &middot; Redacción</span>
                <button type="button" class="reiniciar">Reiniciar progreso</button>
            </footer>
        </section>
        <div class="tostada" role="status" aria-live="polite"></div>
    </div>`;

    const $ = (sel) => sombra.querySelector(sel);
    const lanzador = $('.lanzador');
    const panel = $('.panel');
    const lista = $('.lista');
    const tostada = $('.tostada');

    const abrir = (si) => {
        estado.abierto = si;
        guardar();
        panel.classList.toggle('abierto', si);
        lanzador.setAttribute('aria-expanded', String(si));
    };

    const huella = () => {
        const base = estado.nombre + Object.keys(estado.hechas).sort().map((k) => estado.hechas[k]).join('');
        return resumen(base).toUpperCase().padStart(7, '0');
    };

    const htmlCredencial = () => {
        const fin = Math.max(...Object.values(estado.hechas));
        const fecha = new Date(fin).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        return `
        <div class="credencial">
            <h3>Credencial de redacción</h3>
            <div class="medio">El Baroja Digital</div>
            <div class="nombre">${escapar(estado.nombre) || 'Escribe tu nombre'}</div>
            <div class="datos"><span>${total}/${total} encargos</span><span>${fecha}</span><span>${huella()}</span></div>
            <input type="text" class="campo-nombre" placeholder="Nombre y apellidos" value="${escapar(estado.nombre)}" maxlength="60" aria-label="Nombre para la credencial">
        </div>`;
    };

    const htmlCampo = (mision, campo, i) => {
        const id = `${mision.id}-${i}`;
        const control = campo.texto
            ? `<input type="text" id="${id}" data-i="${i}" autocomplete="off" spellcheck="false">`
            : `<select id="${id}" data-i="${i}">${campo.opciones.map(([v, t]) => `<option value="${v}">${escapar(t)}</option>`).join('')}</select>`;
        return `<div class="campo"><label for="${id}">${escapar(campo.etiqueta)}</label>${control}</div>`;
    };

    const htmlTarjeta = (m, n) => {
        const hecha = Boolean(estado.hechas[m.id]);
        const clases = ['tarjeta', hecha ? 'hecha' : '', expandida === m.id ? 'expandida' : ''].join(' ');
        let interior = `<p>${fmt(m.encargo)}</p>`;
        if (!hecha) {
            interior += `<details><summary>Pista</summary><p>${fmt(m.pista)}</p></details>`;
            if (m.enlace && EN_PORTADA) interior += `<a class="boton sec" href="${BASE}${m.enlace.href}">${escapar(m.enlace.texto)}</a>`;
            if (m.tipo === 'quiz') {
                interior += `<form data-mision="${m.id}">${m.campos.map((c, i) => htmlCampo(m, c, i)).join('')}
                    <button class="boton" type="submit">Comprobar</button><div class="aviso" aria-live="polite"></div></form>`;
            } else if (!EN_PORTADA) {
                interior += `<p class="espera">Este encargo se hace sobre la portada. <a class="boton sec" href="${BASE}index.html">Volver a la portada</a></p>`;
            } else {
                interior += '<p class="espera">Se marcará como superado en cuanto la página detecte el cambio.</p>';
            }
        } else {
            interior += `<div class="aprendido"><h4>Lo que acabas de hacer</h4><p>${fmt(m.aprendizaje)}</p></div>`;
        }
        return `<article class="${clases}" data-id="${m.id}">
            <button class="tarjeta-cab" type="button" aria-expanded="${expandida === m.id}">
                <span class="num">${hecha ? '&#10003;' : n}</span>
                <span class="tit">${escapar(m.titulo)}</span>
                <span class="estado">${hecha ? 'Superado' : 'Pendiente'}</span>
            </button>
            <div class="cuerpo">${interior}</div>
        </article>`;
    };

    const pintar = () => {
        const h = hechas();
        let html = h === total ? htmlCredencial() : '';
        let faseActual = 0;
        MISIONES.forEach((m, i) => {
            if (m.fase !== faseActual) {
                faseActual = m.fase;
                html += `<div class="fase">${escapar(FASES[m.fase])}</div>`;
            }
            html += htmlTarjeta(m, i + 1);
        });
        const scroll = lista.scrollTop;
        lista.innerHTML = html;
        lista.scrollTop = scroll;

        const pct = Math.round((h / total) * 100);
        $('.barra i').style.width = `${pct}%`;
        $('.cuenta').textContent = `${h} de ${total} encargos superados`;
        $('.lanzador-cuenta').textContent = h === total ? 'Credencial disponible' : `${h}/${total} encargos`;
        $('.anillo .valor').setAttribute('stroke-dashoffset', String(94.25 * (1 - h / total)));
        lanzador.classList.toggle('latido', h === 0 && !estado.abierto);
    };

    let temporizadorTostada;
    const avisar = (titulo, detalle) => {
        tostada.innerHTML = `${escapar(titulo)}<span>${escapar(detalle)}</span>`;
        tostada.classList.add('visible');
        clearTimeout(temporizadorTostada);
        temporizadorTostada = setTimeout(() => tostada.classList.remove('visible'), 3800);
    };

    const completar = (m) => {
        if (estado.hechas[m.id]) return;
        estado.hechas[m.id] = Date.now();
        expandida = m.id;
        guardar();
        // En pantallas estrechas el panel taparía el cambio recién hecho: basta con la notificación.
        if (window.innerWidth > 600) abrir(true);
        pintar();
        const tarjeta = lista.querySelector(`[data-id="${m.id}"]`);
        if (tarjeta) {
            tarjeta.classList.add('destello');
            tarjeta.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        avisar(`Encargo superado: ${m.titulo}`, hechas() === total ? 'Todos los encargos completados. Tu credencial está lista.' : 'Lee qué has hecho en el panel.');
    };

    /* ---------------------------------------------------------------
       Eventos
       --------------------------------------------------------------- */
    lanzador.addEventListener('click', () => abrir(!estado.abierto));
    $('.cerrar').addEventListener('click', () => abrir(false));
    $('.reiniciar').addEventListener('click', () => {
        if (!confirm('Se borrará el progreso de todos los encargos en este navegador. ¿Continuar?')) return;
        estado = { hechas: {}, nombre: '', abierto: true };
        expandida = MISIONES[0].id;
        guardar();
        pintar();
    });

    lista.addEventListener('click', (e) => {
        const cab = e.target.closest('.tarjeta-cab');
        if (!cab) return;
        const id = cab.parentElement.dataset.id;
        expandida = expandida === id ? null : id;
        pintar();
    });

    lista.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const m = MISIONES.find((x) => x.id === form.dataset.mision);
        const valores = [...form.querySelectorAll('[data-i]')];
        if (valores.some((c) => !c.value.trim())) {
            form.querySelector('.aviso').textContent = 'Completa todas las respuestas antes de comprobar.';
            return;
        }
        const fallos = valores.filter((c) => resumen(c.value) !== m.campos[Number(c.dataset.i)].clave).length;
        if (fallos === 0) {
            completar(m);
        } else {
            form.querySelector('.aviso').textContent = fallos === 1
                ? 'Hay 1 respuesta incorrecta. Vuelve a inspeccionar el código.'
                : `Hay ${fallos} respuestas incorrectas. Vuelve a inspeccionar el código.`;
        }
    });

    lista.addEventListener('input', (e) => {
        if (!e.target.classList.contains('campo-nombre')) return;
        estado.nombre = e.target.value;
        guardar();
        const cred = lista.querySelector('.credencial');
        cred.querySelector('.nombre').textContent = estado.nombre || 'Escribe tu nombre';
        cred.querySelector('.datos span:last-child').textContent = huella();
    });

    /* ---------------------------------------------------------------
       Bucle de detección de cambios hechos con las DevTools
       --------------------------------------------------------------- */
    const vigilar = () => {
        for (const m of MISIONES) {
            if (m.tipo !== 'auto' || estado.hechas[m.id]) continue;
            try {
                if (m.comprobar()) completar(m);
            } catch {
                /* Un nodo eliminado por el alumno no debe detener el vigilante */
            }
        }
    };

    document.body.appendChild(host);
    panel.classList.toggle('abierto', estado.abierto);
    pintar();
    setInterval(vigilar, 700);
    window.addEventListener('resize', vigilar);

    // Si alguien elimina el panel desde Elements, se vuelve a colocar.
    new MutationObserver(() => {
        if (!host.isConnected) document.body.appendChild(host);
    }).observe(document.body, { childList: true });
})();
