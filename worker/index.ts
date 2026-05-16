/// <reference types="@cloudflare/workers-types" />
import * as cheerio from 'cheerio';

interface Env {
  ASSETS: Fetcher;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    status: 200,
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers as Record<string, string> | undefined) },
  });
}

// ====================================================================
//  BINANCE P2P  (USDT/VES)
// ====================================================================
interface BinanceCache {
  success: true;
  rate: number;
  firstPrice: number;
  prices: number[];
  percentChange: number;
  adsCount: number;
  timestamp: string;
}
let binanceCache: BinanceCache | null = null;
let binanceCacheAt = 0;
const BINANCE_TTL = 30_000;

async function handleBinance(): Promise<Response> {
  const now = Date.now();
  if (binanceCache && now - binanceCacheAt < BINANCE_TTL) {
    return json({ ...binanceCache, fromCache: true });
  }

  try {
    const res = await fetch(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          asset: 'USDT',
          fiat: 'VES',
          tradeType: 'BUY',
          page: 1,
          rows: 5,
          payTypes: [],
          countries: [],
          publisherType: 'merchant',
          proMerchantAds: false,
          shieldMerchantAds: false,
        }),
      },
    );

    if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
    const data = (await res.json()) as { data?: Array<{ adv: { price: string } }> };
    if (!data.data?.length) throw new Error('No P2P ads found');

    const prices = data.data.map((item) => parseFloat(item.adv.price));
    const average = prices.reduce((a, b) => a + b, 0) / prices.length;
    const firstPrice = prices[0];
    const percentChange = ((average - firstPrice) / firstPrice) * 100;

    binanceCache = {
      success: true,
      rate: Math.round(average * 100) / 100,
      firstPrice,
      prices,
      percentChange: Math.round(percentChange * 100) / 100,
      adsCount: prices.length,
      timestamp: new Date().toISOString(),
    };
    binanceCacheAt = now;

    return json({ ...binanceCache, fromCache: false });
  } catch (err) {
    if (binanceCache) {
      return json({
        ...binanceCache,
        fromCache: true,
        stale: true,
        cacheAge: Math.round((now - binanceCacheAt) / 1000),
      });
    }
    return json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// ====================================================================
//  BCV  (USD y EUR) - intenta scraping; fallback ve.dolarapi.com
// ====================================================================
interface BCVCache {
  success: true;
  moneda: 'USD' | 'EUR';
  valor: string;
  source: 'bcv' | 'dolarapi';
  timestamp: string;
}
const bcvCache: Record<'USD' | 'EUR', { data: BCVCache | null; at: number }> = {
  USD: { data: null, at: 0 },
  EUR: { data: null, at: 0 },
};
const BCV_TTL = 600_000; // 10 minutos

async function scrapeBCV(moneda: 'USD' | 'EUR'): Promise<string | null> {
  try {
    const res = await fetch('https://www.bcv.org.ve/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
      cf: { cacheTtl: 0 } as any,
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const selector = moneda === 'USD' ? '#dolar strong' : '#euro strong';
    const valor = $(selector).text().trim();
    if (!valor) return null;
    return valor.replace(',', '.');
  } catch {
    return null;
  }
}

async function fallbackDolarApi(moneda: 'USD' | 'EUR'): Promise<string | null> {
  // 1) Endpoint unificado: ve.dolarapi.com /v1/cotizaciones devuelve un array con USD y EUR oficiales.
  try {
    const res = await fetch('https://ve.dolarapi.com/v1/cotizaciones', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = (await res.json()) as Array<{ moneda: string; fuente?: string; promedio?: number }>;
      const match = data.find(
        (item) => item.moneda === moneda && (!item.fuente || item.fuente === 'oficial'),
      );
      if (match?.promedio && match.promedio > 0) {
        return match.promedio.toFixed(8);
      }
    }
  } catch {
    // sigue al fallback
  }

  // 2) Endpoint dedicado solo para USD (por si /cotizaciones cambia).
  if (moneda === 'USD') {
    try {
      const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = (await res.json()) as { promedio?: number };
        if (typeof data.promedio === 'number' && data.promedio > 0) {
          return data.promedio.toFixed(8);
        }
      }
    } catch {
      // sin fallback adicional
    }
  }

  return null;
}

async function handleBCV(moneda: 'USD' | 'EUR'): Promise<Response> {
  const slot = bcvCache[moneda];
  const now = Date.now();
  if (slot.data && now - slot.at < BCV_TTL) {
    return json({ ...slot.data, fromCache: true });
  }

  let valor = await scrapeBCV(moneda);
  let source: 'bcv' | 'dolarapi' = 'bcv';
  if (!valor) {
    valor = await fallbackDolarApi(moneda);
    source = 'dolarapi';
  }

  if (!valor) {
    if (slot.data) {
      return json({ ...slot.data, fromCache: true, stale: true });
    }
    return json(
      {
        success: false,
        error: `No se pudo obtener tasa ${moneda} (BCV ni fallback respondieron)`,
        timestamp: new Date().toISOString(),
      },
      { status: 502 },
    );
  }

  const result: BCVCache = {
    success: true,
    moneda,
    valor,
    source,
    timestamp: new Date().toISOString(),
  };
  slot.data = result;
  slot.at = now;
  return json({ ...result, fromCache: false });
}

// ====================================================================
//  CRYPTO PRICES  (CoinGecko)
// ====================================================================
interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  image: string;
}
interface CoinMeta {
  id: string;
  name: string;
  symbol: string;
  image: string;
  binanceSymbol: string | null; // null = stablecoin, precio fijo en 1 USD
}
const COINS: CoinMeta[] = [
  { id: 'bitcoin',     name: 'Bitcoin',  symbol: 'BTC',  image: '₿', binanceSymbol: 'BTCUSDT' },
  { id: 'ethereum',    name: 'Ethereum', symbol: 'ETH',  image: 'Ξ', binanceSymbol: 'ETHUSDT' },
  { id: 'tether',      name: 'Tether',   symbol: 'USDT', image: '₮', binanceSymbol: null },
  { id: 'solana',      name: 'Solana',   symbol: 'SOL',  image: '◎', binanceSymbol: 'SOLUSDT' },
  { id: 'binancecoin', name: 'BNB',      symbol: 'BNB',  image: '🔶', binanceSymbol: 'BNBUSDT' },
];

let cryptoCache: { data: CryptoPrice[]; at: number } | null = null;
const CRYPTO_TTL = 60_000;

async function fetchFromBinance(): Promise<CryptoPrice[] | null> {
  try {
    const symbols = COINS.map((c) => c.binanceSymbol).filter(Boolean) as string[];
    const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ symbol: string; lastPrice: string; priceChangePercent: string }>;
    const bySymbol = new Map(data.map((d) => [d.symbol, d]));

    return COINS.map((c) => {
      if (c.binanceSymbol === null) {
        return { id: c.id, name: c.name, symbol: c.symbol, image: c.image, price: 1, change24h: 0 };
      }
      const t = bySymbol.get(c.binanceSymbol);
      return {
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        image: c.image,
        price: t ? parseFloat(t.lastPrice) : 0,
        change24h: t ? parseFloat(t.priceChangePercent) : 0,
      };
    });
  } catch {
    return null;
  }
}

async function fetchFromCoinGecko(): Promise<CryptoPrice[] | null> {
  try {
    const ids = COINS.map((c) => c.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, { usd?: number; usd_24h_change?: number }>;
    return COINS.map((c) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      image: c.image,
      price: data[c.id]?.usd ?? 0,
      change24h: data[c.id]?.usd_24h_change ?? 0,
    }));
  } catch {
    return null;
  }
}

async function handleCrypto(): Promise<Response> {
  const now = Date.now();
  if (cryptoCache && now - cryptoCache.at < CRYPTO_TTL) {
    return json({
      success: true,
      prices: cryptoCache.data,
      fromCache: true,
      timestamp: new Date(cryptoCache.at).toISOString(),
    });
  }

  const prices = (await fetchFromBinance()) ?? (await fetchFromCoinGecko());

  if (!prices) {
    if (cryptoCache) {
      return json({
        success: true,
        prices: cryptoCache.data,
        fromCache: true,
        stale: true,
        timestamp: new Date(cryptoCache.at).toISOString(),
      });
    }
    return json(
      {
        success: false,
        error: 'No se pudo obtener precios (Binance ni CoinGecko respondieron)',
        timestamp: new Date().toISOString(),
      },
      { status: 502 },
    );
  }

  cryptoCache = { data: prices, at: now };
  return json({
    success: true,
    prices,
    fromCache: false,
    timestamp: new Date().toISOString(),
  });
}

// ====================================================================
//  ROUTER
// ====================================================================
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    if (pathname === '/api/binance-rate') return handleBinance();
    if (pathname === '/api/dolar-rate') return handleBCV('USD');
    if (pathname === '/api/euro-rate') return handleBCV('EUR');
    if (pathname === '/api/crypto-prices') return handleCrypto();

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
