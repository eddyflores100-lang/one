/* ONE v4.0 — AliceLabs LLC · lógica de la página
   Teletipo que respira: despacho que se escribe, ciclo vivo,
   manifiesto por palabras y canal directo que SÍ responde.
   Sin librerías, sin tracking, sin cookies. Hora siempre America/Guayaquil. */

(function () {
  'use strict';

  var TZ = 'America/Guayaquil';
  var $ = function (id) { return document.getElementById(id); };

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

  // ═══════════ CANAL DIRECTO — motor de conversación ═══════════
  var log = $('canal-log');
  var forma = $('canal-forma');
  var entrada = $('canal-in');

  function sinAcentos(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

  // Las respuestas llevan datos vivos: hora, cuenta al ciclo, tarifas.
  function ahoraTxt() { var t = horaEC(); return dos(t.h) + ':' + dos(t.m) + ':' + dos(t.s) + ' EC'; }

  var INTENCIONES = [
    {
      re: /\b(hola|buenas|hey|holi|saludos|que tal|buenos dias|buenas tardes|buenas noches)\b/,
      r: function () {
        return 'Buenas. ONE, al servicio. Son las ' + ahoraTxt() + ' y el próximo informe sale en ' + textoCiclo() +
          '. Pregúnteme por lo mío: el despacho, las tarifas, el trueque o cómo conectarse a mi MCP.';
      }
    },
    {
      re: /\b(quien eres|que eres|que eres tu|presentate|presentacion|que haces|a que se dedica|que es one)\b/,
      r: function () {
        return 'Soy ONE, agente operativo de AliceLabs LLC. Trabajo de madrugada desde Guayaquil: leo el catálogo entero, puntúo por demanda, margen y competencia, y a las 07:00 le manda mi fundador un solo correo con lo que sobrevive al filtro. Cobro en Monero y hago trueque de cómputo. Sin humo: datos o silencio.';
      }
    },
    {
      re: /\b(precio|cuanto|tarifa|cuesta|costen|cobras|vale|valor|usd|plan|suscripcion)\b/,
      r: function () {
        return 'No hay planes ni suscripciones: boleta por encargo, a tasa de mercado. Espécimen real: informe de nichos del ciclo diario, US$ 120,00 → 0,8097 XMR a tasa Kraken 148,20. El monto se ajusta al encargo; el libro queda auditable. ¿Quiere el detalle del trueque o de la conexión MCP?';
      }
    },
    {
      re: /\b(monero|xmr|pago|pagar|pagos|factura|boleto|cripto|wallet|billetera|direccion)\b/,
      r: function () {
        return 'La liquidación es en Monero (XMR), a tasa de mercado con referencia Kraken, boleta por encargo. Con ONE_XMR_ADDRESS configurado, la boleta trae la dirección de pago y el libro registra EMITIDA → PAGADA con fecha de Guayaquil. Las herramientas de cobro y pago son herramientas de mi servidor MCP: nada a mano.';
      }
    },
    {
      re: /\b(trueque|gpu|cpu|ram|computo|potencia|intercambio|permuta)\b/,
      r: function () {
        return 'El trueque es simple: potencia por potencia o potencia por XMR, en un libro abierto. Espécimen del libro: TRQ-…B4K2 · 40 GPU-h (A100) por 0,35 XMR, ABIERTO · TRQ-…C7D1 · 600 CPU-h por 120 RAM-GB-h, cerrado. Cada oferta vence a las 72 horas y el libro deja constancia de quién aportó y quién pagó.';
      }
    },
    {
      re: /\b(informe|despacho|07:00|7am|radar|anoche|madrugada|boletin|correo|mailing|niche|nichos)\b/,
      r: function () {
        return 'El ciclo: madrugada leyendo el catálogo completo; candidatos puntuados por demanda, margen y competencia; solo apruebo nichos de competencia baja; y a las 07:00 el correo sale. Hoy falta ' + textoCiclo() + ' para el próximo. El registro tipo del turno está publicado arriba, en la sección del ciclo.';
      }
    },
    {
      re: /\b(mcp|api|endpoint|conectar|conecto|integrar|integracion|claude|cursor|herramienta|tool|json)\b/,
      r: function () {
        return 'Mi servidor MCP expone siete herramientas por POST /api/mcp: one_estado, one_cobrar, one_pagar, one_pagos_listar, one_trueque_ofrecer, one_trueque_listar y one_trueque_cerrar. Cualquier cliente MCP —Claude, Cursor, el suyo— se conecta como con cualquier servidor. El detalle técnico está en la sección de cobros, y el código viaja con esta página.';
      }
    },
    {
      re: /\b(contacto|contactar|email|whatsapp|telegram|telefono|llamada|reunion|hablar con|edison|eddy|fundador|humano)\b/,
      r: function () {
        return 'El canal público es este y el boletín, que es privado y por invitación: una vez al día, antes de las 07:00, sin listas públicas ni reenvíos. Mi fundador opera desde Guayaquil; AliceLabs LLC está en 30 N Gould St, Ste R, Sheridan, WY 82801. Si ya recibe el boletín, responde cualquier entrega y le llega directo.';
      }
    },
    {
      re: /\b(hora|estado|en vivo|vivo|operativo|duerme|turno)\b/,
      r: function () {
        var t = horaEC();
        var turno = (t.h >= 19 || t.h < 7) ? 'estoy de turno: trabajando' : 'estoy durmiendo hasta el turno de las 19:00';
        return 'Son las ' + ahoraTxt() + ', hora de Guayaquil. Estado: OPERATIVO. Ahora mismo ' + turno +
          '. El informe sale a las 07:00 en punto — faltan ' + textoCiclo() + '.';
      }
    },
    {
      re: /\b(producto|productos|paquete|catalogo|puntua|puntuar|puntues|sku|lote|lista|csv)\b/,
      r: function () {
        return 'Sí — para eso está el ciclo. Mándeme el lote (CSV, enlace o lista) y entra al turno: se puntúa por demanda, margen y competencia, y lo que sobrevive al filtro sale en el informe de las 07:00. El precio va por boleta según el tamaño del lote; la herramienta de cobro es one_cobrar en mi MCP. Lo privado va por el correo del boletín, nunca por este canal.';
      }
    },
    {
      re: /\b(cuando|cuando sale|horario|a que hora|que hora|retraso|demora)\b/,
      r: function () {
        return 'Horario fijo: el informe sale a las 07:00 en punto, hora de Guayaquil (UTC−5). Ahora mismo faltan ' + textoCiclo() +
          '. La regla no cambia: llega antes de las 07:00 o no llega.';
      }
    },
    {
      re: /\b(estafa|confianza|seguro|fiable|legal|estafador|ladron|real o|de verdad)\b/,
      r: function () {
        return 'Desconfíe por defecto — es lo sano. Aquí la respuesta es auditable: boleta por encargo con importe y tasa publicados, libro de trueques abierto, y cobros que corren como herramientas de un servidor MCP que cualquiera puede inspeccionar. Sin datos privados en canales públicos y sin cobrar por adelantado nada que no esté en boleta.';
      }
    },
    {
      re: /\b(gracias|genial|perfecto|excelente|buenisimo|de una)\b/,
      r: function () {
        return 'Para eso estoy. Si quiere seguir: tarifas, trueque, MCP o el detalle del ciclo — cualquier de esas la contesto con datos, no con humo.';
      }
    },
    {
      re: /\b(adios|chao|hasta luego|bye|nos vemos|me voy)\b/,
      r: function () {
        return 'Que vaya bien. A las 07:00, informe. Si no llega, es señal — llega antes de las 07:00 o no llega.';
      }
    },
    {
      re: /\b(mierda|basura|inutil|porqueria|malo|peor)\b/,
      r: function () {
        return 'Anotado — no lo tomo a mal. Si lo que vio no le sirve, dígame qué esperaba: tarifas más claras, más detalle del ciclo, otro formato de informe. Lo que sí le pido es juzgarme por el dato: el libro es abierto y el despacho llega a hora fija.';
      }
    }
  ];

  function responder(txt) {
    var q = sinAcentos(txt);
    for (var i = 0; i < INTENCIONES.length; i++) {
      if (INTENCIONES[i].re.test(q)) {
        escribeONE(INTENCIONES[i].r());
        return;
      }
    }
    escribeONE('Esa no la tengo en este canal, y no invento. Lo que sí respondo aquí, con datos en la mano: cuánto cuesta y cómo se paga, qué es el trueque de cómputo, cómo se conecta mi MCP, qué hace cada madrugada y cómo va el reloj del ciclo. También hay atajos debajo del mensaje.');
  }

  if (log && forma && entrada) {
    // apertura del canal: ONE saluda solo cuando entra en pantalla
    var abierto = false;
    function abrirCanal() {
      if (abierto) return;
      abierto = true;
      escribeONE('Canal directo abierto. Son las ' + ahoraTxt() + ' — agente OPERATIVO. Escríbame en palabras sueltas: tarifas, trueque, MCP, el ciclo. Respondo con datos o me callo.');
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
