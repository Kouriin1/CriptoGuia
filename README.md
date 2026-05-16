# 🇻🇪 CriptoGuíaVE

**Tu brújula en el ecosistema cripto de Venezuela.**

## 📖 Descripción del Proyecto

**CriptoGuíaVE** es una plataforma web diseñada específicamente para el usuario venezolano, con el objetivo de educar, facilitar y asegurar la adopción de criptomonedas en el país. En un entorno económico donde las criptomonedas juegan un papel fundamental para el ahorro, las remesas y el comercio diario, esta herramienta busca cerrar la brecha de conocimiento y proporcionar utilidades prácticas.

La aplicación combina recursos educativos profundos con herramientas de simulación y datos de mercado, todo presentado en una interfaz moderna, intuitiva y adaptada tanto a modo claro como oscuro.

## 🚀 Características Principales

### 1. 🏠 Panel Principal (Dashboard)
Una vista general del mercado con información relevante al instante:
- **Análisis Dual del Dólar:** 
  - **Vista Tendencia:** Histórico y comportamiento del paralelo (alcista/bajista).
  - **Vista Brecha:** Comparativa en tiempo real entre Paralelo vs. BCV, con indicador de "Brecha Cambiaria" y alertas de distorsión de mercado.
- **Tasas de Cambio:** Dólar Paralelo (Binance P2P), Dólar BCV y Euro BCV.
- **Perspectivas de Mercado:** Análisis de tendencias y sentimiento global.
- **Insight Diario:** Consejos educativos y noticias relevantes cada día.
- **Distribución de Activos:** Gráficos visuales para entender la diversificación.
- **Chat IA:** Asistente inteligente integrado (Groq/LLaMA 3).

### 2. 📚 Centro Educativo (Core del Proyecto)
El corazón de la aplicación, diseñado para llevar al usuario de principiante a experto:
- **Glosario Interactivo:** Términos complejos explicados de forma sencilla.
- **Guías Paso a Paso:** Tutoriales detallados para operaciones esenciales.
- **Casos de Uso:** Ejemplos prácticos de cómo las criptomonedas resuelven problemas diarios.

### 3. 🔢 Simulador de Conversión (Rediseñado)
Herramienta calculadora optimizada que permite estimar conversiones con precisión:
- **Selector Unificado:** Cambia fácilmente entre Bolívares (Paralelo), USDT, Dólar BCV y Euro BCV.
- **Cálculos Precisos:** Utiliza las tasas reales (Binance para el paralelo, BCV oficial para tasas gubernamentales).
- **Interfaz Limpia:** Diseño moderno con iconos intuitivos para una mejor experiencia de usuario.

### 4. 🛡️ Centro de Seguridad
Sección dedicada a la prevención de estafas y buenas prácticas.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **React** + **TypeScript** | Frontend |
| **Vite** | Build tool y dev server |
| **Tailwind CSS** | Estilos |
| **Cloudflare Workers** | Backend serverless (single Worker, rutas `/api/*`) |
| **Cloudflare Pages (Assets)** | Hosting estatico de la SPA via binding `ASSETS` |
| **Cheerio** | Web Scraping (BCV) con fallback a `ve.dolarapi.com` |
| **Recharts** | Gráficos de datos |
| **Framer Motion** | Animaciones |
| **Binance P2P API** | Tasa del dólar paralelo |
| **Groq API** | Chat inteligente (LLaMA 3.3 70B) |

---

## 📂 Estructura del Proyecto

```
CriptoGuiaVE/
├── components/               # Componentes de React
│   ├── AIChat.tsx            # Asistente virtual IA
│   ├── AssetDistribution.tsx # Distribución de activos (Gráficos)
│   ├── DailyInsight.tsx      # Información diaria relevante
│   ├── DollarAnalysis.tsx    # Análisis del Dólar (Tendencia + Brecha)
│   ├── DolarExchangeRateCard.tsx # Tarjeta tasa Dólar
│   ├── EuroExchangeRateCard.tsx  # Tarjeta tasa Euro
│   ├── Education.tsx         # Módulo educativo
│   ├── ExchangeRateCard.tsx  # Componente base de tasa
│   ├── GlobalMarket.tsx      # Precios mercado global
│   ├── Header.tsx            # Cabecera de la app
│   ├── MarketPerspectives.tsx# Perspectivas del mercado
│   ├── Navigation.tsx        # Navegación principal
│   ├── PageTransition.tsx    # Animaciones de página
│   ├── Security.tsx          # Centro de seguridad
│   ├── Simulator.tsx         # Calculadora de conversión
│   ├── ThemeToggle.tsx       # Switch claro/oscuro
│   └── icons.tsx             # Iconos SVG
├── contexts/
│   └── ThemeContext.tsx      # Manejo del tema (Claro/Oscuro)
├── worker/
│   └── index.ts              # Cloudflare Worker (rutas /api/* + serve SPA)
│       # GET /api/binance-rate   → Proxy Binance P2P
│       # GET /api/crypto-prices  → Proxy CoinGecko
│       # GET /api/dolar-rate     → Scraping BCV USD (+ fallback dolarapi)
│       # GET /api/euro-rate      → Scraping BCV EUR (+ fallback dolarapi)
├── services/
│   ├── IAService.ts          # Servicio Groq AI
│   ├── binanceService.ts     # Servicio Cliente Binance
│   ├── cryptoService.ts      # Servicio CoinGecko
│   └── rateHistoryService.ts # Historial de tasas
├── App.tsx                   # Componente Principal
├── index.html                # Punto de entrada HTML
├── tailwind.config.js        # Configuración Tailwind
└── vite.config.ts            # Configuración Vite
```

---

## 🕷️ Integración Web Scraping (BCV)

### Arquitectura BCV

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│   Frontend   │────▶│  Cloudflare Worker   │────▶│  Web BCV (bcv.org.ve)│
│              │     │  /api/dolar-rate     │     │  (HTML Scraping)     │
└──────────────┘     └──────────────────────┘     └──────────────────────┘
                              │
                              │ si falla scraping (SSL, timeout, etc.)
                              ▼
                     ┌──────────────────────┐
                     │  ve.dolarapi.com     │  (fallback automatico)
                     └──────────────────────┘
```

1. **Cloudflare Worker:** Un solo archivo `worker/index.ts` expone `/api/dolar-rate` y `/api/euro-rate`.
2. **Cheerio:** Parsea el HTML del BCV con selectores `#dolar strong` y `#euro strong`.
3. **Fallback:** Si el scraping falla (SSL, sitio caido, cambio de HTML), el Worker consulta automaticamente `ve.dolarapi.com` para no romper la UI.
4. **Cache:** Cache en memoria del Worker (10 minutos) para evitar saturar al BCV. Se mantiene mientras el isolate del Worker este caliente.

---

## 🏁 Cómo Iniciar

### Requisitos previos
- Node.js 20+ (recomendado, por compatibilidad con wrangler y workerd)
- pnpm (`npm install -g pnpm`)
- Cuenta de Cloudflare (solo para desplegar; en local no hace falta)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Kouriin1/CriptoGuia.git
cd CriptoGuia

# 2. Instalar dependencias con pnpm
pnpm install

# 3. Crear archivo .env (solo si vas a usar el chat IA)
cp env.example .env
# Editar .env y pegar tu API key de Groq en VITE_API_KEY
```

### Desarrollo Local

```bash
pnpm run dev
```

El @cloudflare/vite-plugin levanta en una sola URL:
- El frontend (React + Vite)
- El Worker (`worker/index.ts`) respondiendo en `/api/*`

La app queda en `http://localhost:3000` y las rutas `/api/binance-rate`, `/api/dolar-rate`, `/api/euro-rate`, `/api/crypto-prices` funcionan en el mismo origen (sin CORS).

### Build y Deploy

```bash
# Solo build (genera dist/ con assets y bundle del worker)
pnpm run build

# Build + Preview local con wrangler (simula el entorno de Cloudflare)
pnpm run preview

# Build + Deploy a Cloudflare
pnpm run deploy
```

Antes de `pnpm run deploy` por primera vez:
```bash
pnpm exec wrangler login
```

---

## 🔌 Integración Binance P2P

### Arquitectura

```
┌──────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   Frontend   │────▶│  Cloudflare Worker   │────▶│  Binance P2P    │
│              │     │  /api/binance-rate   │     │  API            │
└──────────────┘     └──────────────────────┘     └─────────────────┘
```

### ¿Por qué pasar por el Worker?

La API de Binance P2P bloquea **CORS** desde navegadores. El Worker actúa como proxy:

1. El frontend llama a `/api/binance-rate`
2. El Worker (servidor) llama a Binance P2P
3. Binance responde al Worker
4. El Worker devuelve los datos al frontend, con cache de 30s en memoria

### Endpoint de Binance P2P

```
POST https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search
```

**Body:**
```json
{
  "asset": "USDT",
  "fiat": "VES",
  "tradeType": "SELL",
  "page": 1,
  "rows": 5
}
```

### Respuesta de la Function

```json
{
  "success": true,
  "rate": 597.98,          // Promedio de los 5 primeros anuncios
  "firstPrice": 600,       // Precio más bajo
  "prices": [600, 598, 597, 596, 599],
  "adsCount": 5,
  "timestamp": "2026-01-04T17:30:00.000Z"
}
```

### Probar el endpoint

```bash
# Localmente (con pnpm run dev)
curl http://localhost:3000/api/binance-rate

# En produccion
curl https://criptoguia.<tu-subdominio>.workers.dev/api/binance-rate
```

---

## 🤖 Integración Chat IA (Groq)

### Arquitectura

```
┌──────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│   AIChat.tsx │────▶│   IAService.ts      │────▶│   Groq API      │
│  (Frontend)  │     │   (Service Layer)   │     │  (LLaMA 3.3)    │
└──────────────┘     └─────────────────────┘     └─────────────────┘
```

### Componentes del Sistema

| Archivo | Descripción |
|---------|-------------|
| `services/IAService.ts` | Servicio que maneja la comunicación con Groq API |
| `components/AIChat.tsx` | Componente React del chat con UI completa |
| `.env` | Almacena la API key de Groq |
| `vite-env.d.ts` | Tipos TypeScript para variables de entorno |

### Configuración

1. **Obtener API Key de Groq:**
   - Regístrate en [console.groq.com](https://console.groq.com)
   - Crea una nueva API key
   - Es **GRATIS** con límites generosos

2. **Configurar variable de entorno:**
   ```bash
   # .env (en la raíz del proyecto)
   VITE_API_KEY=gsk_tu_api_key_aqui
   ```

3. **Reiniciar el servidor de desarrollo:**
   ```bash
   pnpm run dev
   ```

> ⚠️ **Nota de seguridad:** Hoy el chat IA llama a Groq directamente desde el navegador, lo que expone la API key (Vite `VITE_*` queda en el bundle). Para produccion se recomienda mover esa llamada al Worker (`/api/ai-chat`) y guardar la key como secret de Cloudflare con `wrangler secret put GROQ_API_KEY`.

### Características Implementadas

#### ✅ Respuestas Contextuales
- La IA mantiene contexto de los últimos 10 mensajes
- Responde SOLO sobre criptomonedas (rechaza otros temas)
- Enfocada en el contexto venezolano (bolívares, P2P, etc.)

#### ✅ Persistencia del Chat
- El historial se guarda en `localStorage`
- Sobrevive recargas de página
- Botón "Limpiar" para resetear conversación

#### ✅ Límite de Mensajes Diarios
- **10 mensajes por día** por usuario
- Se resetea automáticamente a medianoche
- Contador visual en la UI
- Previene abuso de la API gratuita

### System Prompt (Instrucciones de la IA)

El asistente está configurado para:
- ✅ Responder sobre cripto, wallets, exchanges, seguridad
- ✅ Considerar el contexto venezolano
- ✅ Mantener respuestas concisas (3-4 oraciones)
- ❌ Rechazar temas no relacionados (política, deportes, etc.)
- ❌ No usar formato markdown en respuestas

### Estructura del Código

#### `IAService.ts`
```typescript
// Configuración
const GROQ_API_KEY = import.meta.env.VITE_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Función principal
export async function sendMessageToAI(
  message: string,                    // Mensaje del usuario
  chatHistory: Array<{...}> = []      // Historial para contexto
): Promise<string>                    // Retorna respuesta de texto
```

#### `AIChat.tsx`
```typescript
// Claves de localStorage
const STORAGE_KEY = 'criptoguia_chat_history';     // Historial
const MESSAGE_COUNT_KEY = 'criptoguia_message_count'; // Contador
const MESSAGE_DATE_KEY = 'criptoguia_message_date';   // Fecha
const MAX_MESSAGES_PER_SESSION = 10;               // Límite diario
```

### Modelo de IA Utilizado

| Propiedad | Valor |
|-----------|-------|
| Proveedor | Groq (gratuito) |
| Modelo | `llama-3.3-70b-versatile` |
| Temperature | 0.7 (balance creatividad/precisión) |
| Max Tokens | 500 (longitud máxima de respuesta) |

### Manejo de Errores

1. **Sin API Key:** Muestra mensaje informando que IA no está disponible
2. **Error de API:** Muestra mensaje amigable al usuario
3. **Límite alcanzado:** Deshabilita input y muestra contador

---

## 📤 Despliegue

### Despliegue manual a Cloudflare Workers

```bash
pnpm exec wrangler login   # solo la primera vez
pnpm run deploy
```

`pnpm run deploy` ejecuta `vite build` (genera `dist/`) y luego `wrangler deploy`, que sube el Worker (`worker/index.ts`) junto con los assets de la SPA (`dist/client`) usando el binding `ASSETS` definido en `wrangler.jsonc`.

### Configuración Cloudflare (wrangler.jsonc)

```jsonc
{
  "name": "criptoguia",
  "main": "worker/index.ts",
  "compatibility_date": "2026-05-14",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist/client",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application"
  }
}
```

### Despliegue automatico (CI/CD)

Para desplegar en cada push a `main` puedes:
- Conectar el repo a **Cloudflare Pages** (workers + assets) desde el dashboard, o
- Usar GitHub Actions con `cloudflare/wrangler-action` ejecutando `pnpm run deploy`

---

## 🔮 Roadmap

- [x] Integración de tasas en tiempo real (Binance P2P)
- [x] Chat con Inteligencia Artificial (Groq)
- [x] Modo Oscuro / Claro
- [x] Tasa oficial BCV (web scraping)
- [x] Simulador de conversión avanzado (Paralelo y BCV)
- [x] Análisis de Brecha Cambiaria
- [ ] Versión PWA (App instalable)
- [ ] Notificaciones de precios (Telegram/Email)
