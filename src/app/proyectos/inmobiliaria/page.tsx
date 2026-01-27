"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Map, ClipboardList, CreditCard, ShieldCheck, Zap, Layers } from "lucide-react";
import Link from "next/link";

export default function InmobiliariaDetail() {
    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
            <div className="mesh-gradient opacity-60" />

            {/* Nav Back */}
            <nav className="fixed top-0 w-full z-50 glass py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-600 transition-colors font-bold">
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
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-6">
                                Enterprise Real Estate Solution
                            </span>
                            <h1 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
                                Gestión <br />
                                <span className="text-indigo-600">Inmobiliaria Pro</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
                                Un ecosistema integral diseñado para centralizar la operación de activos inmobiliarios, desde la captación hasta la liquidación de contratos.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {["Next.js", "Prisma", "Leaflet", "PostgreSQL", "Google Maps Tiles"].map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600/70 text-xs font-bold uppercase tracking-widest">
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
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] -z-10" />
                            <img
                                src="/projects/inmobiliaria.png"
                                alt="Dashboard Preview"
                                className="rounded-[2.5rem] shadow-2xl border border-slate-100 w-full"
                            />
                        </motion.div>
                    </div>

                    {/* Módulos */}
                    <h2 className="text-4xl font-black mb-16 tracking-tight text-center">Arquitectura de Módulos</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        <ModuleCard
                            icon={<Map className="text-indigo-600" />}
                            title="Geo-Inteligencia"
                            desc="Visualización de activos en tiempo real con integración de capas de Google Maps y Leaflet para precisión absoluta."
                        />
                        <ModuleCard
                            icon={<ClipboardList className="text-violet-600" />}
                            title="Inventario Científico"
                            desc="Control estricto de ítems por propiedad, con estados de entrada/salida y registros fotográficos automatizados."
                        />
                        <ModuleCard
                            icon={<CreditCard className="text-cyan-600" />}
                            title="Motor Financiero"
                            desc="Automatización de cobros, generación de liquidaciones y seguimiento de deudas con KPIs de rendimiento."
                        />
                    </div>

                    {/* Tech & Capabilities */}
                    <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <Layers size={200} />
                        </div>
                        <div className="max-w-2xl relative z-10">
                            <h2 className="text-4xl font-black mb-10 tracking-tight">Capacidades de Producción</h2>
                            <div className="space-y-6">
                                <CapabilityRow title="Escalabilidad Cloud" desc="Desplegado en Vercel con bases de datos serverless para tráfico masivo." />
                                <CapabilityRow title="Seguridad de Datos" desc="Autenticación NextAuth con roles jerárquicos y cifrado de documentos legales." />
                                <CapabilityRow title="Generación de Reportes" desc="Exportación dinámica de PDFs y Excels con auditoría completa de movimientos." />
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
        <div className="p-10 rounded-[2.5rem] border border-indigo-50 bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8">
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
                <ShieldCheck className="text-indigo-400" size={24} />
            </div>
            <div>
                <h4 className="font-bold text-xl mb-1">{title}</h4>
                <p className="text-slate-400 font-medium">{desc}</p>
            </div>
        </div>
    );
}
