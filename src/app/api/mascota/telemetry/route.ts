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

// Cabeceras CORS universales
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export interface TelemetryEvent {
  action: 'app_opened' | 'pet_created' | 'pro_activated' | string;
  platform: 'ios' | 'android' | 'web' | string;
  isPro: boolean;
  partnerCode: string;
  partnerType: 'clinic' | 'pharmacy' | 'food_store' | 'organic';
  partnerName: string;
  timestamp: string;
}

export interface PartnerSummary {
  code: string;
  name: string;
  type: 'clinic' | 'pharmacy' | 'food_store' | 'organic';
  appOpens: number;
  petsCreated: number;
  proActivations: number;
  revenue: number;
  lastActivity: string;
}

let tableEnsured = false;
async function ensureTables() {
  if (tableEnsured) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS mimascota_telemetry_events (
          id SERIAL PRIMARY KEY,
          action VARCHAR(50) NOT NULL,
          partner_code VARCHAR(100) NOT NULL,
          partner_type VARCHAR(50) NOT NULL,
          partner_name VARCHAR(150) NOT NULL,
          platform VARCHAR(50) NOT NULL,
          is_pro BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_mimascota_partner ON mimascota_telemetry_events(partner_code);
      `);
      tableEnsured = true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('Neon DB init warning (usando fallback):', err);
  }
}

export async function POST(req: Request) {
  try {
    await ensureTables();
    const body = await req.json();
    const {
      action,
      platform,
      isPro,
      partnerCode,
      partnerType,
      partnerName,
      timestamp,
    } = body;

    const eventAction = action || 'app_opened';
    const eventPlatform = platform || 'web';
    const eventIsPro = !!isPro;
    const nowIso = timestamp || new Date().toISOString();

    // Resolver atribución
    const code = (partnerCode || 'organico').toLowerCase().trim();
    const type: 'clinic' | 'pharmacy' | 'food_store' | 'organic' =
      partnerType === 'clinic' || partnerType === 'pharmacy' || partnerType === 'food_store'
        ? partnerType
        : code.startsWith('tienda') || code.startsWith('alimento') || code.startsWith('petshop')
        ? 'food_store'
        : code.startsWith('farma')
        ? 'pharmacy'
        : code.startsWith('vet') || code === 'demo'
        ? 'clinic'
        : 'organic';
    
    const name =
      partnerName ||
      (code === 'demo'
        ? 'Clínica Veterinaria Demo (ATSIT)'
        : code === 'farma_demo' || code === 'farmacia'
        ? 'Farmacia Veterinaria Demo (ATSIT)'
        : code === 'tienda_demo' || code === 'tienda' || code === 'alimento'
        ? 'Tienda de Alimentos Demo (ATSIT)'
        : type === 'food_store'
        ? `Tienda de Alimentos ${code}`
        : type === 'clinic'
        ? `Clínica ${code}`
        : type === 'pharmacy'
        ? `Farmacia ${code}`
        : 'Redes Sociales / Libre');

    // Persistir de forma inmutable en PostgreSQL (Neon)
    try {
      await pool.query(
        `INSERT INTO mimascota_telemetry_events (action, partner_code, partner_type, partner_name, platform, is_pro, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [eventAction, code, type, name, eventPlatform, eventIsPro, nowIso]
      );
    } catch (dbErr) {
      console.warn('Error al escribir evento en PostgreSQL:', dbErr);
    }

    const registered: TelemetryEvent = {
      action: eventAction,
      platform: eventPlatform,
      isPro: eventIsPro,
      partnerCode: code,
      partnerType: type,
      partnerName: name,
      timestamp: nowIso,
    };

    return NextResponse.json({ success: true, registered }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en telemetria' }, { status: 500, headers: corsHeaders });
  }
}

export async function GET() {
  try {
    await ensureTables();

    // 1. Estadísticas Globales
    const globalRes = await pool.query(`
      SELECT 
        COALESCE(COUNT(*) FILTER (WHERE action = 'app_opened'), 0)::int AS total_app_opens,
        COALESCE(COUNT(*) FILTER (WHERE action = 'pet_created'), 0)::int AS total_pets_created,
        COALESCE(COUNT(*) FILTER (WHERE action = 'pro_activated'), 0)::int AS total_pro_activations,
        COALESCE(COUNT(*) FILTER (WHERE platform = 'ios'), 0)::int AS ios_users,
        COALESCE(COUNT(*) FILTER (WHERE platform != 'ios'), 0)::int AS other_users
      FROM mimascota_telemetry_events;
    `);

    const gRow = globalRes.rows[0] || {
      total_app_opens: 0,
      total_pets_created: 0,
      total_pro_activations: 0,
      ios_users: 0,
      other_users: 0,
    };

    // 2. Desglose por Partner
    const partnerRes = await pool.query(`
      SELECT 
        partner_code AS code,
        partner_name AS name,
        partner_type AS type,
        COALESCE(COUNT(*) FILTER (WHERE action = 'app_opened'), 0)::int AS app_opens,
        COALESCE(COUNT(*) FILTER (WHERE action = 'pet_created'), 0)::int AS pets_created,
        COALESCE(COUNT(*) FILTER (WHERE action = 'pro_activated'), 0)::int AS pro_activations,
        COALESCE(MAX(created_at), NOW()) AS last_activity
      FROM mimascota_telemetry_events
      GROUP BY partner_code, partner_name, partner_type
      ORDER BY (COUNT(*) FILTER (WHERE action = 'app_opened') + COUNT(*) FILTER (WHERE action = 'pet_created') + COUNT(*) FILTER (WHERE action = 'pro_activated')) DESC;
    `);

    const partnersMap: Record<string, PartnerSummary> = {
      demo: {
        code: 'demo',
        name: 'Clínica Veterinaria Demo (ATSIT)',
        type: 'clinic',
        appOpens: 0,
        petsCreated: 0,
        proActivations: 0,
        revenue: 0,
        lastActivity: '-',
      },
      farma_demo: {
        code: 'farma_demo',
        name: 'Farmacia Veterinaria Demo (ATSIT)',
        type: 'pharmacy',
        appOpens: 0,
        petsCreated: 0,
        proActivations: 0,
        revenue: 0,
        lastActivity: '-',
      },
      tienda_demo: {
        code: 'tienda_demo',
        name: 'Tienda de Alimentos Demo (ATSIT)',
        type: 'food_store',
        appOpens: 0,
        petsCreated: 0,
        proActivations: 0,
        revenue: 0,
        lastActivity: '-',
      },
      organico: {
        code: 'organico',
        name: 'Redes Sociales & Contactos Libres (Sin Convenio)',
        type: 'organic',
        appOpens: 0,
        petsCreated: 0,
        proActivations: 0,
        revenue: 0,
        lastActivity: '-',
      },
    };

    partnerRes.rows.forEach((r: any) => {
      partnersMap[r.code] = {
        code: r.code,
        name: r.name,
        type: r.type,
        appOpens: r.app_opens,
        petsCreated: r.pets_created,
        proActivations: r.pro_activations,
        revenue: r.pro_activations * 4990,
        lastActivity: r.last_activity ? new Date(r.last_activity).toISOString() : '-',
      };
    });

    const partnersList = Object.values(partnersMap).sort(
      (a, b) => (b.appOpens + b.petsCreated + b.proActivations) - (a.appOpens + a.petsCreated + a.proActivations)
    );

    // 3. Actividad Reciente
    const recentRes = await pool.query(`
      SELECT 
        action,
        platform,
        is_pro AS "isPro",
        partner_code AS "partnerCode",
        partner_type AS "partnerType",
        partner_name AS "partnerName",
        created_at AS timestamp
      FROM mimascota_telemetry_events
      ORDER BY created_at DESC
      LIMIT 30;
    `);

    return NextResponse.json(
      {
        app: 'Mi Mascota PWA',
        status: 'online',
        stats: {
          totalAppOpens: gRow.total_app_opens,
          totalPetsCreated: gRow.total_pets_created,
          totalProActivations: gRow.total_pro_activations,
          iosUsers: gRow.ios_users,
          otherUsers: gRow.other_users,
        },
        partners: partnersList,
        recentActivity: recentRes.rows,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error en consulta telemetria' },
      { status: 500, headers: corsHeaders }
    );
  }
}
