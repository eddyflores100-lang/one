/* ONE — AliceLabs LLC · lógica de la página
   Reloj vivo y cuenta regresiva en hora de Ecuador (America/Guayaquil, UTC−5).
   Sin librerías, sin tracking, sin cookies. */

(function () {
  'use strict';

  var TZ = 'America/Guayaquil';

  // ── Hora de Ecuador ──────────────────────────────────────
  var fmtHora = new Intl.DateTimeFormat('es-EC', {
    timeZone: TZ, hour12: false,
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
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

  // Segundos que faltan para el próximo 07:00:00 EC
  function segHastaCiclo() {
    var t = horaEC();
    var ahora = t.h * 3600 + t.m * 60 + t.s;
    var objetivo = 7 * 3600;
    var diff = objetivo - ahora;
    if (diff <= 0) diff += 24 * 3600;
    return diff;
  }

  function dos(n) { return (n < 10 ? '0' : '') + n; }

  function tick() {
    var reloj = document.getElementById('reloj');
    var eHora = document.getElementById('estado-hora');
    var eCiclo = document.getElementById('estado-ciclo');
    if (reloj) reloj.textContent = fmtHora.format(new Date());
    if (eHora) eHora.textContent = fmtHora.format(new Date());
    if (eCiclo) {
      var s = segHastaCiclo();
      var h = Math.floor(s / 3600);
      var m = Math.floor((s % 3600) / 60);
      var sec = s % 60;
      eCiclo.textContent = 'EN ' + dos(h) + 'H ' + dos(m) + 'M ' + dos(sec) + 'S';
    }
  }

  tick();
  setInterval(tick, 1000);

  // ── Reveals al hacer scroll ─────────────────────────────
  var elementos = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          el.style.transitionDelay = (Math.min(i, 5) * 70) + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    elementos.forEach(function (el) { io.observe(el); });
  } else {
    elementos.forEach(function (el) { el.classList.add('in'); });
  }
})();
