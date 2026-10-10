import { NextResponse } from 'next/server';

// En memoria volátil para telemetría instantánea y logs de servidor Vercel
interface TelemetryStats {
  totalAppOpens: number;
  totalPetsCreated: number;
  totalProActivations: number;
  iosUsers: number;
  otherUsers: number;
  lastEvents: Array<{ action: string; platform: string; isPro: boolean; timestamp: string }>;
}

const stats: TelemetryStats = {
  totalAppOpens: 0,
  totalPetsCreated: 0,
  totalProActivations: 0,
  iosUsers: 0,
  otherUsers: 0,
  lastEvents: [],
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, platform, isPro, timestamp } = body;

    if (action === 'app_opened') stats.totalAppOpens++;
    if (action === 'pet_created') stats.totalPetsCreated++;
    if (action === 'pro_activated') stats.totalProActivations++;

    if (platform === 'ios') stats.iosUsers++;
    else stats.otherUsers++;

    stats.lastEvents.unshift({
      action: action || 'unknown',
      platform: platform || 'other',
      isPro: !!isPro,
      timestamp: timestamp || new Date().toISOString(),
    });

    if (stats.lastEvents.length > 50) {
      stats.lastEvents = stats.lastEvents.slice(0, 50);
    }

    console.log(`[MiMascota Telemetria] Evento: ${action} | Plataforma: ${platform} | PRO: ${isPro}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en telemetria' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    app: 'Mi Mascota PWA',
    status: 'online',
    stats: {
      totalAppOpens: stats.totalAppOpens,
      totalPetsCreated: stats.totalPetsCreated,
      totalProActivations: stats.totalProActivations,
      iosUsers: stats.iosUsers,
      otherUsers: stats.otherUsers,
    },
    recentActivity: stats.lastEvents.slice(0, 15),
  });
}
