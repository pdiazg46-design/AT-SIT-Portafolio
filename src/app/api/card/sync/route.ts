import { NextResponse } from 'next/server';

const globalLiveSyncStore = new Map<string, {
  version: number;
  updatedAt: string;
  status: 'active' | 'revoked';
  payload: any;
}>();

globalLiveSyncStore.set('atsit_patricio_diaz', {
  version: 1725060000000,
  updatedAt: new Date().toISOString(),
  status: 'active',
  payload: {
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
  }
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get('id') || 'atsit_patricio_diaz';

    const card = globalLiveSyncStore.get(cardId);
    if (!card) {
      if (cardId === 'atsit_patricio_diaz' || cardId === 'official') {
        const defaultCard = globalLiveSyncStore.get('atsit_patricio_diaz');
        return NextResponse.json({ success: true, card: defaultCard }, { status: 200 });
      }
      return NextResponse.json({ success: false, error: 'Tarjeta no encontrada o inactiva' }, { status: 404 });
    }

    if (card.status === 'revoked') {
      return NextResponse.json({ success: true, status: 'revoked', message: 'Tarjeta revocada por el titular (Ley N° 21.719)' }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      cardId,
      version: card.version,
      updatedAt: card.updatedAt,
      status: card.status,
      payload: card.payload
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error en LiveSync' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardId, payload, status = 'active' } = body;

    if (!cardId || (!payload && status !== 'revoked')) {
      return NextResponse.json({ success: false, error: 'Datos incompletos para sincronización' }, { status: 400 });
    }

    const now = Date.now();
    const updatedRecord = {
      version: now,
      updatedAt: new Date().toISOString(),
      status: status === 'revoked' ? ('revoked' as const) : ('active' as const),
      payload: payload || {}
    };

    globalLiveSyncStore.set(cardId, updatedRecord);

    return NextResponse.json({
      success: true,
      cardId,
      version: now,
      message: status === 'revoked' ? 'Tarjeta revocada soberanamente' : 'Ficha actualizada exitosamente en LiveSync'
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error al procesar LiveSync' }, { status: 500 });
  }
}
