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
| **Netlify Functions** | Backend serverless |
| **Cheerio** | Web Scraping (BCV) |
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
├── netlify/
│   └── functions/
│       ├── binance-rate.ts   # API Proxy: Binance P2P
│       ├── crypto-prices.ts  # API Proxy: Precios Cripto
│       ├── dolar-rate.ts     # Scraper: Tasa Dólar BCV
│       └── euro-rate.ts      # Scraper: Tasa Euro BCV
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
┌──────────────┐     ┌─────────────────────┐     ┌──────────────────────┐
│   Frontend   │────▶│  Netlify Function   │────▶│  Web BCV (bcv.org.ve)│
│              │     │  /dolar-rate        │     │  (HTML Scraping)     │
└──────────────┘     └─────────────────────┘     └──────────────────────┘
```

1. **Netlify Functions:** `dolar-rate.ts` y `euro-rate.ts` actúan como backend.
2. **Bypass SSL:** Se configura un agente HTTPS (`rejectUnauthorized: false`) para saltar errores de certificado del sitio del BCV.
3. **Cheerio:** Parsea el HTML y extrae los valores usando selectores (`#dolar strong`, `#euro strong`).
4. **Cache:** Implementa caché de 10 minutos para evitar saturar al BCV y mejorar velocidad.

---

## 🏁 Cómo Iniciar

### Requisitos previos
- Node.js 18+
- npm o yarn
- Netlify CLI (para desarrollo con functions)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/CriptoGuiaVE.git
cd CriptoGuiaVE

# 2. Instalar dependencias
npm install

# 3. Instalar Netlify CLI (si no lo tienes)
npm install -g netlify-cli
```

### Desarrollo Local

```bash
# ⭐ RECOMENDADO: Frontend + Netlify Functions
npm run dev:full

# Solo frontend (sin functions de Binance/BCV)
npm run dev
```

La app estará disponible en:
- **Con functions:** `http://localhost:8888`
- **Solo frontend:** `http://localhost:3000`

---

## 🔌 Integración Binance P2P

### Arquitectura

```
┌──────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│   Frontend   │────▶│  Netlify Function   │────▶│  Binance P2P    │
│              │     │  /binance-rate      │     │  API            │
└──────────────┘     └─────────────────────┘     └─────────────────┘
```

### ¿Por qué una Netlify Function?

La API de Binance P2P tiene restricciones **CORS** que impiden llamarla directamente desde el navegador. La function actúa como proxy:

1. El frontend llama a `/.netlify/functions/binance-rate`
2. La function (servidor) llama a Binance P2P
3. Binance responde a la function
4. La function devuelve los datos al frontend

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

### Probar la Function

```bash
# Localmente (con netlify dev corriendo)
curl http://localhost:8888/.netlify/functions/binance-rate

# En producción
curl https://tuapp.netlify.app/.netlify/functions/binance-rate
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
   npm run dev
   ```

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

### Despliegue Automático (Netlify)

1. Conecta tu repositorio de GitHub a Netlify
2. Netlify detectará automáticamente la configuración
3. Cada push a `main` desplegará automáticamente

### Configuración de Build (netlify.toml)

```toml
[functions]
  directory = "netlify/functions"

[dev]
  command = "npm run dev"
  targetPort = 3000
  port = 8888
```
## Tambien intenta correr si no funciona el binance ##

npm run dev:full

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
