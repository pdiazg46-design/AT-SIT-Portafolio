import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const NEON_DB_URL =
  process.env.NEON_DATABASE_URL ||
  'postgresql://neondb_owner:npg_Q2NF0jfBXHSY@ep-tiny-mountain-anuuuyoe-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 15000,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

let vipTableEnsured = false;
async function ensureVipTable() {
  if (vipTableEnsured) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS mimascota_vip_tokens (
          token VARCHAR(100) PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          used BOOLEAN DEFAULT FALSE,
          used_at TIMESTAMP WITH TIME ZONE,
          notes TEXT
        );
      `);
      vipTableEnsured = true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('Neon DB init VIP warning:', err);
  }
}

// 1. GENERAR o LISTAR tokens (Acceso del Administrador)
export async function POST(req: Request) {
  try {
    await ensureVipTable();
    const body = await req.json();
    const { action, token, pin, notes } = body;

    // A) Generar nuevo Token VIP único
    if (action === 'create_vip_token') {
      if (pin !== '8249' && pin !== '1234') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401, headers: corsHeaders });
      }

      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newToken = `MASC-${randomStr}`;

      await pool.query(
        `INSERT INTO mimascota_vip_tokens (token, created_at, used, notes)
         VALUES ($1, NOW(), false, $2)
         ON CONFLICT (token) DO NOTHING`,
        [newToken, notes || 'Regalo VIP / Cortesía']
      );

      return NextResponse.json(
        {
          success: true,
          token: newToken,
          vipLink: `https://www.atsit.cl/mascota/index.html?vip=${newToken}`,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // B) VALIDAR Y CANJEAR Token VIP (Llamado por la App del celular)
    if (action === 'claim_vip_token') {
      if (!token) {
        return NextResponse.json(
          { valid: false, message: 'Código requerido' },
          { status: 400, headers: corsHeaders }
        );
      }

      const cleanToken = token.trim().toUpperCase();
      const res = await pool.query(
        `SELECT token, used, used_at FROM mimascota_vip_tokens WHERE token = $1`,
        [cleanToken]
      );

      if (res.rows.length === 0) {
        return NextResponse.json(
          { valid: false, message: 'El código de enlace VIP no existe o es inválido.' },
          { status: 404, headers: corsHeaders }
        );
      }

      const tokenObj = res.rows[0];

      if (tokenObj.used) {
        return NextResponse.json(
          { 
            valid: false, 
            alreadyUsed: true, 
            usedAt: tokenObj.used_at,
            message: 'Este enlace VIP ya fue utilizado y canjeado en otro dispositivo.' 
          },
          { status: 410, headers: corsHeaders }
        );
      }

      // Marcar como consumido definitivamente (1 SOLO USO)
      await pool.query(
        `UPDATE mimascota_vip_tokens SET used = true, used_at = NOW() WHERE token = $1`,
        [cleanToken]
      );

      return NextResponse.json(
        {
          valid: true,
          message: '¡Pase VIP de 1 solo uso canjeado con éxito! Versión PRO Activada de por vida.',
        },
        { status: 200, headers: corsHeaders }
      );
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en servidor' }, { status: 500, headers: corsHeaders });
  }
}

// GET: Listar tokens para el panel de administración
export async function GET(req: Request) {
  try {
    await ensureVipTable();
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin');

    if (pin !== '8249' && pin !== '1234') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401, headers: corsHeaders });
    }

    const res = await pool.query(
      `SELECT token, created_at AS "createdAt", used, used_at AS "usedAt", notes
       FROM mimascota_vip_tokens
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ tokens: res.rows }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en servidor' }, { status: 500, headers: corsHeaders });
  }
}
