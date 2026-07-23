"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mic, TrendingUp, ShieldCheck, Zap, Database, Smartphone, BarChart3, Clock } from "lucide-react";
import Link from "next/link";

export default function FinanzaFacilDetail() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />

            {/* Nav Back */}
            <nav className="fixed top-0 w-full z-50 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/#finanza-facil" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-bold">
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
                            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                🚀 Primera App Descargable para Windows
                            </span>
                            <h1 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
                                ATSIT <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Finanzas</span>
                            </h1>
                            <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                                Nuestra primera aplicación nativa de escritorio para Windows. Diseñada para la gestión financiera integral de obras y proyectos, control de presupuestos, desglose de Neto + IVA (19%), flujo de caja y exportación de informes en PDF y Excel.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-8">
                                {["Windows App", "Electron", "Drizzle ORM", "SQLite Nativo", "PDF & Excel"].map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Prominent Download Banner for Windows (15-Day Trial) */}
                            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-900/60 via-indigo-900/60 to-slate-900 border border-purple-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                                        <Clock size={12} /> Prueba Gratis 15 Días
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                                        <Smartphone size={12} className="rotate-90" /> Solo para Windows
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Descargar ATSIT Finanzas (Desktop)</h3>
                                <p className="text-slate-300 text-sm font-medium mb-6 leading-relaxed">
                                    Obtén el ejecutable directo para Windows con 15 días de evaluación completa sin costo ni restricciones de funciones.
                                </p>
                                <a
                                    href="https://drive.google.com/file/d/1P0wetvbgd6z0lozTPXyqPto28rZ9yEqB/view?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-purple-500/25 transition-all transform hover:scale-[1.02] active:scale-95 text-base"
                                >
                                    <Zap size={20} className="fill-white" />
                                    Descargar ATSIT Finanzas para Windows
                                </a>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-purple-500/20 blur-[120px] -z-10" />
                            <img
                                src="/projects/finanza-facil.png"
                                alt="ATSIT Finanzas Dashboard"
                                className="rounded-[2.5rem] shadow-2xl border border-white/5 w-full"
                            />
                        </motion.div>
                    </div>

                    {/* Módulos */}
                    <h2 className="text-4xl font-black mb-16 tracking-tight text-center">Ingeniería Financiera & Control de Obras</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        <ModuleCard
                            icon={<BarChart3 className="text-purple-400" />}
                            title="Control de Obras & Tareas"
                            desc="Gestión centralizada de proyectos, seguimiento de ítems con valores neto/total y balance de margen de ganancia en tiempo real."
                        />
                        <ModuleCard
                            icon={<ShieldCheck className="text-indigo-400" />}
                            title="Cálculo de IVA (19%)"
                            desc="Cálculo automático de Débito y Crédito Fiscal sobre facturas y boletas para un control exacto en declaraciones mensuales."
                        />
                        <ModuleCard
                            icon={<Database className="text-cyan-400" />}
                            title="Base de Datos SQLite Nativa"
                            desc="Almacenamiento local ultrarrápido y seguro que te permite operar al 100% en terreno u obra sin depender de conexión a internet."
                        />
                    </div>

                    {/* Tech & Capabilities */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] p-12 md:p-20 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <TrendingUp size={250} />
                        </div>
                        <div className="max-w-2xl relative z-10">
                            <h2 className="text-4xl font-black mb-10 tracking-tight">Sincronización Atómica</h2>
                            <div className="space-y-6">
                                <CapabilityRow title="Massive Sync Pattern" desc="Arquitectura optimizada para sincronizar múltiples registros simultáneos con identificación de deltas para eficiencia extrema." />
                                <CapabilityRow title="Gestión de Cuotas Pro" desc="Seguimiento automatizado de créditos con proyecciones de impacto en el flujo de caja futuro." />
                                <CapabilityRow title="Global Store State" desc="Sincronización en tiempo real entre el dispositivo local y la nube para una experiencia multidispositivo sin interrupciones." />
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
                <Zap className="text-purple-400" size={24} />
            </div>
            <div>
                <h4 className="font-bold text-xl mb-1 text-white">{title}</h4>
                <p className="text-slate-300 font-medium">{desc}</p>
            </div>
        </div>
    );
}
