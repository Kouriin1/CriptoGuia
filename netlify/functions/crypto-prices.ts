/**
 * Crypto Prices Function
 * 
 * Obtiene precios de criptomonedas desde CoinGecko API.
 * Incluye cache de 60 segundos para evitar rate limiting.
 */

// ============================================
// CACHE
// ============================================
interface CachedPrices {
    data: CryptoPrice[];
    timestamp: number;
}

let cachedPrices: CachedPrices | null = null;
const CACHE_DURATION = 60000; // 60 segundos

// ============================================
// TIPOS
// ============================================
interface CryptoPrice {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    image: string;
}

interface CoinGeckoResponse {
    [key: string]: {
        usd: number;
        usd_24h_change: number;
    };
}

// Monedas que queremos obtener
const COINS = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', image: '₿' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', image: 'Ξ' },
    { id: 'tether', name: 'Tether', symbol: 'USDT', image: '₮' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', image: '◎' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB', image: '🔶' },
];

export default async function handler() {
    const now = Date.now();

    // ============================================
    // VERIFICAR CACHE
    // ============================================
    if (cachedPrices && (now - cachedPrices.timestamp) < CACHE_DURATION) {
        return new Response(
            JSON.stringify({
                success: true,
                prices: cachedPrices.data,
                fromCache: true,
                timestamp: new Date(cachedPrices.timestamp).toISOString()
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=60',
                },
            }
        );
    }

    // ============================================
    // LLAMAR A COINGECKO
    // ============================================
    try {
        const coinIds = COINS.map(c => c.id).join(',');
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data: CoinGeckoResponse = await response.json();

        // Transformar respuesta
        const prices: CryptoPrice[] = COINS.map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
            price: data[coin.id]?.usd || 0,
            change24h: data[coin.id]?.usd_24h_change || 0,
        }));

        // ============================================
        // GUARDAR EN CACHE
        // ============================================
        cachedPrices = {
            data: prices,
            timestamp: now
        };

        return new Response(
            JSON.stringify({
                success: true,
                prices,
                fromCache: false,
                timestamp: new Date().toISOString()
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=60',
                },
            }
        );
    } catch (error) {
        console.error('Error fetching crypto prices:', error);

        // Si hay error pero tenemos cache viejo, devolverlo
        if (cachedPrices) {
            return new Response(
                JSON.stringify({
                    success: true,
                    prices: cachedPrices.data,
                    fromCache: true,
                    stale: true,
                    timestamp: new Date(cachedPrices.timestamp).toISOString()
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
