"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  Activity, 
  Smartphone, 
  Users, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowLeft 
} from 'lucide-react';

export default function MiMascotaAdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorPin, setErrorPin] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vipTokensList, setVipTokensList] = useState<Array<{ token: string; used: boolean; createdAt: string }>>([]);
  const [isGeneratingVip, setIsGeneratingVip] = useState(false);

  const [data, setData] = useState<{
    stats: {
      totalAppOpens: number;
      totalPetsCreated: number;
      totalProActivations: number;
      iosUsers: number;
      otherUsers: number;
    };
    recentActivity: Array<{
      action: string;
      platform: string;
      isPro: boolean;
      timestamp: string;
    }>;
  }>({
    stats: { totalAppOpens: 0, totalPetsCreated: 0, totalProActivations: 0, iosUsers: 0, otherUsers: 0 },
    recentActivity: []
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Claves maestras autorizadas (Patricio / AT-SIT)
    if (pin === '8249' || pin === '1234' || pin === 'admin') {
      setIsAuthenticated(true);
      setErrorPin(false);
      sessionStorage.setItem('mascota_admin_auth', 'true');
      fetchData();
      fetchVipTokens();
    } else {
      setErrorPin(true);
    }
  };

  const fetchVipTokens = async () => {
    try {
      const res = await fetch('/api/mascota/vip?pin=8249');
      if (res.ok) {
        const json = await res.json();
        setVipTokensList(json.tokens || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateVipToken = async () => {
    setIsGeneratingVip(true);
    try {
      const res = await fetch('/api/mascota/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_vip_token', pin: '8249', notes: 'Pase 1 solo uso' }),
      });
      if (res.ok) {
        await fetchVipTokens();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingVip(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mascota/telemetry');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('mascota_admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // PANTALLA 1: LOGIN CON PIN PRIVADO
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-purple-600/30">
            🐾
          </div>
          <h1 className="text-xl font-black text-white">Mi Mascota • Panel Dueño</h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">Ingresa tu clave maestra para ver usuarios y ventas en vivo.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorPin(false);
                }}
                placeholder="Ingresa PIN"
                className="w-full py-3.5 px-4 bg-slate-950 border border-white/20 rounded-2xl text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-purple-500"
                autoFocus
              />
            </div>

            {errorPin && (
              <p className="text-xs text-red-400 font-bold">PIN incorrecto. Inténtalo de nuevo.</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 active:scale-95 transition"
            >
              Acceder al Panel
            </button>
          </form>

          <a href="/mi-mascota" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-6 transition">
            <ArrowLeft size={14} /> Volver a la página pública
          </a>
        </div>
      </div>
    );
  }

  // PANTALLA 2: PANEL DE CONTROL EN TIEMPO REAL
  const revenueCLP = (data.stats.totalProActivations || 0) * 4990;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg">
              🐾
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">Exclusivo Patricio Díaz</span>
              <h1 className="text-lg font-black text-white leading-tight">Monitor de Ventas & Usuarios en Vivo</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition active:scale-95"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </button>
            <a
              href="/mi-mascota"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-xs font-bold border border-purple-500/30 transition"
            >
              <span>Ver Landing</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* 4 Métricas Clave */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tráfico Total (Aperturas)</span>
            <div className="text-2xl font-black text-white mt-1">{data.stats.totalAppOpens}</div>
            <span className="text-[10px] text-sky-400 mt-0.5 block">{data.stats.iosUsers} en iPhone (Safari)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mascotas Creadas</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{data.stats.totalPetsCreated}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Usuarios en prueba activa</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Licencias PRO Activadas</span>
            <div className="text-2xl font-black text-purple-400 mt-1">{data.stats.totalProActivations}</div>
            <span className="text-[10px] text-purple-300 mt-0.5 block">Compradores Ilimitados</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recaudación Estimada</span>
            <div className="text-2xl font-black text-amber-400 mt-1">${revenueCLP.toLocaleString('es-CL')}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Vía Mercado Pago</span>
          </div>
        </div>

        {/* Caja de Enlaces Rápidos para Redes */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            Tus Enlaces para Redes Sociales
          </h3>

          <div className="grid md:grid-cols-3 gap-3 text-xs">
            {/* Link 1 */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="font-bold text-sky-400 block mb-1">🔗 Enlace Oficial (Instagram / TikTok)</span>
                <p className="text-[11px] text-slate-400 mb-2">Con landing y aviso para Safari.</p>
              </div>
              <button
                onClick={() => copyToClipboard('https://www.atsit.cl/mi-mascota', 'l1')}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                {copiedLink === 'l1' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedLink === 'l1' ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>

            {/* Link 2 */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="font-bold text-emerald-400 block mb-1">💳 Link Mercado Pago ($4.990)</span>
                <p className="text-[11px] text-slate-400 mb-2">Cobro directo con Webpay/Tarjetas.</p>
              </div>
              <button
                onClick={() => copyToClipboard('https://mpago.la/1YdH7eG', 'l2')}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                {copiedLink === 'l2' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedLink === 'l2' ? '¡Copiado!' : 'Copiar Link Pago'}</span>
              </button>
            </div>

            {/* Link 3: Generador de Enlaces VIP de 1 Solo Uso */}
            <div className="p-3 rounded-2xl bg-white/5 border border-purple-500/30 flex flex-col justify-between">
              <div>
                <span className="font-bold text-purple-400 block mb-1">👑 Crear Pase VIP (1 Solo Uso)</span>
                <p className="text-[11px] text-slate-400 mb-2">Se quema tras abrirse. Nadie lo puede reenviar.</p>
              </div>
              <button
                onClick={handleGenerateVipToken}
                disabled={isGeneratingVip}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-purple-600/30"
              >
                <Sparkles size={14} className="text-amber-300" />
                <span>{isGeneratingVip ? 'Generando...' : '+ Generar Pase VIP'}</span>
              </button>
            </div>
          </div>

          {/* Lista de Pases VIP Generados */}
          {vipTokensList.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Pases VIP Creados:</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {vipTokensList.map((t, idx) => {
                  const link = `https://www.atsit.cl/mascota/index.html?vip=${t.token}`;
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/10 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${t.used ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}`} />
                        <span className="font-mono text-white font-bold">{t.token}</span>
                        <span className="text-[10px] text-slate-400">({t.used ? 'Canjeado' : 'Disponible'})</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(link, `vip_${idx}`)}
                        disabled={t.used}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                          t.used 
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                            : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                        }`}
                      >
                        {copiedLink === `vip_${idx}` ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedLink === `vip_${idx}` ? '¡Copiado!' : (t.used ? 'Quemado' : 'Copiar Link')}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Historial de Eventos Recientes */}
        <div className="rounded-3xl bg-slate-900 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Activity size={16} className="text-purple-400" />
              Actividad en Tiempo Real
            </h3>
            <span className="text-[10px] text-slate-400">Últimos eventos registrados</span>
          </div>

          <div className="divide-y divide-white/5">
            {(!data.recentActivity || data.recentActivity.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Aún no hay actividad registrada hoy. Comparte el enlace en tus redes para ver las primeras visitas aquí.
              </div>
            ) : (
              data.recentActivity.map((ev, idx) => (
                <div key={idx} className="p-3.5 px-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {ev.action === 'pro_activated' && <span className="text-amber-400">👑 PRO Activada</span>}
                        {ev.action === 'pet_created' && <span className="text-emerald-400">🐶 Mascota Creada</span>}
                        {ev.action === 'app_opened' && <span className="text-sky-400">📲 App Abierta</span>}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {ev.platform === 'ios' ? '🍎 iPhone (Safari)' : '🤖 Android / Web'} • {ev.isPro ? 'Cliente PRO' : 'Prueba'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(ev.timestamp).toLocaleTimeString('es-CL')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
