import { NextResponse } from 'next/server';

// Cabeceras CORS universales para permitir lecturas desde file:// (Admin local de proyectos) y la PWA
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
  partnerType: 'clinic' | 'pharmacy' | 'organic';
  partnerName: string;
  timestamp: string;
}

export interface PartnerSummary {
  code: string;
  name: string;
  type: 'clinic' | 'pharmacy' | 'organic';
  appOpens: number;
  petsCreated: number;
  proActivations: number;
  revenue: number;
  lastActivity: string;
}

interface TelemetryStore {
  totalAppOpens: number;
  totalPetsCreated: number;
  totalProActivations: number;
  iosUsers: number;
  otherUsers: number;
  partners: Record<string, PartnerSummary>;
  lastEvents: TelemetryEvent[];
}

// Inicialización con canales base (Clínica Demo, Farmacia Demo y Redes Libres)
const store: TelemetryStore = {
  totalAppOpens: 0,
  totalPetsCreated: 0,
  totalProActivations: 0,
  iosUsers: 0,
  otherUsers: 0,
  partners: {
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
  },
  lastEvents: [],
};

export async function POST(req: Request) {
  try {
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
    const type: 'clinic' | 'pharmacy' | 'organic' =
      partnerType === 'clinic' || partnerType === 'pharmacy' ? partnerType : (code.startsWith('farma') ? 'pharmacy' : (code.startsWith('vet') || code === 'demo' ? 'clinic' : 'organic'));
    
    const name = partnerName || (code === 'demo' ? 'Clínica Veterinaria Demo (ATSIT)' : (code === 'farma_demo' || code === 'farmacia' ? 'Farmacia Veterinaria Demo (ATSIT)' : (type === 'clinic' ? `Clínica ${code}` : (type === 'pharmacy' ? `Farmacia ${code}` : 'Redes Sociales / Libre'))));

    // Asegurar registro del partner en el resumen
    if (!store.partners[code]) {
      store.partners[code] = {
        code,
        name,
        type,
        appOpens: 0,
        petsCreated: 0,
        proActivations: 0,
        revenue: 0,
        lastActivity: nowIso,
      };
    }

    const partner = store.partners[code];
    partner.lastActivity = nowIso;

    // Incrementar contadores globales y específicos
    if (eventAction === 'app_opened') {
      store.totalAppOpens++;
      partner.appOpens++;
    } else if (eventAction === 'pet_created') {
      store.totalPetsCreated++;
      partner.petsCreated++;
    } else if (eventAction === 'pro_activated') {
      store.totalProActivations++;
      partner.proActivations++;
      partner.revenue = partner.proActivations * 4990;
    }

    if (eventPlatform === 'ios') store.iosUsers++;
    else store.otherUsers++;

    // Registrar evento en la cola reciente
    const newEvent: TelemetryEvent = {
      action: eventAction,
      platform: eventPlatform,
      isPro: eventIsPro,
      partnerCode: code,
      partnerType: type,
      partnerName: name,
      timestamp: nowIso,
    };

    store.lastEvents.unshift(newEvent);
    if (store.lastEvents.length > 100) {
      store.lastEvents = store.lastEvents.slice(0, 100);
    }

    console.log(`[MiMascota Telemetria] Evento: ${eventAction} | Partner: ${code} (${type}) | Plataforma: ${eventPlatform} | PRO: ${eventIsPro}`);

    return NextResponse.json({ success: true, registered: newEvent }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en telemetria' }, { status: 500, headers: corsHeaders });
  }
}

export async function GET() {
  const partnersList = Object.values(store.partners).sort((a, b) => (b.appOpens + b.petsCreated + b.proActivations) - (a.appOpens + a.petsCreated + a.proActivations));

  return NextResponse.json(
    {
      app: 'Mi Mascota PWA',
      status: 'online',
      stats: {
        totalAppOpens: store.totalAppOpens,
        totalPetsCreated: store.totalPetsCreated,
        totalProActivations: store.totalProActivations,
        iosUsers: store.iosUsers,
        otherUsers: store.otherUsers,
      },
      partners: partnersList,
      recentActivity: store.lastEvents.slice(0, 30),
    },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
