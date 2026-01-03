# 🇻🇪 CriptoGuíaVE

**Tu brújula en el ecosistema cripto de Venezuela.**

![CriptoGuíaVE Banner](https://via.placeholder.com/1200x400?text=CriptoGuiaVE+Banner)

## 📖 Descripción del Proyecto

**CriptoGuíaVE** es una plataforma web diseñada específicamente para el usuario venezolano, con el objetivo de educar, facilitar y asegurar la adopción de criptomonedas en el país. En un entorno económico donde las criptomonedas juegan un papel fundamental para el ahorro, las remesas y el comercio diario, esta herramienta busca cerrar la brecha de conocimiento y proporcionar utilidades prácticas.

La aplicación combina recursos educativos profundos con herramientas de simulación y datos de mercado, todo presentado en una interfaz moderna, intuitiva y adaptada tanto a modo claro como oscuro.

## 🚀 Características Principales

### 1. 🏠 Panel Principal (Dashboard)
Una vista general del mercado con información relevante al instante:
- **Tasas de Cambio:** Visualización del precio del dólar (BCV y Paralelo) y criptomonedas clave.
- **Perspectivas de Mercado:** Análisis de tendencias actuales.
- **Distribución de Activos:** Gráficos visuales para entender la diversificación.
- **Chat IA:** Un asistente inteligente integrado para responder dudas rápidas sobre cripto.

### 2. 📚 Centro Educativo (Core del Proyecto)
El corazón de la aplicación, diseñado para llevar al usuario de principiante a experto:
- **Glosario Interactivo:** Términos complejos explicados de forma sencilla, con ejemplos reales del contexto venezolano (ej. Binance P2P, Zinli) e ilustraciones visuales.
- **Guías Paso a Paso:** Tutoriales detallados para operaciones esenciales (instalar wallets, comprar USDT, etc.), acompañados de enlaces directos a videos de YouTube verificados.
- **Casos de Uso:** Ejemplos prácticos de cómo las criptomonedas resuelven problemas diarios en Venezuela (remesas, protección contra inflación).

### 3. 🔢 Simulador de Conversión
Herramienta calculadora que permite a los usuarios estimar conversiones entre Bolívares (VES) y Criptomonedas (USDT, BTC, ETH) en tiempo real, facilitando la toma de decisiones financieras.

### 4. 🛡️ Centro de Seguridad
Sección dedicada a la prevención de estafas y buenas prácticas:
- Lista de las estafas más comunes en el país (Phishing, Ponzis, etc.).
- Checklist de seguridad para proteger tus activos.

## 🛠️ Tecnologías Utilizadas

Este proyecto ha sido construido utilizando un stack moderno y eficiente:
- **Frontend:** [React](https://reactjs.org/) con [TypeScript](https://www.typescriptlang.org/) para una experiencia de usuario robusta y segura.
- **Build Tool:** [Vite](https://vitejs.dev/) para un desarrollo rápido y optimizado.
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño responsivo y personalizable.
- **Iconos:** SVG personalizados y optimizados.

## 📂 Estructura del Proyecto

```
CriptoGuiaVE/
├── components/             # Componentes de React reutilizables
│   ├── AIChat.tsx          # Asistente virtual inteligente
│   ├── Education.tsx       # Módulo educativo principal
│   ├── Simulator.tsx       # Calculadora de conversión
│   ├── Security.tsx        # Sección de seguridad y estafas
│   ├── GlobalMarket.tsx    # Datos de mercado global
│   └── ...
├── contexts/
│   └── ThemeContext.tsx    # Manejo del tema (Claro/Oscuro)
├── img/                    # Recursos gráficos e imágenes
├── services/
│   └── geminiService.ts    # Integración con IA (Gemini)
├── App.tsx                 # Componente raíz y enrutamiento
├── index.css               # Estilos globales y Tailwind
├── types.ts                # Definiciones de tipos TypeScript
└── vite.config.ts          # Configuración de Vite
```

## 🏁 Cómo Iniciar

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/CriptoGuiaVE.git
    cd CriptoGuiaVE
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 🔮 Hoja de Ruta (Roadmap) y Mejoras Futuras

Para llevar CriptoGuíaVE al siguiente nivel, se proponen las siguientes implementaciones:

- [ ] **API en Tiempo Real:** Conectar con APIs de exchanges (Binance, CoinGecko) y monitores de dólar para mostrar tasas en vivo automáticas.
- [ ] **Autenticación de Usuario:** Permitir a los usuarios registrarse para guardar su progreso educativo y portafolio simulado.
- [ ] **Calculadora P2P Avanzada:** Una herramienta que calcule comisiones específicas de diferentes métodos de pago en Venezuela.
- [ ] **Directorio de Comercios:** Un mapa o lista de negocios en Venezuela que aceptan criptomonedas.
- [ ] **Modo Offline:** Hacer la aplicación una PWA (Progressive Web App) para consultar guías sin internet.

## 📄 Derechos de Autor y Licencia

**© 2026 CriptoGuíaVE.** Todos los derechos reservados.

Este proyecto es de uso educativo e informativo. El contenido y el código fuente son propiedad intelectual de sus creadores. Queda prohibida la reproducción total o parcial con fines comerciales sin autorización previa.

---
*Desarrollado por Roger Montero 😊*
