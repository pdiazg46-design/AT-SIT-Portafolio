import { NextResponse } from 'next/server';

interface VaultRecord {
  userKey: string;
  pinHash: string;
  encryptedData: any;
  version: number;
  updatedAt: string;
}

const globalVaultStore = new Map<string, VaultRecord>();

function normalizeUserKey(key: string): string {
  if (!key) return '';
  const trimmed = key.trim().toLowerCase();
  if (/^[\d+\s-]+$/.test(trimmed)) {
    return trimmed.replace(/[^\d+]/g, '');
  }
  return trimmed;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawKey = searchParams.get('userKey');
    const pinHash = searchParams.get('pinHash');

    if (!rawKey || !pinHash) {
      return NextResponse.json({ success: false, error: 'Identificador y PIN requeridos' }, { status: 400 });
    }

    const userKey = normalizeUserKey(rawKey);
    const vault = globalVaultStore.get(userKey);

    if (!vault) {
      return NextResponse.json({ success: false, error: 'No se encontró ninguna bóveda para este usuario' }, { status: 404 });
    }

    if (vault.pinHash !== pinHash) {
      return NextResponse.json({ success: false, error: 'PIN de seguridad incorrecto' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      userKey,
      encryptedData: vault.encryptedData,
      version: vault.version,
      updatedAt: vault.updatedAt
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error en Bóveda ATSIT' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userKey: rawKey, pinHash, encryptedData, version = 1 } = body;

    if (!rawKey || !pinHash || !encryptedData) {
      return NextResponse.json({ success: false, error: 'Datos incompletos para guardar en la bóveda' }, { status: 400 });
    }

    const userKey = normalizeUserKey(rawKey);
    const existingVault = globalVaultStore.get(userKey);

    if (existingVault && existingVault.pinHash !== pinHash) {
      return NextResponse.json({ success: false, error: 'PIN incorrecto. No se puede sobreescribir la bóveda existente.' }, { status: 403 });
    }

    const now = new Date().toISOString();
    const newRecord: VaultRecord = {
      userKey,
      pinHash,
      encryptedData,
      version: (existingVault ? existingVault.version + 1 : 1),
      updatedAt: now
    };

    globalVaultStore.set(userKey, newRecord);

    return NextResponse.json({
      success: true,
      userKey,
      version: newRecord.version,
      updatedAt: now,
      message: 'Bóveda respaldada con éxito en la Nube Soberana ATSIT'
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error al procesar la bóveda' }, { status: 500 });
  }
}
