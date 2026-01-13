import axios from 'axios';
import * as cheerio from 'cheerio';

// ============================================
// CACHE - Variables persistentes
// ============================================
let cachedData: BCVData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 600000; // 10 minutos

interface BCVData {
    success: boolean;
    moneda: string;
    valor: string;
    timestamp: string;
    fromCache?: boolean;
}

export default async function handler() {
    const now = Date.now();

    // 1. Verificación de Cache
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
        return new Response(
            JSON.stringify({ ...cachedData, fromCache: true }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    try {
        // 2. Petición HTTP directa (Simulando navegador)
        const response = await axios.get('https://www.bcv.org.ve/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
            timeout: 10000 // 10 segundos máximo
        });

        // 3. Parsing con Cheerio (el BeautifulSoup de JS)
        const $ = cheerio.load(response.data);
        
        // Buscamos el div con id "euro" y luego el strong
        const valorTexto = $('#euro strong').text().trim();

        if (!valorTexto) {
            throw new Error('No se pudo encontrar el selector del Euro en el HTML del BCV');
        }

        const result: BCVData = {
            success: true,
            moneda: 'EUR',
            valor: valorTexto.replace(',', '.'),
            timestamp: new Date().toISOString(),
            fromCache: false
        };

        // 4. Actualizar Cache
        cachedData = result;
        cacheTimestamp = now;

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Error obteniendo tasa BCV:', error.message);
        
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'Error desconocido',
                timestamp: new Date().toISOString(),
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}