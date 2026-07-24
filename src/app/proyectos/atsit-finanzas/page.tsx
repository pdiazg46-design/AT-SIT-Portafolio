"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, ShieldCheck, Database, Zap, Clock, DownloadCloud, FileText, Users, Building2, Monitor } from "lucide-react";
import Link from "next/link";

export default function AtsitFinanzasDetail() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.12),transparent)] pointer-events-none" />

            {/* Nav Back */}
            <nav className="fixed top-0 w-full z-50 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/#descargas" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-bold">
                        <ArrowLeft size={20} /> Volver a Descargas
                    </Link>
                    <div className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md">
                        <img src="/logo-atsit.png" alt="AT-SIT" className="h-8 w-auto" />
                    </div>
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
                                🚀 Primera Aplicación Descargable para Windows
                            </span>
                            <h1 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
                                ATSIT <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">Finanzas</span>
                            </h1>
                            <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                                Sistema de escritorio nativo para el control integral de obras, seguimiento de tareas, gestión de presupuestos, desglose de Neto + IVA (19%) y generación de informes ejecutivos en PDF y Excel.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-10">
                                {["Windows (.exe)", "macOS (.dmg)", "Electron Nativo", "SQLite Offline", "PDF & Excel"].map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Download Action Card */}
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                                        <Clock size={12} /> Prueba Gratis 15 Días
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                                        <Monitor size={12} /> Windows & macOS
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Descargar ATSIT Finanzas</h3>
                                <p className="text-slate-300 text-sm font-medium mb-6 leading-relaxed">
                                    Elige la versión adecuada para tu sistema operativo. Incluye 15 días de prueba completa sin restricciones.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href="https://github.com/pdiazg46-design/ATSIT-Finanzas/releases/download/v1.0.0/ATSIT-Finanzas-Setup-1.0.0.exe"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-black px-7 py-4 rounded-2xl shadow-xl shadow-purple-500/25 transition-all transform hover:scale-[1.02] active:scale-95 text-sm"
                                    >
                                        <Zap size={18} className="fill-white" />
                                        Descargar Windows (.exe)
                                    </a>
                                    <a
                                        href="https://github.com/pdiazg46-design/ATSIT-Finanzas/releases/download/v1.0.0/ATSIT-Finanzas-Mac-1.0.0.dmg"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border border-white/20 font-black px-7 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-sm"
                                    >
                                        <DownloadCloud size={18} />
                                        Descargar Mac (.dmg)
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-purple-500/20 blur-[120px] -z-10" />
                            <div className="rounded-[2.5rem] p-3 bg-white/5 border border-white/10 shadow-2xl">
                                <img
                                    src="/projects/atsit-finanzas-desktop.jpg"
                                    alt="ATSIT Finanzas Software"
                                    className="rounded-[2rem] shadow-2xl border border-white/5 w-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Módulos */}
                    <h2 className="text-4xl font-black mb-16 tracking-tight text-center">Ingeniería Financiera & Control de Obras</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        <ModuleCard
                            icon={<BarChart3 className="text-purple-400" />}
                            title="Control de Obras & Presupuestos"
                            desc="Administración centralizada de proyectos, presupuesto estimado vs ejecutado y cálculo del margen de ganancia en tiempo real."
                        />
                        <ModuleCard
                            icon={<ShieldCheck className="text-indigo-400" />}
                            title="Desglose Fiscal de IVA (19%)"
                            desc="Cálculo automático de Neto e IVA en facturas y boletas para un control exacto de Débito y Crédito Fiscal mensual."
                        />
                        <ModuleCard
                            icon={<Database className="text-cyan-400" />}
                            title="Base de Datos Nativa SQLite"
                            desc="Almacenamiento local ultrarrápido y seguro. Permite operar al 100% en terreno sin requerir conexión a internet."
                        />
                    </div>

                    {/* Tech & Capabilities */}
                    <div className="bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-950 rounded-[3rem] p-12 md:p-20 border border-purple-500/20 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <Building2 size={250} />
                        </div>
                        <div className="max-w-3xl relative z-10">
                            <h2 className="text-4xl font-black mb-10 tracking-tight">Capacidades del Sistema</h2>
                            <div className="space-y-8">
                                <CapabilityRow
                                    icon={<FileText className="text-purple-400" size={24} />}
                                    title="Informes en PDF & Excel"
                                    desc="Exportación inmediata de balances de flujo de caja, estado de obras y auditoría de IVA para contabilidad y clientes."
                                />
                                <CapabilityRow
                                    icon={<Users className="text-indigo-400" size={24} />}
                                    title="Gestión de Personal & Equipos"
                                    desc="Registro de empleados, asignación de responsables por obra y trazabilidad completa de costos operativos de mano de obra."
                                />
                                <CapabilityRow
                                    icon={<Building2 className="text-cyan-400" size={24} />}
                                    title="Personalización de Marca Corporativa"
                                    desc="Adaptación de logo de empresa y datos institucionales en la interfaz y en todos los reportes membretados emitidos."
                                />
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

function CapabilityRow({ icon, title, desc }: any) {
    return (
        <div className="flex gap-6 items-start">
            <div className="shrink-0 mt-1 p-2 rounded-xl bg-white/5 border border-white/10">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-xl mb-1 text-white">{title}</h4>
                <p className="text-slate-300 font-medium">{desc}</p>
            </div>
        </div>
    );
}
