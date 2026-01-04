/**
 * Binance P2P Service
 * Fetches USDT/VES exchange rate from Binance P2P via Netlify Function
 */

export interface BinanceRateResponse {
    success: boolean;
    rate: number;
    firstPrice: number;
    prices: number[];
    percentChange: number;
    adsCount: number;
    timestamp: string;
    error?: string;
}

/**
 * Fetches the current USDT/VES rate from Binance P2P
 * @returns Promise with the rate data
 */
export async function getBinanceRate(): Promise<BinanceRateResponse> {
    const response = await fetch('/.netlify/functions/binance-rate');

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data: BinanceRateResponse = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Error fetching rate');
    }

    return data;
}
