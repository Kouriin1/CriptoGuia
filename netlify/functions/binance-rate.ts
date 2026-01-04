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
    try {
        const response = await fetch(
            'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    asset: 'USDT',
                    fiat: 'VES',
                    tradeType: 'SELL',
                    page: 1,
                    rows: 5,
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

        // Calcular cambio porcentual (comparando primer precio con promedio)
        const firstPrice = prices[0];
        const percentChange = ((average - firstPrice) / firstPrice) * 100;

        return new Response(
            JSON.stringify({
                success: true,
                rate: Math.round(average * 100) / 100, // Redondear a 2 decimales
                firstPrice: firstPrice,
                prices: prices,
                percentChange: Math.round(percentChange * 100) / 100,
                adsCount: prices.length,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=30', // Cache por 30 segundos
                },
            }
        );
    } catch (error) {
        console.error('Error fetching Binance rate:', error);

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
