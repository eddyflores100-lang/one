/* ONE v3.0 — AliceLabs LLC · lógica de la página
   Reloj vivo, ciclo 24h, revelado por palabras y consola local honesta.
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

  function horaEC() {
    var p = fmtPartes.formatToParts(new Date()).reduce(function (acc, x) {
      if (x.type !== 'literal') acc[x.type] = parseInt(x.value, 10);
      return acc;
    }, {});
    return { h: p.hour % 24, m: p.minute, s: p.second };
  }
  function dos(n) { return (n < 10 ? '0' : '') + n; }

  // Segundos que faltan para el próximo 07:00:00 EC
  function segHastaCiclo() {
    var t = horaEC();
    var ahora = t.h * 3600 + t.m * 60 + t.s;
    var diff = 7 * 3600 - ahora;
    if (diff <= 0) diff += 24 * 3600;
    return diff;
  }

  // ── Tick principal: relojes + barra de ciclo + marcador ──
  function tick() {
    var t = horaEC();
    var hhmm = dos(t.h) + ':' + dos(t.m);
    var seg = ':' + dos(t.s);

    var reloj = $('reloj');            // segundos en el chip de cabecera
    if (reloj) reloj.textContent = hhmm + seg;
    var eHora = $('estado-hora');      // reloj gigante del hero
    if (eHora) eHora.firstChild.nodeValue = hhmm;
    var eSeg = $('reloj-seg');
    if (eSeg) eSeg.textContent = seg;

    var s = segHastaCiclo();
    var eCiclo = $('estado-ciclo');
    if (eCiclo) eCiclo.textContent = dos(Math.floor(s / 3600)) + 'h ' +
      dos(Math.floor((s % 3600) / 60)) + 'm ' + dos(s % 60) + 's';

    // posición en el ciclo de 24h (0% = 07:00, 50% = 19:00, 100% = 07:00)
    var ahora = t.h * 3600 + t.m * 60 + t.s;
    var desde07 = (ahora - 7 * 3600 + 24 * 3600) % (24 * 3600);
    var pct = (desde07 / (24 * 3600)) * 100;
    var barra = $('barra-ciclo');
    if (barra) barra.style.width = pct + '%';
    var marca = $('marcador-ciclo');
    if (marca) marca.style.left = pct + '%';
  }

  tick();
  setInterval(tick, 1000);

  // ── Reveals al hacer scroll ─────────────────────────────
  var elementos = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
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
  document.querySelectorAll('[data-words]').forEach(function (bloque) {
    var texto = bloque.textContent.trim().split(/\s+/);
    bloque.textContent = '';
    texto.forEach(function (palabra, i) {
      var sp = document.createElement('span');
      sp.className = 'w';
      sp.textContent = palabra;
      bloque.appendChild(sp);
      if (i < texto.length - 1) bloque.appendChild(document.createTextNode(' '));
    });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      bloque.querySelectorAll('.w').forEach(function (w) { w.classList.add('on'); });
      return;
    }
    var ioW = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var ws = bloque.querySelectorAll('.w');
        ws.forEach(function (w, i) {
          setTimeout(function () { w.classList.add('on'); }, i * 55);
        });
        ioW.unobserve(bloque);
      });
    }, { threshold: 0.35 });
    ioW.observe(bloque);
  });

  // ── Consola local honesta ───────────────────────────────
  var log = $('term-log');
  var form = $('term-form');
  var input = $('consola-in');

  function linea(clase, html) {
    var p = document.createElement('p');
    p.className = 'ln' + (clase ? ' ' + clase : '');
    p.innerHTML = html;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }
  function escribe(clase, texto, vel) {
    var p = linea(clase, '');
    var i = 0;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { p.textContent = texto; log.scrollTop = log.scrollHeight; return; }
    (function paso() {
      if (i <= texto.length) {
        p.textContent = texto.slice(0, i);
        i += 2;
        log.scrollTop = log.scrollHeight;
        setTimeout(paso, vel || 12);
      }
    })();
  }

  function respuesta(cmd) {
    var t = horaEC();
    switch (cmd) {
      case 'ayuda':
        linea('', '<span class="tag">one</span>Comandos disponibles: <b>estado</b> · <b>hora</b> · <b>tarifas</b> · <b>trueques</b> · <b>mcp</b> · <b>quien</b> · <b>clear</b>');
        break;
      case 'estado':
        escribe('u', 'Hora Guayaquil: ' + dos(t.h) + ':' + dos(t.m) + ':' + dos(t.s) + ' (UTC−5) · Estado: OPERATIVO · ' +
          'Próximo informe en ' + $('estado-ciclo').textContent + ' · Moneda: XMR (Monero)');
        break;
      case 'hora':
        escribe('u', dos(t.h) + ':' + dos(t.m) + ':' + dos(t.s) + ' — hora de Guayaquil, Ecuador.');
        break;
      case 'tarifas':
        linea('', '<span class="tag">one</span>Liquidación en XMR a tasa de mercado (ref. Kraken). Espécimen: US$ 120,00 → 0,8097 XMR a 148,20. Sin suscripciones: boleta por encargo.');
        break;
      case 'trueques':
        linea('', '<span class="tag">one</span>Libro (espécimen): TRQ-…B4K2 · 40 GPU-h ↔ 0,35 XMR · ABIERTO — TRQ-…C7D1 · 600 CPU-h ↔ 120 RAM-GB-h · CERRADO — TRQ-…A9F0 · 2 TB tránsito ↔ 50 GPU-h · CERRADO');
        break;
      case 'mcp':
        linea('', '<span class="tag">one</span>Endpoint: <b>POST /api/mcp</b> (streamable HTTP, CORS abierto). Siete herramientas: one_estado, one_cobrar, one_pagar, one_pagos_listar, one_trueque_ofrecer, one_trueque_listar, one_trueque_cerrar.');
        escribe('', 'El backend HTTP completo corre en despliegue propio (Worker); esta consola pública interpreta localmente y nunca ve claves.');
        break;
      case 'quien':
        escribe('u', 'ONE — agente operativo de AliceLabs LLC (30 N Gould St, Ste R, Sheridan, WY 82801). Trabaja de noche, cobra en Monero, reporta a las 07:00 EC.');
        break;
      case 'clear':
        log.innerHTML = '';
        break;
      case '':
        break;
      default:
        escribe('', 'Canal público: no proceso datos privados aquí. Escribe ayuda para ver los comandos.', 8);
    }
  }

  // ── Arranque de la consola: se escribe solo al entrar en pantalla ──
  function arranque() {
    var t = horaEC();
    escribe('', 'Turno abierto · ' + dos(t.h) + ':' + dos(t.m) + ':' + dos(t.s) + ' EC — agente OPERATIVO.', 14);
    setTimeout(function () {
      escribe('', 'El informe de las 07:00 sale por correo. Esta consola corre en tu navegador y no ve claves.', 10);
    }, 700);
    setTimeout(function () {
      linea('', '<span class="tag">one</span>Escribe <b>ayuda</b> para ver los comandos.');
    }, 1600);
  }

  if (log) {
    var termEl = document.querySelector('.term');
    var lanzado = false;
    if (termEl && 'IntersectionObserver' in window &&
        !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      var ioT = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting && !lanzado) {
            lanzado = true;
            arranque();
            ioT.unobserve(termEl);
          }
        });
      }, { threshold: 0.3 });
      ioT.observe(termEl);
    } else {
      var t = horaEC();
      linea('', '<span class="tag">one</span>Turno abierto · ' + dos(t.h) + ':' + dos(t.m) + ':' + dos(t.s) + ' EC — agente OPERATIVO. Escribe <b>ayuda</b> para ver los comandos.');
    }
  }

  if (form && input && log) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var val = input.value.trim();
      if (val) linea('u', '<span class="cmd">$</span> ' + val.replace(/[<>&]/g, function (c) {
        return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c];
      }));
      respuesta(val.toLowerCase());
      input.value = '';
    });
  }
})();
