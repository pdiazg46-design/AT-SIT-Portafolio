"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mic, TrendingUp, ShieldCheck, Zap, Database, Smartphone, BarChart3, Clock, Lock } from "lucide-react";
import Link from "next/link";

export default function EmprendeDetail() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent)] pointer-events-none" />

            {/* Nav Back */}
            <nav className="fixed top-0 w-full z-50 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/#emprende" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-bold">
                        <ArrowLeft size={20} /> Volver al Inicio
                    </Link>
                    <img src="/logo-atsit.png" alt="AT-SIT" className="h-10 w-auto brightness-200" />
                </div>
            </nav>

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                SaaS & POS Omnicanal
                            </span>
                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
                                Emprende <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Punto de Venta</span>
                            </h1>
                            <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                                Una plataforma integral para control de inventario y ventas con arquitectura "RAM-First" (Optimistic UI), comandos por voz NLP y un modelo de suscripción transaccional directo.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {["Next.js", "Prisma", "Capacitor", "PWA", "NextAuth", "Mercado Pago"].map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] -z-10 group-hover:bg-indigo-500/40 transition-colors duration-700" />
                            <img
                                src="/projects/emprende.png"
                                alt="Emprende Dashboard"
                                className="rounded-[2.5rem] shadow-2xl border border-white/10 w-full"
                            />
                        </motion.div>
                    </div>

                    {/* Módulos */}
                    <h2 className="text-4xl font-black mb-16 tracking-tight text-center">Arquitectura del Sistema</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        <ModuleCard
                            icon={<Zap className="text-yellow-400" />}
                            title="RAM-First / Optimistic UI"
                            desc="El Punto de Venta actualiza el inventario local instantáneamente, enmascarando cualquier latencia del servidor y permitiendo ventas continuas."
                        />
                        <ModuleCard
                            icon={<Smartphone className="text-indigo-400" />}
                            title="Nativo & PWA"
                            desc="Compilado para Android (.aab ready) mediante Capacitor y distribuible directamente como aplicación de escritorio gracias a un core isomorfo."
                        />
                        <ModuleCard
                            icon={<Mic className="text-purple-400" />}
                            title="Voice NLP Engine"
                            desc="Modulo integrado de escucha inteligente para registrar ingresos o buscar productos en el carrito usando lenguaje natural fluido."
                        />
                    </div>

                    {/* Tech & Capabilities */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] p-12 md:p-20 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Database size={250} />
                        </div>
                        <div className="max-w-2xl relative z-10">
                            <h2 className="text-4xl font-black mb-10 tracking-tight">Capacidades Empresariales</h2>
                            <div className="space-y-6">
                                <CapabilityRow title="Facturación Mercado Pago integr." desc="Planes de suscripción escalados (Básico, Pro, VIP) validados a nivel JWT por NextAuth y protegidos por Server Actions." />
                                <CapabilityRow title="Autenticación DB-Native" desc="Sistema OAuth erradicado por fiabilidad extrema; protección cruda Bcrypt + PostgreSQL para asegurar persistencia offline y de sesión." />
                                <CapabilityRow title="Operatividad de Stock Flexible" desc="Lógica algorítmica diseñada para reflejar la realidad en terreno, permitiendo quiebres de stock en transacciones válidas." />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ModuleCard({ icon, title, desc }: any) {
    return (
        <div className="p-10 rounded-[2.5rem] border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight text-white">{title}</h3>
            <p className="text-slate-300 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

function CapabilityRow({ title, desc }: any) {
    return (
        <div className="flex gap-6 items-start">
            <div className="shrink-0 mt-1">
                <Lock className="text-indigo-400" size={24} />
            </div>
            <div>
                <h4 className="font-bold text-xl mb-1 text-white">{title}</h4>
                <p className="text-slate-300 font-medium">{desc}</p>
            </div>
        </div>
    );
}
