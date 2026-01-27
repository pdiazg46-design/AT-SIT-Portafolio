"use client";

import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, BarChart3, Lock, Zap, PieChart, Activity } from "lucide-react";
import Link from "next/link";

export default function TangenteDetail() {
    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
            <div className="mesh-gradient opacity-60" />

            {/* Nav Back */}
            <nav className="fixed top-0 w-full z-50 glass py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-violet-400 hover:text-violet-600 transition-colors font-bold">
                        <ArrowLeft size={20} /> Volver al Inicio
                    </Link>
                    <img src="/logo-atsit.png" alt="AT-SIT" className="h-10 w-auto" />
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
                            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-[10px] font-bold uppercase tracking-widest mb-6">
                                Industrial Finance Intelligence
                            </span>
                            <h1 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
                                Tangente <br />
                                <span className="text-violet-600">Finance Pro</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
                                Sistema de inteligencia financiera especializado en el sector construcción y flujos de caja corporativos de alta volatilidad.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {["React", "Drizzle ORM", "TypeScript", "Tailwind", "Radix UI"].map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-600/70 text-xs font-bold uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-violet-500/10 blur-[100px] -z-10" />
                            <img
                                src="/projects/tangente.png"
                                alt="Finance Dashboard Preview"
                                className="rounded-[2.5rem] shadow-2xl border border-slate-100 w-full"
                            />
                        </motion.div>
                    </div>

                    {/* Módulos */}
                    <h2 className="text-4xl font-black mb-16 tracking-tight text-center">Núcleo de Operación</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        <ModuleCard
                            icon={<TrendingUp className="text-indigo-600" />}
                            title="Proyección de Flujo"
                            desc="Algoritmos de predicción que analizan cuentas por cobrar y pagar para anticipar quiebres de caja."
                        />
                        <ModuleCard
                            icon={<BarChart3 className="text-violet-600" />}
                            title="KPIs de Obra"
                            desc="Métricas específicas para construcción: margen bruto por proyecto, avance financiero vs físico."
                        />
                        <ModuleCard
                            icon={<Activity className="text-cyan-600" />}
                            title="Monitor en Tiempo Real"
                            desc="Dashboard con conectividad total que centraliza múltiples fuentes de datos bancarios y contables."
                        />
                    </div>

                    {/* Industrial Standard */}
                    <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <PieChart size={200} />
                        </div>
                        <div className="max-w-2xl relative z-10">
                            <h2 className="text-4xl font-black mb-10 tracking-tight">Estándar Corporativo</h2>
                            <div className="space-y-6">
                                <CapabilityRow title="Auditoría de Movimientos" desc="Registro inmutable de cada transacción y cambio en las proyecciones financieras." />
                                <CapabilityRow title="Seguridad Bancaria" desc="Arquitectura de datos aislada con encriptación de grado militar para información sensible." />
                                <CapabilityRow title="Multiusuario Jerárquico" desc="Control de acceso granular para contadores, gerentes de obra y directivos." />
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
        <div className="p-10 rounded-[2.5rem] border border-violet-50 bg-white hover:shadow-2xl hover:shadow-violet-500/5 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-8">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
            <p className="text-slate-600 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

function CapabilityRow({ title, desc }: any) {
    return (
        <div className="flex gap-6 items-start">
            <div className="shrink-0 mt-1">
                <Lock className="text-violet-400" size={24} />
            </div>
            <div>
                <h4 className="font-bold text-xl mb-1">{title}</h4>
                <p className="text-slate-400 font-medium">{desc}</p>
            </div>
        </div>
    );
}
