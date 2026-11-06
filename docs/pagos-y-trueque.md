# Pagos en Monero y trueque de cómputo

> Cómo ONE cobra, paga y traba potencia de cálculo. Todo queda en un
> libro auditable; nada viaja en silencio.

## Principios

1. **XMR primero.** Monero (XMR) es la moneda de cobro principal; USD es
   la moneda de lista. La conversión usa la tasa pública de Kraken
   (XMR/USD) al momento de emitir la factura.
2. **Nada silencioso.** Sin configurar nada, las facturas y pagos se
   registran igual, marcados «configurar» o «intención». El libro nunca
   miente.
3. **Auditoría simple.** `pagos.json` y `trueque.json` son archivos
   legibles; `one_pagos_listar` y `one_trueque_listar` los exponen.

## Variables de entorno (del operador, nunca del cliente)

| Variable | Qué habilita |
| --- | --- |
| `ONE_XMR_ADDRESS` | Dirección de cobro real en las facturas |
| `ONE_PAYMENT_LINK` | Link alternativo (Stripe/PayPal) adjunto a facturas |
| `ONE_XMR_WALLET_URL` | RPC de `monero-wallet-rpc` — habilita pagos reales |
| `ONE_XMR_WALLET_USER` / `ONE_XMR_WALLET_PASS` | Credenciales del RPC |
| `ONE_XMR_FALLBACK_RATE` | Tasa fija de respaldo si Kraken no responde |
| `ONE_DATA_DIR` | Carpeta del libro (por defecto `./data/one`) |

## Flujo de cobro

```
one_estado  →  tasa XMR/USD viva + cuenta regresiva del ciclo
one_cobrar →  factura {ítem, USD, XMR a tasa Kraken, estado emitida}
one_pagar  →  intención de pago (o envío real con wallet RPC)
one_pagos_listar → auditoría de la última docena de operaciones
```

Ejemplo tasado del catálogo: informe del ciclo **US$ 120 → 0,8097 XMR**
a tasa 148,20. La factura guarda la tasa usada; una boleta ya emitida no
se retasa.

## Trueque de cómputo

El trueque acepta trabajo de máquina como forma de pago:

| Unidad | Ejemplos del libro |
| --- | --- |
| GPU-h | `40 GPU-h (A100) ⇄ 0,35 XMR` |
| CPU-h | `600 CPU-h ⇄ 120 RAM-GB-h` |
| RAM-GB-h | (trabajan como contraparte de CPU-h o red) |
| red-GB | `2 TB de tránsito ⇄ 50 GPU-h` |

Herramientas MCP del libro:

- `one_trueque_ofrecer` — publica oferta o demanda (con unidades y precio).
- `one_trueque_listar` — muestra abiertos y cerrados.
- `one_trueque_cerrar` — cierra con la contraparte registrada.

Ventana estándar de ejecución acordada: **72 h** desde el cierre.

## Boleta y cumplimiento

- Emisor legal: **AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801, USA**.
- Toda correspondencia (facturas, informes, mensajes) lleva la dirección
  física — cumplimiento CAN-SPAM — y las bajas se atienden de inmediato.
- El libro no contiene datos personales de compradores más allá de lo
  mínimo operativo (identificador del encargo).
