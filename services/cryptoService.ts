/**
 * Crypto Prices Service
 * 
 * Cliente frontend para obtener precios de criptomonedas
 * desde la Netlify Function crypto-prices.
 */

export interface CryptoPrice {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    image: string;
}

export interface CryptoPricesResponse {
    success: boolean;
    prices: CryptoPrice[];
    fromCache?: boolean;
    stale?: boolean;
    timestamp: string;
    error?: string;
}

/**
 * Obtiene los precios actuales de las principales criptomonedas
 */
export async function getCryptoPrices(): Promise<CryptoPricesResponse> {
    const response = await fetch('/.netlify/functions/crypto-prices');

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CryptoPricesResponse = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch crypto prices');
    }

    return data;
}

/**
 * Formatea un precio en USD
 */
export function formatPrice(price: number): string {
    if (price >= 1000) {
        return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (price >= 1) {
        return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(4)}`;
}

/**
 * Formatea el cambio porcentual de 24h
 */
export function formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
}
