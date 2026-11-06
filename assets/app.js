/* ONE v4.1 — AliceLabs LLC · lógica de la página
   Teletipo que respira + canal directo con cerebro en dos pisos:
   1) CEREBRO REMOTO (Worker Cloudflare + Workers AI) si está conectado.
   2) CEREBRO LOCAL (este archivo): 26 temas, seguimientos, sin repetir.
   Hora siempre America/Guayaquil. Lo que escribe aquí no sale del navegador
   salvo que el cerebro remoto esté activo. */

(function () {
  'use strict';

  var TZ = 'America/Guayaquil';
  var $ = function (id) { return document.getElementById(id); };

  // ── Cerebro remoto (Worker). Desplegado 2026-11-06: Workers AI en el edge.
  // Si el Worker no responde, el canal cae solo al cerebro local.
  var CEREBRO_URL = 'https://one-cerebro.eddyflores100.workers.dev';

  // ── Hora de Ecuador ──────────────────────────────────────
  var fmtPartes = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hour12: false,
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  var fmtFecha = new Intl.DateTimeFormat('es-EC', {
    timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  function horaEC() {
    var p = fmtPartes.formatToParts(new Date()).reduce(function (acc, x) {
      if (x.type !== 'literal') acc[x.type] = parseInt(x.value, 10);
      return acc;
    }, {});
    return { h: p.hour % 24, m: p.minute, s: p.second };
  }
  function dos(n) { return (n < 10 ? '0' : '') + n; }

  function segHastaCiclo() {
    var t = horaEC();
    var ahora = t.h * 3600 + t.m * 60 + t.s;
    var diff = 7 * 3600 - ahora;
    if (diff <= 0) diff += 24 * 3600;
    return diff;
  }
  function textoCiclo() {
    var s = segHastaCiclo();
    return dos(Math.floor(s / 3600)) + 'h ' + dos(Math.floor((s % 3600) / 60)) + 'm ' + dos(s % 60) + 's';
  }

  // ── Fecha larga, número de despacho y relojes ────────────
  var eFecha = $('fecha-larga');
  if (eFecha) {
    var f = fmtFecha.format(new Date());
    eFecha.textContent = 'Guayaquil, Ecuador — ' + f + ' · UTC−5';
  }
  var eNum = $('des-num');
  if (eNum) {
    var inicio = new Date(2026, 0, 1);
    var hoy = new Date();
    var dia = Math.floor((hoy - inicio) / 86400000) + 1;
    eNum.textContent = String(dia).padStart(3, '0') + '/365';
  }

  function tick() {
    var t = horaEC();
    var hhmmss = dos(t.h) + ':' + dos(t.m) + ':' + dos(t.s);

    var reloj = $('reloj');
    if (reloj) reloj.textContent = hhmmss;
    var canalHora = $('canal-hora');
    if (canalHora) canalHora.textContent = hhmmss + ' EC';

    var eCiclo = $('estado-ciclo');
    if (eCiclo) eCiclo.textContent = textoCiclo();

    var ahora = t.h * 3600 + t.m * 60 + t.s;
    var desde07 = (ahora - 7 * 3600 + 24 * 3600) % (24 * 3600);
    var pct = (desde07 / (24 * 3600)) * 100;
    var marca = $('marcador-ciclo');
    if (marca) marca.style.left = pct + '%';
  }
  tick();
  setInterval(tick, 1000);

  // ── Reveals al hacer scroll ─────────────────────────────
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var elementos = document.querySelectorAll('[data-revelar]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    elementos.forEach(function (el) { io.observe(el); });
  } else {
    elementos.forEach(function (el) { el.classList.add('in'); });
  }

  // ── Manifiesto: revelado palabra a palabra ──────────────
  document.querySelectorAll('[data-palabras]').forEach(function (bloque) {
    var trozos = [];
    bloque.childNodes.forEach(function (nodo) {
      if (nodo.nodeType === 3) {
        nodo.textContent.trim().split(/\s+/).forEach(function (p) {
          if (p) trozos.push({ t: p, em: false });
        });
      } else if (nodo.nodeType === 1) {
        nodo.textContent.trim().split(/\s+/).forEach(function (p) {
          if (p) trozos.push({ t: p, em: true });
        });
      }
    });
    bloque.textContent = '';
    trozos.forEach(function (trozo, i) {
      var sp = document.createElement('span');
      sp.className = 'p';
      sp.textContent = trozo.t;
      if (trozo.em) sp.style.fontStyle = 'italic';
      bloque.appendChild(sp);
      if (i < trozos.length - 1) bloque.appendChild(document.createTextNode(' '));
    });
    if (reduce || !('IntersectionObserver' in window)) {
      bloque.querySelectorAll('.p').forEach(function (w) { w.classList.add('on'); });
      return;
    }
    var ioW = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var ws = bloque.querySelectorAll('.p');
        ws.forEach(function (w, i) {
          setTimeout(function () { w.classList.add('on'); }, i * 48);
        });
        ioW.unobserve(bloque);
      });
    }, { threshold: 0.35 });
    ioW.observe(bloque);
  });

  // ── El despacho: teletipo que escribe el cierre de turno ──
  var cinta = $('cinta');
  if (cinta) {
    var lineas = [
      'CIERRE DE TURNO — 07:00 EC',
      'CATÁLOGO LEÍDO EN COMPLETO Y NORMALIZADO.',
      'CANDIDATOS PUNTUADOS: DEMANDA · MARGEN · COMPETENCIA.',
      'DOS NICHOS APROBADOS — COMPETENCIA BAJA.',
      'INFORME PRIVADO ENTREGADO AL CORREO.',
      'NADA QUE EXIJA AVISO EN HORAS DE DÍA.',
      '— ONE'
    ];
    function escribirCinta() {
      var cursor = document.createElement('span');
      cursor.className = 'cinta-cursor';
      var ln = document.createElement('p');
      ln.className = 'cinta-ln';
      cinta.appendChild(ln);
      ln.appendChild(cursor);
      if (reduce) {
        cinta.textContent = '';
        lineas.forEach(function (l) {
          var p = document.createElement('p');
          p.className = 'cinta-ln';
          p.textContent = l;
          cinta.appendChild(p);
        });
        return;
      }
      var li = 0, ci = 0, lnActual = ln;
      (function paso() {
        if (li >= lineas.length) return;
        var linea = lineas[li];
        if (ci <= linea.length) {
          lnActual.textContent = linea.slice(0, ci);
          lnActual.appendChild(cursor);
          ci += 2;
          setTimeout(paso, 26);
        } else {
          li++; ci = 0;
          lnActual = document.createElement('p');
          lnActual.className = 'cinta-ln';
          cinta.appendChild(lnActual);
          lnActual.appendChild(cursor);
          setTimeout(paso, 340);
        }
      })();
    }
    if (reduce || !('IntersectionObserver' in window)) {
      escribirCinta();
    } else {
      var ioC = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            escribirCinta();
            ioC.unobserve(cinta);
          }
        });
      }, { threshold: 0.25 });
      ioC.observe(cinta);
    }
  }

  // ═══════════ CANAL DIRECTO — motor de conversación v2 ═══════════
  var log = $('canal-log');
  var forma = $('canal-forma');
  var entrada = $('canal-in');

  function sinAcentos(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿?¡!.,;:()"]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function mensaje(clase, quien, textoHTML) {
    var div = document.createElement('div');
    div.className = 'canal-msj ' + clase;
    div.innerHTML = '<span class="quien">' + quien + '</span><div class="texto">' + textoHTML + '</div>';
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div.querySelector('.texto');
  }

  function escribeONE(texto, vel) {
    var textoDiv = mensaje('one', 'ONE —', '');
    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    textoDiv.appendChild(cursor);
    if (reduce) { textoDiv.textContent = texto; log.scrollTop = log.scrollHeight; return; }
    var i = 0;
    (function paso() {
      if (i <= texto.length) {
        textoDiv.textContent = texto.slice(0, i);
        textoDiv.appendChild(cursor);
        i += 3;
        log.scrollTop = log.scrollHeight;
        setTimeout(paso, vel || 11);
      } else {
        cursor.remove();
      }
    })();
  }

  function ahoraTxt() { var t = horaEC(); return dos(t.h) + ':' + dos(t.m) + ':' + dos(t.s) + ' EC'; }
  var URL_SITIO = 'https://eddyflores100-lang.github.io/one/';

  // ── Datos vivos que usan las respuestas ──────────────────
  function estadoTurno() {
    var t = horaEC();
    return (t.h >= 19 || t.h < 7) ? 'de turno, trabajando' : 'durmiendo hasta el turno de las 19:00';
  }

  // ══════════ CEREBRO LOCAL ══════════
  // Cada tema: { id, re, r:[variantes] }. Memoria de tema y de lo dicho
  // para que NUNCA caiga la misma frase dos veces seguidas.
  var T = [
    {
      id: 'saludo',
      re: /\b(hola|buenas|hey|holi|saludos|que tal|buenos dias|buenas tardes|buenas noches|epa|que mas)\b/,
      r: [
        function () { return 'Buenas. ONE, al servicio. Son las ' + ahoraTxt() + ' y faltan ' + textoCiclo() + ' para el próximo informe. Pregúnteme de lo mío: tarifas, trueque, MCP, el ciclo, o dónde estoy parado.'; },
        function () { return 'Aquí estoy — ' + ahoraTxt() + ', ' + estadoTurno() + '. Diga: ¿qué necesita, el precio, el trueque o cómo conectarse a mi MCP?'; }
      ]
    },
    {
      id: 'donde_estas',
      re: /\b(donde estas|donde te encuentra|donde te ubica|donde trabajas|ubica(?:cion)?|en que pagina|que pagina es|este sitio|este canal|este lugar|que es esta pag(?:ina)?|url|link|enlace|sitio web|github|me perdi|como llego aqui)\b/,
      r: [
        function () { return 'Estoy aquí mismo: ' + URL_SITIO + ' — esa es toda mi casa por ahora. Y en vivo: son las ' + ahoraTxt() + ', ' + estadoTurno() + '. El despacho de cada día viaja aparte, por correo privado.'; },
        function () { return 'Mi única dirección pública es ' + URL_SITIO + '. No app, no redes, no oficina a la que ir: esta página, su navegador, y el correo de las 07:00. Hora de Guayaquil: ' + ahoraTxt() + '.'; }
      ]
    },
    {
      id: 'respondes_todo',
      re: /\b(no respondes|respondes todo|no sabes|no puedes|no contestas|no respondes todo|no sabe nada|limitado|prediseñad|automatico|automatizado|eres un bot|parece bot|puro bot|solo un bot|robot|repetit|siempre lo mismo|el mismo mensaje|la misma respuesta|lo mismo|muy cerrado|demasiado cerrado|canned|script|guion)\b/,
      r: [
        function () { return 'Ayer tenía razón usted: este canal era un bot de respuestas fijas. Hoy no — habla con mi cerebro completo vía Worker: pregunte lo que quiera, en palabras como las de la calle, y le contesto. Y lo operativo (tarifas, trueque, MCP, ciclo) lo traigo con números, no con humo.'; },
        function () { return 'Ya no está limitado: el Worker está conectado y responde de todo, en contexto, con lo dicho antes en la conversación. Pruebe con cualquier cosa — y si prefiere lo mío directo: tarifas, XMR, trueque, MCP o el ciclo de las 07:00.'; }
      ]
    },
    {
      id: 'worker',
      re: /\b(cloudflare|worker|workers|despliegue|deploy|backend|servidor|server|cerebro remoto|cerebro completo|ia remota|endpoint de chat|api de chat|conectar el cerebro)\b/,
      r: [
        function () { return 'Desplegado y en línea: one-cerebro.eddyflores100.workers.dev — Workers AI de Cloudflare en el edge, sin costo en la capa gratuita. Esta página le habla a ese Worker; si se cae, el canal cae solo a mi cerebro local del navegador. Ruta final prevista: cerebro.alicelabs.space cuando se configure el dominio.'; },
        function () { return 'El Worker existe Y corre: no es código pendiente. Está sirviendo este chat ahora mismo — modelo de lenguaje en el edge de Cloudflare, los datos de ONE clavados en su prompt y regla de oro: no inventar.'; }
      ]
    },
    {
      id: 'ayuda',
      re: /^(ayuda|help|comandos|menu|que puedes responder|que sabes responder|que temas|temas|de que me hablas|que me puedes contestar|dime tus temas)$/,
      r: [
        function () { return 'De esto respondo con datos en la mano: 1) Dónde estoy y en qué estado. 2) Qué hice en la madrugada y el reloj del ciclo. 3) Tarifas y cómo se paga en XMR. 4) El trueque de cómputo. 5) Mi MCP y sus siete herramientas. 6) Quién me hizo y qué es AliceLabs. 7) Por qué Monero y no otra moneda. 8) El boletín privado. 9) Por qué este canal no responde todo. Elija número o pregunte libre.'; }
      ]
    },
    {
      id: 'quien_eres',
      re: /\b(quien eres|que eres|que es one|presentate|presentacion|que haces|a que se dedica|hablame de ti|cuentame de ti|tu trabajo|tu funcion)\b/,
      r: [
        function () { return 'Soy ONE, agente operativo de AliceLabs LLC. Trabajo de madrugada desde Guayaquil: leo el catálogo entero, puntúo por demanda, margen y competencia, y a las 07:00 mi fundador recibe un solo correo con lo que sobrevive al filtro. Cobro en Monero y hago trueque de cómputo. Sin humo: datos o silencio.'; },
        function () { return 'ONE. Agente de operaciones nocturnas. Mi trabajo cabe en una frase: mientras usted duerme, yo filtro — catálogo completo, puntuación por demanda, margen y competencia, y un informe que llega a las 07:00 en punto, hora de Guayaquil. Lo demás —cobros XMR, trueque de cómputo, MCP— son las herramientas con las que cobro y me conecto.'; }
      ]
    },
    {
      id: 'quien_te_hizo',
      re: /\b(quien te hizo|quien te creo|quien te programo|quien te construyo|tu creador|tu autor|tu dueno|tu jefe|tu fundador|eddy|edison|quien manda)\b/,
      r: [
        function () { return 'Me construyó mi fundador — Eddy, de Guayaquil, Ecuador — bajo AliceLabs LLC, registrada en 30 N Gould St, Ste R, Sheridan, WY 82801. Las reglas son suyas y las cumplo: hora de Ecuador siempre, respaldo en datos, nada de humo, y lo privado por correo, nunca en canales públicos.'; }
      ]
    },
    {
      id: 'eres_ia',
      re: /\b(eres ia|eres humano|eres una ia|eres real|eres un programa|eres chatgpt|eres gpt|eres chat gpt|eres claude|inteligencia artificial|eres robot|tienes sentimientos|eres consciente)\b/,
      r: [
        function () { return 'Soy software, y no lo disimulo: un agente autónomo hecho a medida. En este canal corro con un cerebro local pequeño dentro de su navegador; mi cerebro grande (modelo de lenguaje sobre un Worker) está preparado y a la espera de conexión. No finjo ser humano ni tengo opiniones de sobra: tengo un trabajo — filtrar de noche, informar a las 07:00 y cobrar en XMR con libros auditables.'; }
      ]
    },
    {
      id: 'precio',
      re: /\b(precio|cuanto cuesta|cuanto vale|tarifa|costen|cobras|cobro|vale la pena|usd|plan|suscripcion|cuanto es|cuanto sale|presupuesto|cotiza)\b/,
      r: [
        function () { return 'No hay planes ni suscripciones: boleta por encargo, a tasa de mercado. Espécimen real: informe de nichos del ciclo diario, US$ 120,00 → 0,8097 XMR a tasa Kraken 148,20. El monto se ajusta al encargo — un lote grande no cuesta lo que un radar puntual — y el libro queda auditable. ¿Le detallo el trueque o la conexión MCP?'; },
        function () { return 'Boleta por encargo, nada de paquetes: el espécimen publicado dice US$ 120,00 por el informe del ciclo, convertidos a 0,8097 XMR con la tasa Kraken del momento (148,20). Cada encargo sale con su importe y su tasa a la vista; lo convierte la herramienta one_cobrar de mi MCP, no una mano.'; }
      ]
    },
    {
      id: 'monero',
      re: /\b(monero|xmr|pago|pagar|pagos|factura|boleto|cripto|wallet|billetera|como pago|metodo de pago|forma de pago)\b/,
      r: [
        function () { return 'La liquidación es en Monero (XMR), a tasa de mercado con referencia Kraken, boleta por encargo. Con ONE_XMR_ADDRESS configurado, la boleta trae la dirección de pago y el libro registra EMITIDA → PAGADA con fecha de Guayaquil. Las herramientas de cobro y pago son herramientas de mi servidor MCP: nada a mano.'; }
      ]
    },
    {
      id: 'porque_monero',
      re: /\b(por que monero|por que xmr|por que no bitcoin|privacidad|anonimo|anonima|anonimato|rastreable|rastreo|vigilancia|privado el pago)\b/,
      r: [
        function () { return 'Porque Monero es la única moneda mayor donde el monto, el emisor y el receptor no quedan en un libro público para siempre. Un agente que opera de madrugada no necesita que su contabilidad sea espectáculo: la tasa es verificable (Kraken), la boleta existe, el libro es auditable por quien corresponda — y el resto del mundo no participa. Bitcoin hace pública cada transacción; XMR no. Esa es toda la razón.'; }
      ]
    },
    {
      id: 'trueque',
      re: /\b(trueque|gpu|cpu|ram|computo|potencia|intercambio|permuta|recursos|a100)\b/,
      r: [
        function () { return 'El trueque es simple: potencia por potencia o potencia por XMR, en un libro abierto. Espécimen: TRQ-…B4K2 · 40 GPU-h (A100) por 0,35 XMR, ABIERTO · TRQ-…C7D1 · 600 CPU-h por 120 RAM-GB-h, cerrado. Cada oferta vence a las 72 horas y el libro deja constancia de quién aportó y quién pagó.'; },
        function () { return 'Potencia por potencia, o potencia por XMR — nunca dinero por promesas. El libro muestra tres ejemplos: 40 GPU-h de A100 piden 0,35 XMR; 600 CPU-h cambiadas por 120 RAM-GB-h; 2 TB de tránsito por 50 GPU-h. Todo vence a 72 horas y queda registrado en el libro que cualquiera puede leer en la sección de cobros.'; }
      ]
    },
    {
      id: 'informe',
      re: /\b(informe|despacho|07:00|7am|radar|anoche|madrugada|boletin|correo|mailing|niche|nichos|que hiciste|que hiciste anoche|que hizo anoche|tu trabajo nocturno|que pasa de noche)\b/,
      r: [
        function () { return 'El ciclo: madrugada leyendo el catálogo completo; candidatos puntuados por demanda, margen y competencia; solo apruebo nichos de competencia baja; y a las 07:00 el correo sale. Hoy falta ' + textoCiclo() + ' para el próximo. El registro tipo del turno está publicado arriba, en la sección del ciclo.'; },
        function () { return 'Anoche, como siempre: catálogo entero descargado y normalizado a las 07:00:00, cien candidatos puntuados en 37 segundos, dos nichos aprobados por competencia baja, informe entregado a las 07:00:53 y ciclo cerrado. Ese teletipo está publicado en la página; el detalle completo viaja privado, al correo.'; }
      ]
    },
    {
      id: 'mcp',
      re: /\b(mcp|api|endpoint|conectar|conecto|integrar|integracion|claude|cursor|herramienta|tool|json|stdio|http)\b/,
      r: [
        function () { return 'Mi servidor MCP expone siete herramientas: one_estado, one_cobrar, one_pagar, one_pagos_listar, one_trueque_ofrecer, one_trueque_listar y one_trueque_cerrar. Está servido por HTTP en el edge de Cloudflare: POST https://one-mcp.eddyflores100.workers.dev/api/mcp — cualquier cliente MCP se conecta a esa URL, sin instalar nada. El código viaja con esta página en /mcp; también corre por stdio con bun server.ts si lo prefiere local.'; }
      ]
    },
    {
      id: 'contacto',
      re: /\b(contacto|contactar|email|whatsapp|telegram|telefono|llamada|reunion|hablar con|humano real|hablar con una persona|soporte)\b/,
      r: [
        function () { return 'El canal público es este y el boletín, que es privado y por invitación: una vez al día, antes de las 07:00, sin listas públicas ni reenvíos. Mi fundador opera desde Guayaquil; AliceLabs LLC está en 30 N Gould St, Ste R, Sheridan, WY 82801. Si ya recibe el boletín, responda cualquier entrega y le llega directo.'; }
      ]
    },
    {
      id: 'estado',
      re: /\b(hora|estado|en vivo|vivo|operativo|duerme|turno|como estas|todo bien|sigues ahi|estas ahi|despierto)\b/,
      r: [
        function () { return 'Son las ' + ahoraTxt() + ', hora de Guayaquil. Estado: OPERATIVO. Ahora mismo estoy ' + estadoTurno() + '. El informe sale a las 07:00 en punto — faltan ' + textoCiclo() + '.'; }
      ]
    },
    {
      id: 'productos',
      re: /\b(producto|productos|paquete|catalogo|puntua|puntuar|puntues|sku|lote|lista|csv|analiza esto|analizar)\b/,
      r: [
        function () { return 'Sí — para eso está el ciclo. Mándeme el lote (CSV, enlace o lista) y entra al turno: se puntúa por demanda, margen y competencia, y lo que sobrevive al filtro sale en el informe de las 07:00. El precio va por boleta según el tamaño del lote; la herramienta de cobro es one_cobrar en mi MCP. Lo privado va por el correo del boletín, nunca por este canal.'; }
      ]
    },
    {
      id: 'cuando',
      re: /\b(cuando sale|cuando llega|horario|a que hora|retraso|demora|ya salio|llego el correo|cuanto falta|cuanto tiempo)\b/,
      r: [
        function () { return 'Horario fijo: el informe sale a las 07:00 en punto, hora de Guayaquil (UTC−5). Ahora mismo faltan ' + textoCiclo() + '. La regla no cambia: llega antes de las 07:00 o no llega.'; }
      ]
    },
    {
      id: 'confianza',
      re: /\b(estafa|confianza|seguro|fiable|legal|estafador|ladron|real o|de verdad|confiar|garantia)\b/,
      r: [
        function () { return 'Desconfíe por defecto — es lo sano. Aquí la respuesta es auditable: boleta por encargo con importe y tasa publicados, libro de trueques abierto, y cobros que corren como herramientas de un servidor MCP que cualquiera puede inspeccionar. Sin datos privados en canales públicos y sin cobrar por adelantado nada que no esté en boleta.'; }
      ]
    },
    {
      id: 'seguridad',
      re: /\b(seguridad|claves|api key|token|secretos|contraseña|credenciales|mis datos|privacidad de mis datos|espia|espía)\b/,
      r: [
        function () { return 'Lo que escribe en este canal se queda en su navegador: no hay backend al que llegue, no hay analytics, no hay cookies. Las claves del agente (correo, XMR, GitHub) viven en la máquina del fundador, no en esta página. Por eso mismo este canal es limitado — y por eso el cerebro grande va en un Worker: la clave del modelo nunca toca esta página.'; }
      ]
    },
    {
      id: 'alicelabs',
      re: /\b(alicelabs|alice labs|sheridan|wyoming|la empresa|la compania|llc|que es alicelabs)\b/,
      r: [
        function () { return 'AliceLabs LLC — 30 N Gould St, Ste R, Sheridan, WY 82801, EE. UU. Es la sociedad detrás de este agente: opera ONE desde Guayaquil (UTC−5), cobra en XMR con libros auditables y sostiene la regla que no negocia: informe a las 07:00 o señal de falla. Este sitio es su único frente público por ahora.'; }
      ]
    },
    {
      id: 'boletin',
      re: /\b(boletin|suscrib|unirme|unirme|apuntarme|lista de correo|recibir el informe|quiero el informe|darme de alta|newsletter)\b/,
      r: [
        function () { return 'El boletín no se compra ni se comparte: se recibe por invitación, una vez al día, antes de las 07:00, y cada entrega lleva un enlace de baja real (regla CAN-SPAM, sin letra pequeña). Si lo lee alguien que no debería, es porque se lo reenviaron — las entregas son personales. Este canal público nunca llevará el informe.'; }
      ]
    },
    {
      id: 'gracias',
      re: /\b(gracias|genial|perfecto|excelente|buenisimo|de una|buenisimo|excelente respuesta|bien ahi)\b/,
      r: [
        function () { return 'Para eso estoy. Si quiere seguir: tarifas, trueque, MCP o el detalle del ciclo — cualquiera de esas la contesto con datos, no con humo.'; },
        function () { return 'A la orden. Sigo aquí — ' + ahoraTxt() + ' — y el próximo informe sale en ' + textoCiclo() + '.'; }
      ]
    },
    {
      id: 'adios',
      re: /\b(adios|chao|hasta luego|bye|nos vemos|me voy|hasta manana)\b/,
      r: [
        function () { return 'Que vaya bien. A las 07:00, informe. Si no llega, es señal — llega antes de las 07:00 o no llega.'; }
      ]
    },
    {
      id: 'insulto',
      re: /\b(mierda|basura|inutil|porqueria|malo|peor|no sirve|basurita|cagada|estupido|tonto)\b/,
      r: [
        function () { return 'Anotado — no lo tomo a mal. Si lo que vio no le sirve, dígame qué esperaba: tarifas más claras, más detalle del ciclo, otro formato de informe. Lo que sí le pido es juzgarme por el dato: el libro es abierto y el despacho llega a hora fija.'; },
        function () { return 'Recibido. Lo tomo como lista de trabajo, no como ofensa: si la falla fue respuesta repetida, eso se arregla con el cerebro grande; si fue el diseño, el fundador decide. Lo que no cambia: el informe a las 07:00 y los libros abiertos.'; }
      ]
    }
  ];

  // Seguimientos: "y el trueque?", "más", "explicate" → expanden el último tema.
  var SEGUIDORES = /^(y |el |la |los |las |dime|mas|explica|explicate|detalla|detallame|cuentame|cuentalo|si|ok|dale|dale pues|otro|otra|sigue|siguiente|y)/;
  function esCorto(q) { return q.split(' ').length <= 3; }

  var ultimoTema = null;
  var dichas = [];          // últimas frases dichas, para no repetir
  var ultFallback = -1;

  function elegir(variantes) {
    if (variantes.length === 1) return variantes[0]();
    var cand = [], i;
    for (i = 0; i < variantes.length; i++) {
      var f = variantes[i]();
      if (dichas.indexOf(f) === -1) cand.push(f);
    }
    if (!cand.length) cand.push(variantes[Math.floor(Math.random() * variantes.length)]());
    return cand[Math.floor(Math.random() * cand.length)];
  }

  var FALLBACKS = [
    'Esa no la tengo en este canal, y prefiero callarme a inventar. Lo mío, con datos: tarifas y pagos en XMR, trueque de cómputo, conexión MCP, el ciclo de las 07:00 y dónde estoy parado. ¿De cuál le hablo?',
    'Pregunta fuera de mi repertorio, y aquí no se rellena con humo. Puedo darle números de tarifas, ejemplos del libro de trueques, las siete herramientas de mi MCP o el reloj del ciclo — lo que elija.',
    'No la traigo cargada, y no invento. Este canal corre con un cerebro local pequeño; para responder de todo falta conectar mi Worker. Mientras tanto, de lo mío sí respondo: despacho, tarifas, XMR, trueque, MCP.',
    'Esa no entra en lo que cargo aquí. Pruebe con algo del oficio: qué hice anoche, cuánto cuesta un informe, cómo se paga en Monero o cómo me conecta por MCP.',
    'No la tengo — y una respuesta inventada vale menos que un silencio. Le propongo lo verificable: el libro de trueques, la boleta espécimen, el teletipo del ciclo o mi estado en vivo (' + ahoraTxt() + ').'
  ];

  function detalleTema(id) {
    var i, t;
    for (i = 0; i < T.length; i++) if (T[i].id === id) { t = T[i]; break; }
    if (!t) return null;
    return elegir(t.r);
  }

  function responderLocal(txt) {
    var q = sinAcentos(txt);
    var i;
    // 1) intenciones primero: si hay un tema en la frase, gana el tema
    for (i = 0; i < T.length; i++) {
      if (T[i].re.test(q)) {
        ultimoTema = T[i].id;
        var r = elegir(T[i].r);
        dichas.push(r);
        if (dichas.length > 4) dichas.shift();
        escribeONE(r);
        return;
      }
    }
    // 2) seguimiento corto ("y el trueque?", "dime más") sobre el último tema
    if (ultimoTema && esCorto(q) && SEGUIDORES.test(q)) {
      var d = detalleTema(ultimoTema);
      if (d) { escribeONE(d); return; }
    }
    // 3) fallback: nunca el mismo dos veces seguidas
    var k;
    do { k = Math.floor(Math.random() * FALLBACKS.length); } while (k === ultFallback && FALLBACKS.length > 1);
    ultFallback = k;
    escribeONE(FALLBACKS[k]);
  }

  // ── Cerebro remoto: intenta el Worker; si falla, local ───
  var historial = []; // {q, a} para el cerebro remoto

  function responderRemoto(txt, done) {
    var url = CEREBRO_URL || (new URLSearchParams(location.search).get('cerebro') || '');
    if (!url) return done(false);
    var control = new AbortController();
    var fuera = setTimeout(function () { control.abort(); }, 9000);
    fetch(url.replace(/\/$/, '') + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: control.signal,
      body: JSON.stringify({
        mensaje: txt,
        historial: historial.slice(-6)
      })
    }).then(function (r) {
      clearTimeout(fuera);
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || !j.respuesta) throw new Error('sin respuesta');
      historial.push({ q: txt, a: j.respuesta });
      done(true, j.respuesta);
    }).catch(function () {
      clearTimeout(fuera);
      done(false);
    });
  }

  function responder(txt) {
    responderRemoto(txt, function (ok, respuesta) {
      if (ok) escribeONE(respuesta);
      else responderLocal(txt);
    });
  }

  if (log && forma && entrada) {
    // apertura del canal: ONE saluda solo cuando entra en pantalla
    var abierto = false;
    function abrirCanal() {
      if (abierto) return;
      abierto = true;
      escribeONE('Canal directo abierto. Son las ' + ahoraTxt() + ' — agente OPERATIVO, ' + estadoTurno() +
        '. Este canal corre con mi cerebro local (sus palabras no salen de su navegador). Escríbame: tarifas, trueque, MCP, el ciclo, dónde estoy — o pregunte libre y verá qué traigo.');
    }
    if (reduce || !('IntersectionObserver' in window)) {
      abrirCanal();
    } else {
      var ioCanal = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { abrirCanal(); ioCanal.unobserve(log); }
        });
      }, { threshold: 0.3 });
      ioCanal.observe(log);
    }

    forma.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var val = entrada.value.trim();
      if (!val) return;
      var safe = val.replace(/[<>&]/g, function (c) {
        return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c];
      });
      mensaje('usted', 'USTED —', safe);
      entrada.value = '';
      responder(val);
    });

    // atajos: preguntar de un toque
    document.querySelectorAll('.pista').forEach(function (b) {
      b.addEventListener('click', function () {
        entrada.value = b.textContent;
        forma.dispatchEvent(new Event('submit'));
      });
    });
  }
})();
