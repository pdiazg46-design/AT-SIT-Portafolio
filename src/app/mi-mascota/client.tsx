"use client";

import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Syringe, 
  Pill, 
  Scale, 
  HardDrive,
  Copy,
  Check
} from 'lucide-react';

export default function MiMascotaLandingClient() {
  const [copied, setCopied] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const uaLower = ua.toLowerCase();

    // Detectar iOS
    const ios = /iphone|ipad|ipod/.test(uaLower);
    setIsIOS(ios);

    // Detectar navegadores integrados de redes sociales (Instagram, TikTok, Facebook, Twitter, WhatsApp)
    const inApp = /fban|fbav|instagram|tiktok|bytedance|micromessenger|snapchat|twitter|line|fb_iab/.test(uaLower);
    setIsInAppBrowser(inApp);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.atsit.cl/mi-mascota');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      {/* Glow de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header Compacto con Logo */}
      <header className="relative z-10 border-b border-white/10 px-6 py-4 backdrop-blur-xl bg-slate-950/60">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-lg shadow-md shadow-purple-600/30">
              🐾
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white block leading-none">Mi Mascota</span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">by AT-SIT</span>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition text-slate-200 active:scale-95 border border-white/10"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </header>

      {/* Contenido Central */}
      <main className="relative z-10 px-4 py-6 max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Banner Especial Anti-InApp Browser (Si abren desde Instagram/TikTok/Facebook) */}
        {isInAppBrowser && (
          <div className="mb-5 p-4 rounded-3xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs animate-pulse">
            <p className="font-bold flex items-center gap-1.5 text-amber-300 mb-1">
              ⚠️ Estás dentro del visor de la red social
            </p>
            <p className="text-[11px] leading-relaxed text-amber-100">
              {isIOS 
                ? 'Para instalarla en tu iPhone: Toca los tres puntos (...) o compartir abajo y selecciona "Abrir en Safari".'
                : 'Para instalarla en tu Android: Toca los tres puntos (⋮) arriba a la derecha y selecciona "Abrir en Chrome".'}
            </p>
          </div>
        )}

        {/* Hero Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-purple-400" /> App Oficial para Celular
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-2">
            La Hoja de Vida Médica de tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">Mascotas</span>
          </h1>

          <p className="text-slate-300 text-xs leading-relaxed max-w-xs mx-auto">
            El carnet clínico digital más seguro y privado. Funciona 100% en tu teléfono sin internet ni suscripciones mensuales.
          </p>
        </div>

        {/* Tarjeta de Acción / Compra y Demo */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900/90 via-purple-950/40 to-slate-950 border border-purple-500/30 shadow-2xl backdrop-blur-2xl space-y-3.5 mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">Acceso Vitalicio</span>
              <span className="text-2xl font-black text-white">$4.990 <span className="text-xs font-normal text-slate-400">CLP (Pago Único)</span></span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase">
              Para Siempre
            </span>
          </div>

          {/* Botón Principal de Mercado Pago */}
          <a
            href="https://mpago.la/1YdH7eG"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95 transition"
          >
            <Sparkles size={18} className="text-amber-300" />
            <span>Comprar Acceso Inmediato ($4.990)</span>
          </a>

          {/* Botón Abrir Demo en Vivo */}
          <a
            href="/mascota/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-purple-500/40 transition active:scale-95"
          >
            <ExternalLink size={16} />
            <span>Probar la App Gratis en tu Celular</span>
          </a>

          <p className="text-[10px] text-center text-slate-400 pt-1 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Pago seguro con Redcompra, Webpay, Débito o Crédito.</span>
          </p>
        </div>

        {/* 4 Características Clave */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
              <Syringe size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">Vacunas al Día</p>
              <p className="text-[10px] text-slate-400">Lote, frasco y fechas de refuerzo.</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <Scale size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">Control de Peso</p>
              <p className="text-[10px] text-slate-400">Gráfico interactivo de evolución.</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <Award size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">Certificados SAG</p>
              <p className="text-[10px] text-slate-400">Documentos timbrados para viajes.</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-300 shrink-0">
              <HardDrive size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">100% Sin Internet</p>
              <p className="text-[10px] text-slate-400">Tus datos nunca salen del teléfono.</p>
            </div>
          </div>
        </div>

        {/* Guía Rápida para Instalar en iPhone / Android */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-xs space-y-2">
          <p className="font-bold text-white text-[11px] flex items-center gap-1.5">
            <Smartphone size={15} className="text-purple-400" />
            ¿Cómo se instala en tu teléfono?
          </p>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-[10px]">1</span>
              <span>En iPhone (Safari): Toca <strong>Compartir</strong> <Share className="inline w-3 h-3 text-sky-400 mx-0.5" /> y selecciona <strong>"Agregar a Inicio"</strong> <PlusSquare className="inline w-3 h-3 text-emerald-400 mx-0.5" />.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-[10px]">2</span>
              <span>En Android (Chrome): Toca el aviso <strong>"Instalar aplicación"</strong> en la pantalla.</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-4 px-6 text-center text-[10px] text-slate-400">
        <p>© 2026 AT-SIT. Aplicación Soberana, Privada y Sin Servidores.</p>
      </footer>
    </div>
  );
}
