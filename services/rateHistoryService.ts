/**
 * Rate History Service
 * 
 * Maneja el historial de tasas usando localStorage.
 * Permite calcular tendencias y cambios porcentuales.
 */

// ============================================
// TIPOS
// ============================================
export interface RateEntry {
    rate: number;
    timestamp: string;  // ISO string
}

export interface RateHistory {
    entries: RateEntry[];
}

export type TrendType = 'ALCISTA' | 'BAJISTA' | 'ESTABLE';

export interface TrendAnalysis {
    trend: TrendType;
    consecutiveDays: number;  // Cuántos días seguidos en esta tendencia
    todayChange: number;      // Cambio en Bs
    todayChangePercent: number; // Cambio en %
    yesterdayRate: number | null;
    advice: string;
}

// ============================================
// CONSTANTES
// ============================================
const STORAGE_KEY = 'criptoguia_rate_history';
const MAX_ENTRIES = 30;  // Guardar máximo 30 días

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Guarda una nueva tasa en el historial
 * Solo guarda una tasa por día (la más reciente)
 */
export function saveRate(rate: number): void {
    const history = getHistory();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Verificar si ya hay una entrada para hoy
    const todayIndex = history.entries.findIndex(entry =>
        entry.timestamp.split('T')[0] === today
    );

    const newEntry: RateEntry = {
        rate,
        timestamp: new Date().toISOString()
    };

    if (todayIndex >= 0) {
        // Actualizar la entrada de hoy
        history.entries[todayIndex] = newEntry;
    } else {
        // Agregar nueva entrada al inicio
        history.entries.unshift(newEntry);
    }

    // Mantener solo los últimos MAX_ENTRIES
    if (history.entries.length > MAX_ENTRIES) {
        history.entries = history.entries.slice(0, MAX_ENTRIES);
    }

    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Obtiene el historial completo
 */
export function getHistory(): RateHistory {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error reading rate history:', error);
    }
    return { entries: [] };
}

/**
 * Obtiene las últimas N entradas
 */
export function getRecentEntries(count: number): RateEntry[] {
    const history = getHistory();
    return history.entries.slice(0, count);
}

/**
 * Calcula el análisis de tendencia
 */
export function analyzeTrend(currentRate: number): TrendAnalysis {
    const history = getHistory();
    const entries = history.entries;

    // Si no hay historial, guardar la tasa actual y retornar análisis básico
    if (entries.length === 0) {
        saveRate(currentRate);
        return {
            trend: 'ESTABLE',
            consecutiveDays: 0,
            todayChange: 0,
            todayChangePercent: 0,
            yesterdayRate: null,
            advice: 'Primera medición del día. Vuelve mañana para ver la tendencia.'
        };
    }

    // Guardar tasa actual
    saveRate(currentRate);

    // Obtener tasa de ayer (segunda entrada después de guardar la de hoy)
    const updatedHistory = getHistory();
    const yesterdayEntry = updatedHistory.entries[1]; // Índice 1 porque 0 es hoy

    if (!yesterdayEntry) {
        return {
            trend: 'ESTABLE',
            consecutiveDays: 1,
            todayChange: 0,
            todayChangePercent: 0,
            yesterdayRate: null,
            advice: 'Acumulando datos. Vuelve mañana para ver la tendencia.'
        };
    }

    const yesterdayRate = yesterdayEntry.rate;
    const todayChange = currentRate - yesterdayRate;
    const todayChangePercent = (todayChange / yesterdayRate) * 100;

    // Calcular tendencia basada en cambio porcentual
    const recentEntries = updatedHistory.entries.slice(0, 5);
    let trend: TrendType = 'ESTABLE';
    let consecutiveDays = 0;

    // PRIMERO: Si el cambio de hoy es significativo (>2%), eso define la tendencia inmediatamente
    const SIGNIFICANT_CHANGE_THRESHOLD = 2; // 2% es un cambio significativo en un día

    if (todayChangePercent >= SIGNIFICANT_CHANGE_THRESHOLD) {
        trend = 'ALCISTA';
        consecutiveDays = 1;
    } else if (todayChangePercent <= -SIGNIFICANT_CHANGE_THRESHOLD) {
        trend = 'BAJISTA';
        consecutiveDays = 1;
    } else if (recentEntries.length >= 2) {
        // SEGUNDO: Si el cambio de hoy es pequeño, revisar tendencia de varios días
        let upDays = 0;
        let downDays = 0;

        for (let i = 0; i < recentEntries.length - 1; i++) {
            const prevRate = recentEntries[i + 1].rate;
            const currRate = recentEntries[i].rate;
            const percentDiff = ((currRate - prevRate) / prevRate) * 100;

            // Usar umbral relativo de 0.5% en lugar de 0.5 Bs
            if (percentDiff > 0.5) upDays++;
            else if (percentDiff < -0.5) downDays++;
        }

        if (upDays >= 2 && upDays > downDays) {
            trend = 'ALCISTA';
            consecutiveDays = upDays;
        } else if (downDays >= 2 && downDays > upDays) {
            trend = 'BAJISTA';
            consecutiveDays = downDays;
        } else {
            trend = 'ESTABLE';
            consecutiveDays = 0;
        }

        // CORRECCIÓN VISUAL: Si la tendencia calculada contradice el movimiento actual,
        // forzar a ESTABLE. Esto evita confusión (ej: ver números verdes pero texto "BAJISTA").
        // Especialmente útil cuando el mercado se está estabilizando tras volatilidad.
        if (trend === 'BAJISTA' && todayChangePercent > 0.05) {
            trend = 'ESTABLE';
            consecutiveDays = 0;
        }
        if (trend === 'ALCISTA' && todayChangePercent < -0.05) {
            trend = 'ESTABLE';
            consecutiveDays = 0;
        }
    }

    // Generar consejo basado en la tendencia
    const advice = generateAdvice(trend, todayChangePercent);

    return {
        trend,
        consecutiveDays,
        todayChange: Math.round(todayChange * 100) / 100,
        todayChangePercent: Math.round(todayChangePercent * 100) / 100,
        yesterdayRate,
        advice
    };
}

/**
 * Genera consejo contextual basado en la tendencia
 * Contexto: En Venezuela el dólar casi siempre sube (inflación).
 * 
 * ALCISTA = El dólar sube = Los Bs valen menos = URGENTE proteger ahorros
 * BAJISTA = El dólar baja = Raro pero puede pasar = Oportunidad para esperar
 * ESTABLE = Sin cambios grandes = Momento tranquilo para planificar
 */
function generateAdvice(trend: TrendType, changePercent: number): string {
    const absChange = Math.abs(changePercent);

    if (trend === 'ALCISTA') {
        if (absChange > 3) {
            return `🚨 ¡Atención! El dólar subió ${absChange.toFixed(1)}% - Tus bolívares están perdiendo valor rápidamente. Si tienes ahorros en Bs, considera convertirlos a USDT para protegerlos.`;
        }
        return `📈 El dólar sigue subiendo. Esto significa que tus bolívares valen cada día un poco menos. Si planeas comprar USDT para proteger tu dinero, mejor hazlo pronto.`;
    }

    if (trend === 'BAJISTA') {
        if (absChange > 3) {
            return `📉 ¡Poco común! El dólar bajó ${absChange.toFixed(1)}%. Esto no suele durar mucho en Venezuela. Si ya tienes USDT y necesitas Bs, podrías aprovechar la tasa.`;
        }
        return `📉 El dólar bajó un poco (raro en Venezuela). Si no es urgente comprar USDT, puedes esperar a ver si baja más.`;
    }

    // ESTABLE
    return `➡️ El dólar se mantiene estable estos días. Buen momento para planificar tus movimientos con calma, sin presiones.`;
}

/**
 * FUNCIÓN DE DEMO - Para testing
 * Simula un historial de 5 días con tendencia
 * 
 * USO: Abre la consola del navegador (F12) y ejecuta:
 *   - loadDemoData('up')    → Simula tendencia ALCISTA
 *   - loadDemoData('down')  → Simula tendencia BAJISTA
 *   - loadDemoData('stable')→ Simula mercado ESTABLE
 *   - clearHistory()        → Limpia todos los datos
 */
export function loadDemoData(trend: 'up' | 'down' | 'stable' = 'up'): void {
    const today = new Date();

    let rates: number[];

    if (trend === 'up') {
        // Tendencia alcista: cada día sube
        rates = [597.98, 593.50, 589.20, 585.00, 582.30];
    } else if (trend === 'down') {
        // Tendencia bajista: cada día baja
        rates = [580.50, 585.20, 589.80, 593.00, 597.00];
    } else {
        // Estable: pequeñas variaciones
        rates = [590.20, 590.50, 589.80, 590.10, 590.00];
    }

    const entries: RateEntry[] = rates.map((rate, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - index);
        return {
            rate,
            timestamp: date.toISOString()
        };
    });

    const history: RateHistory = { entries };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    console.log(`✅ Demo data loaded (${trend} trend):`, entries);
    console.log('🔄 Recarga la página para ver los cambios');
}

/**
 * Limpia el historial (para testing)
 */
export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ History cleared. Recarga la página.');
}

// Exponer funciones en window para testing desde consola
if (typeof window !== 'undefined') {
    (window as any).loadDemoData = loadDemoData;
    (window as any).clearHistory = clearHistory;
    (window as any).getHistory = getHistory;
}
