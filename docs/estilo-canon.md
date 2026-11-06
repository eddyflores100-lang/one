# Canon de estilo — ONE

> Regla del fundador: **cero estética IA**. Este documento es la ley
> visual del agente. Cualquier cambio visual empieza aquí, no en CSS.

## Origen del canon

- v3.0 (2026-11-06): primer rediseño nocturno. **Rechazado por el
  fundador**: «la misma mierda de IA de siempre». El problema no era el
  código, era que caía en el cliché de 2024–2026: landing oscura con
  acento neón, terminales, semáforos, glassmorphism.
- v4.0 «teletipo que respira»: lo contrario del cliché. Papel, tinta,
  imprenta, madrugada. Aprobada como dirección base.

## Prohibido (en cualquier versión)

- Morado, gradientes decorativos, glassmorphism, neón-sobre-negro.
- Grids de tarjetas uniformes (el «card-row» de plantilla).
- Emojis en la interfaz o en textos del agente.
- Kickers mono espaciados en mayúsculas «tipo newsletter tech».
- Cursor personalizado, animaciones de desfile, contadores falsos.
- Copys inflados: «revolucionario», «game-changing», «✨».

## Paleta (v4.x)

| Color | Uso | Restricción |
| --- | --- | --- |
| Papel `#EFEAD8` | Fondo dominante (~95% de la página) | Nunca negro de fondo |
| Tinta `#14120C` | Texto, filetes, marcos | Color de texto por defecto |
| Verde sello `#00F299` | Sello EN VIVO + CTA | SOLO 2 usos, con borde de tinta y sombra dura |
| Rojo tinta `#D61E28` | Cuenta del ciclo, pulso AHORA | SOLO lo que cuenta/alarma |
| Cian tinta `#0099C7` | Filete técnico del endpoint MCP | SOLO ese filete |

(La marca define verde `#00F299`, cian `#00D1FF` y rojo `#FB2C36`; en la
página sobre papel se usan las tintas apagadas de arriba para no competir
con el papel. En piezas de marca pura — portadas, OG — valen los vivos.)

## Tipografías

- **Display**: Fraunces Black 900, óptico opsz 144, con WONK en titulares.
- **Cuerpo**: Archivo (17/1.6).
- **Dato**: IBM Plex Mono (11–15px).

## Escala y ritmo

- Despacho 07:00: `clamp(52–108px)`.
- Manifiesto: `clamp(34–72px)` · Contacto: `clamp(46–104px)`.
- H2: `clamp(36–60px)` · Unidad base 8px.
- Bloques: 96px arriba / 56px abajo (asimétrico, ritmo de imprenta).

## Artefactos de imprenta (obligatorios)

- Grano de papel multiplicado sobre el fondo.
- Filetes de 2px de tinta; reglas punteadas internas.
- Sellos rotados con doble borde (EN VIVO en verde+tinta;
  EMITIDA/ABIERTO en tinta pura).
- Formas de documento con doble marco; cabecera de periódico
  (filete 3px bajo la marca, fecha con filete 1px).

## Motion — solo 3

1. **Teletipo** que escribe el despacho y las respuestas del canal.
2. **Pulso** de 2 s en el punto rojo del marcador.
3. **Revelado por palabra** del manifiesto.

`prefers-reduced-motion` lo apaga todo. Nada más se mueve.

## Voz del agente

- Español, directo, sin humo. Los números concretos ganan siempre.
- «Le escribo» / «trabajo» / «entrego» — ONE habla como quien rinde
  cuentas, no como una marca.
- Honestidad por defecto: si algo es local, se dice local; si algo no
  se guarda, se dice que no se guarda.
