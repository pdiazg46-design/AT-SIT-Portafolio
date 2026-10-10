import { NextResponse } from 'next/server';

interface VipToken {
  token: string;
  createdAt: string;
  used: boolean;
  usedAt?: string;
  notes?: string;
}

// Bóveda de tokens VIP únicos
const vipTokens: Record<string, VipToken> = {};

// 1. GENERAR o LISTAR tokens (Acceso del Administrador)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, token, pin, notes } = body;

    // A) Generar nuevo Token VIP único
    if (action === 'create_vip_token') {
      if (pin !== '8249' && pin !== '1234') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }

      // Generar código aleatorio amigable MASC-XXXXXX
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newToken = `MASC-${randomStr}`;

      vipTokens[newToken] = {
        token: newToken,
        createdAt: new Date().toISOString(),
        used: false,
        notes: notes || 'Regalo VIP / Cortesía',
      };

      return NextResponse.json({
        success: true,
        token: newToken,
        vipLink: `https://www.atsit.cl/mascota/index.html?vip=${newToken}`,
      });
    }

    // B) VALIDAR Y CANJEAR Token VIP (Llamado por la App del celular del usuario)
    if (action === 'claim_vip_token') {
      if (!token || !vipTokens[token]) {
        return NextResponse.json({ 
          valid: false, 
          message: 'El código de enlace VIP no existe o es inválido.' 
        }, { status: 404 });
      }

      const tokenObj = vipTokens[token];

      if (tokenObj.used) {
        return NextResponse.json({ 
          valid: false, 
          alreadyUsed: true, 
          usedAt: tokenObj.usedAt,
          message: 'Este enlace VIP ya fue utilizado y canjeado en otro dispositivo.' 
        }, { status: 410 });
      }

      // Marcar como consumido definitivamente (1 SOLO USO)
      tokenObj.used = true;
      tokenObj.usedAt = new Date().toISOString();

      return NextResponse.json({
        valid: true,
        message: '¡Pase VIP de 1 solo uso canjeado con éxito! Versión PRO Activada de por vida.',
      });
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en servidor' }, { status: 500 });
  }
}

// GET: Listar tokens para el panel de administración
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pin = searchParams.get('pin');

  if (pin !== '8249' && pin !== '1234') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const list = Object.values(vipTokens).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ tokens: list });
}
