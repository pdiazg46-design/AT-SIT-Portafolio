import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres.npobomswhswnhnvpcgna:EY0ode7U8ff55m8k@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 15000
});

// Fast In-Memory Cache for Zero-Latency Desktop QR Pairing & LiveSync
const memoryCache = new Map<string, { payload: any; version: number; status: string; updatedAt: string }>();

let tableInitialized = false;
async function ensureTable() {
  if (tableInitialized) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS ventocard_public_cards (
          card_id VARCHAR(255) PRIMARY KEY,
          payload JSONB NOT NULL,
          version BIGINT NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      tableInitialized = true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('PostgreSQL table init warning (using in-memory fallback):', err);
  }
}

const DEFAULT_PATRICIO_CARD = {
  fn: 'Patricio',
  ln: 'Díaz',
  org: 'ATSIT',
  tit: 'Director Ejecutivo / Consultor TI / Fundador',
  mob: '+56 9 9335 1620',
  wau: '@PatoDiazg',
  wrk: '+56 9 9335 1620',
  emw: 'pdiaz@atsit.cl',
  web: 'https://atsit.cl',
  lin: 'https://www.linkedin.com/in/patriciod1/',
  ins: '@pdiazg37',
  tik: '@pato.diaz84',
  adr: 'Santiago, Chile',
  bio: 'Especialista en arquitectura de software de alta eficiencia, ciberseguridad e inteligencia artificial empresarial.'
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get('id') || 'atsit_patricio_diaz';

    // 1. Instant check from fast In-Memory Cache
    if (memoryCache.has(cardId)) {
      const cached = memoryCache.get(cardId)!;
      return NextResponse.json({
        success: true,
        cardId,
        version: cached.version,
        updatedAt: cached.updatedAt,
        status: cached.status,
        payload: cached.payload
      }, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

    // 2. Default Patricio Card Fallback
    if (cardId === 'atsit_patricio_diaz' || cardId === 'official') {
      return NextResponse.json({
        success: true,
        cardId,
        version: 1725060000000,
        updatedAt: new Date().toISOString(),
        status: 'active',
        payload: DEFAULT_PATRICIO_CARD
      }, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

    // 3. PostgreSQL Database Check
    try {
      await ensureTable();
      const client = await pool.connect();
      try {
        const res = await client.query(
          'SELECT card_id, payload, version, status, updated_at FROM ventocard_public_cards WHERE card_id = $1',
          [cardId]
        );

        if (res.rows.length > 0) {
          const row = res.rows[0];
          const data = {
            payload: row.payload,
            version: Number(row.version),
            status: row.status,
            updatedAt: row.updated_at
          };
          memoryCache.set(cardId, data);
          return NextResponse.json({
            success: true,
            cardId: row.card_id,
            version: Number(row.version),
            updatedAt: row.updated_at,
            status: row.status,
            payload: row.payload
          }, {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
          });
        }
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn('PostgreSQL query fallback warning:', dbErr);
    }

    return NextResponse.json({ success: false, error: 'Tarjeta no encontrada o inactiva' }, {
      status: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error en LiveSync' }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      const rawText = await req.text();
      body = rawText ? JSON.parse(rawText) : {};
    } catch (parseErr) {
      body = {};
    }

    const { cardId, payload, status = 'active' } = body;

    if (!cardId || (!payload && status !== 'revoked')) {
      return NextResponse.json({ success: false, error: 'Datos incompletos para sincronización' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const now = Date.now();
    const isoDate = new Date().toISOString();

    // 1. Instant save in fast In-Memory Cache (Guarantees 0ms pairing response)
    memoryCache.set(cardId, {
      payload: payload || {},
      version: now,
      status: status,
      updatedAt: isoDate
    });

    // 2. PostgreSQL DB save with clean error handling
    try {
      await ensureTable();
      const client = await pool.connect();
      try {
        await client.query(`
          INSERT INTO ventocard_public_cards (card_id, payload, version, status, updated_at)
          VALUES ($1, $2::jsonb, $3, $4, NOW())
          ON CONFLICT (card_id) DO UPDATE SET
            payload = EXCLUDED.payload,
            version = EXCLUDED.version,
            status = EXCLUDED.status,
            updated_at = NOW();
        `, [cardId, JSON.stringify(payload || {}), now, status]);
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn('PostgreSQL save warning (using memory cache):', dbErr);
    }

    return NextResponse.json({
      success: true,
      cardId,
      version: now,
      message: status === 'revoked' ? 'Tarjeta revocada' : 'Ficha actualizada exitosamente en LiveSync'
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error al procesar LiveSync' }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
