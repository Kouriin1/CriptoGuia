# 🇻🇪 CriptoGuíaVE

**Tu brújula en el ecosistema cripto de Venezuela.**

## 📖 Descripción del Proyecto

**CriptoGuíaVE** es una plataforma web diseñada específicamente para el usuario venezolano, con el objetivo de educar, facilitar y asegurar la adopción de criptomonedas en el país. En un entorno económico donde las criptomonedas juegan un papel fundamental para el ahorro, las remesas y el comercio diario, esta herramienta busca cerrar la brecha de conocimiento y proporcionar utilidades prácticas.

La aplicación combina recursos educativos profundos con herramientas de simulación y datos de mercado, todo presentado en una interfaz moderna, intuitiva y adaptada tanto a modo claro como oscuro.

## 🚀 Características Principales

### 1. 🏠 Panel Principal (Dashboard)
Una vista general del mercado con información relevante al instante:
- **Tasas de Cambio en Tiempo Real:** Precio del dólar paralelo obtenido de Binance P2P.
- **Perspectivas de Mercado:** Análisis de tendencias actuales.
- **Distribución de Activos:** Gráficos visuales para entender la diversificación.
- **Chat IA:** Un asistente inteligente integrado para responder dudas rápidas sobre cripto.

### 2. 📚 Centro Educativo (Core del Proyecto)
El corazón de la aplicación, diseñado para llevar al usuario de principiante a experto:
- **Glosario Interactivo:** Términos complejos explicados de forma sencilla.
- **Guías Paso a Paso:** Tutoriales detallados para operaciones esenciales.
- **Casos de Uso:** Ejemplos prácticos de cómo las criptomonedas resuelven problemas diarios.

### 3. 🔢 Simulador de Conversión
Herramienta calculadora que permite estimar conversiones entre Bolívares (VES) y Criptomonedas (USDT, BTC, ETH) en tiempo real.

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
| **Binance P2P API** | Tasa del dólar paralelo |
| **Gemini AI** | Chat inteligente |

---

## 📂 Estructura del Proyecto

```
CriptoGuiaVE/
├── components/               # Componentes de React
│   ├── AIChat.tsx            # Asistente virtual IA
│   ├── Education.tsx         # Módulo educativo
│   ├── ExchangeRateCard.tsx  # Tarjeta de tasa USD/VES
│   ├── Simulator.tsx         # Calculadora de conversión
│   ├── Security.tsx          # Sección de seguridad
│   └── icons.tsx             # Iconos SVG
├── contexts/
│   └── ThemeContext.tsx      # Tema claro/oscuro
├── netlify/
│   └── functions/
│       └── binance-rate.ts   # ⭐ Función serverless Binance P2P
├── services/
│   ├── geminiService.ts      # Integración con Gemini AI
│   └── binanceService.ts     # Cliente para la API de Binance
├── App.tsx                   # Componente raíz
├── netlify.toml              # Configuración de Netlify
└── vite.config.ts            # Configuración de Vite
```

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

# Solo frontend (sin functions de Binance)
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

---

## 🔮 Roadmap

- [x] Tasa del dólar paralelo en tiempo real (Binance P2P)
- [ ] Tasa oficial BCV (web scraping)
- [ ] Autenticación de usuarios
- [ ] Historial de tasas con gráficos
- [ ] PWA (modo offline)

---

## 📄 Licencia

**© 2026 CriptoGuíaVE.** Todos los derechos reservados.

Este proyecto es de uso educativo e informativo.

---

*Desarrollado por Roger Montero 😊*
