import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres.npobomswhswnhnvpcgna:EY0ode7U8ff55m8k@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 15000
});

// Cache en memoria compartida para latencia ultrabaja
let memoryState: any = null;
let lastVersion = Date.now();
let tableInitialized = false;

async function ensureTable() {
  if (tableInitialized) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS comandas_pos_state (
          id VARCHAR(100) PRIMARY KEY,
          payload JSONB NOT NULL,
          version BIGINT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      tableInitialized = true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('[Comandas API] PostgreSQL table init warning (fallback en memoria):', err);
  }
}

export async function GET() {
  await ensureTable();

  // Si tenemos estado en memoria, devolverlo
  if (memoryState) {
    return NextResponse.json({
      success: true,
      version: lastVersion,
      state: memoryState
    });
  }

  // Si no está en memoria, consultar PostgreSQL
  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT payload, version FROM comandas_pos_state WHERE id = $1', ['mcm_pos_cloud_state']);
      if (res.rows.length > 0) {
        memoryState = res.rows[0].payload;
        lastVersion = Number(res.rows[0].version);
        return NextResponse.json({ success: true, version: lastVersion, state: memoryState });
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[Comandas API] Error leyendo DB:', err);
  }

  return NextResponse.json({ success: true, version: lastVersion, state: null });
}

export async function POST(req: Request) {
  await ensureTable();

  try {
    const body = await req.json();
    const action = body.action || 'SYNC';
    const clientState = body.state;

    memoryState = clientState;
    lastVersion = Date.now();

    // Guardar en Postgres de forma asíncrona
    try {
      const client = await pool.connect();
      try {
        await client.query(`
          INSERT INTO comandas_pos_state (id, payload, version, updated_at)
          VALUES ($1, $2, $3, NOW())
          ON CONFLICT (id) DO UPDATE SET
            payload = EXCLUDED.payload,
            version = EXCLUDED.version,
            updated_at = NOW();
        `, ['mcm_pos_cloud_state', JSON.stringify(memoryState), lastVersion]);
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn('[Comandas API] Guardado en DB falló, preservado en memoria:', dbErr);
    }

    return NextResponse.json({
      success: true,
      action,
      version: lastVersion
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
