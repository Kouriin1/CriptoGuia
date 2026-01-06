/**
 * Binance P2P Rate Function
 * 
 * Esta función obtiene la tasa USDT/VES desde Binance P2P.
 * Incluye CACHE para evitar demasiadas peticiones a Binance.
 */

// ============================================
// CACHE - Variables que guardan el resultado
// ============================================
let cachedData: CacheData | null = null;  // Aquí se guarda el último resultado
let cacheTimestamp: number = 0;           // Cuándo se guardó (en milisegundos)
const CACHE_DURATION = 30000;             // 30 segundos en milisegundos

interface CacheData {
    success: boolean;
    rate: number;
    firstPrice: number;
    prices: number[];
    percentChange: number;
    adsCount: number;
    timestamp: string;
    fromCache?: boolean;
}

interface BinanceAdv {
    adv: {
        advNo: string;
        price: string;
        surplusAmount: string;
        maxSingleTransAmount: string;
        minSingleTransAmount: string;
    };
    advertiser: {
        nickName: string;
        monthOrderCount: number;
        positiveRate: number;
    };
}

interface BinanceResponse {
    code: string;
    message: string | null;
    data: BinanceAdv[];
}

export default async function handler() {
    // ============================================
    // PASO 1: Verificar si hay datos en cache
    // ============================================
    const now = Date.now();  // Tiempo actual en milisegundos

    // Si hay cache Y no ha expirado (menos de 30 seg)
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
        // Devolver datos del cache (sin llamar a Binance)
        return new Response(
            JSON.stringify({
                ...cachedData,
                fromCache: true  // Indicador de que viene del cache
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=30',
                },
            }
        );
    }

    // ============================================
    // PASO 2: Si no hay cache, llamar a Binance
    // ============================================
    try {
        const response = await fetch(
            'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    asset: 'USDT',
                    fiat: 'VES',
                    tradeType: 'BUY',
                    page: 1,
                    rows: 10,
                    // Filtrar por bancos populares de Venezuela
                    payTypes: ['Banesco', 'Mercantil', 'Provincial', 'BankTransfer', 'Pago Movil', 'Bancamiga'],
                    countries: [],
                    publisherType: null,
                    proMerchantAds: false,
                    shieldMerchantAds: false,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status}`);
        }

        const data: BinanceResponse = await response.json();

        if (!data.data || data.data.length === 0) {
            throw new Error('No P2P ads found');
        }

        // Extraer precios de los anuncios
        const prices = data.data.map((item) => parseFloat(item.adv.price));

        // Calcular promedio
        const average = prices.reduce((a, b) => a + b, 0) / prices.length;

        // Calcular cambio porcentual
        const firstPrice = prices[0];
        const percentChange = ((average - firstPrice) / firstPrice) * 100;

        // ============================================
        // PASO 3: Guardar resultado en cache
        // ============================================
        const result: CacheData = {
            success: true,
            rate: Math.round(average * 100) / 100,
            firstPrice: firstPrice,
            prices: prices,
            percentChange: Math.round(percentChange * 100) / 100,
            adsCount: prices.length,
            timestamp: new Date().toISOString(),
            fromCache: false
        };

        cachedData = result;         // Guardar en cache
        cacheTimestamp = Date.now(); // Guardar hora actual

        // Devolver resultado
        return new Response(
            JSON.stringify(result),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=30',
                },
            }
        );
    } catch (error) {
        console.error('Error fetching Binance rate:', error);

        // Si hay error pero tenemos cache viejo, devolverlo
        if (cachedData) {
            return new Response(
                JSON.stringify({
                    ...cachedData,
                    fromCache: true,
                    cacheAge: Math.round((Date.now() - cacheTimestamp) / 1000)
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
