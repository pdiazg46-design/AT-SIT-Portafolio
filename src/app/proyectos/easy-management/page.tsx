"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Database, Zap } from "lucide-react";
import Link from "next/link";

export default function EasyManagementDetail() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent)] pointer-events-none" />

            <nav className="fixed top-0 w-full z-50 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/#proyectos" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-bold">
                        <ArrowLeft size={20} /> Volver al Inicio
                    </Link>
                    <div className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md">
                        <img src="/logo-atsit.png" alt="AT-SIT" className="h-8 w-auto" />
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                Gestión Dinámica Empresarial
                            </span>
                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
                                Easy Management <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Inteligencia CRM</span>
                            </h1>
                            <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                                Sistema de administración avanzado con integraciones masivas, un pipeline ágil enfocado en conversión y procesamiento Gen AI basado en los datos del usuario.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {["React", "Vite", "Gen AI", "Pipelines"].map(tag => (
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
                                src="/projects/easy-management.png"
                                alt="Easy Management Dashboard"
                                className="rounded-[2.5rem] shadow-2xl border border-white/10 w-full"
                            />
                        </motion.div>
                    </div>

                    <h2 className="text-4xl font-black mb-16 tracking-tight text-center">Niveles de Operación</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        <ModuleCard
                            icon={<Zap className="text-indigo-400" />}
                            title="Pipeline Acelerado"
                            desc="Embudo de ventas optimizado libre de interfaces lentas o saturadas."
                        />
                        <ModuleCard
                            icon={<Database className="text-cyan-400" />}
                            title="Procesamiento CSV"
                            desc="Integración local de grandes volúmenes de datos con compatibilidad Excel para su manipulación."
                        />
                        <ModuleCard
                            icon={<BarChart3 className="text-purple-400" />}
                            title="KPIs en Tiempo Real"
                            desc="Tablero directivo financiero y de seguimiento con métricas cristalinas."
                        />
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
