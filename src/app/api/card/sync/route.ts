import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres.npobomswhswnhnvpcgna:EY0ode7U8ff55m8k@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000
});

// Ensure table exists
let tableInitialized = false;
async function ensureTable() {
  if (tableInitialized) return;
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
  } catch (err) {
    console.error('Error ensuring ventocard_public_cards table:', err);
  } finally {
    client.release();
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
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get('id') || 'atsit_patricio_diaz';

    const client = await pool.connect();
    try {
      const res = await client.query(
        'SELECT card_id, payload, version, status, updated_at FROM ventocard_public_cards WHERE card_id = $1',
        [cardId]
      );

      if (res.rows.length === 0) {
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

        return NextResponse.json({ success: false, error: 'Tarjeta no encontrada o inactiva' }, {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        });
      }

      const row = res.rows[0];
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
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error en LiveSync' }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const body = await req.json();
    const { cardId, payload, status = 'active' } = body;

    if (!cardId || (!payload && status !== 'revoked')) {
      return NextResponse.json({ success: false, error: 'Datos incompletos para sincronización' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const now = Date.now();
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO ventocard_public_cards (card_id, payload, version, status, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (card_id) DO UPDATE SET
          payload = EXCLUDED.payload,
          version = EXCLUDED.version,
          status = EXCLUDED.status,
          updated_at = NOW();
      `, [cardId, payload || {}, now, status]);

      return NextResponse.json({
        success: true,
        cardId,
        version: now,
        message: status === 'revoked' ? 'Tarjeta revocada soberanamente' : 'Ficha actualizada exitosamente en LiveSync'
      }, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error al procesar LiveSync' }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
