"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Brain, Film, Sparkles, Zap, Database, Cpu } from "lucide-react";
import Link from "next/link";

export default function DesfogaDetail() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent)] pointer-events-none" />

            {/* Nav Back */}
            <nav className="fixed top-0 w-full z-50 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/#desfoga" className="flex items-center gap-2 text-cyan-500/80 hover:text-cyan-400 transition-colors font-bold">
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
                            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                Generative AI & Cinema
                            </span>
                            <h1 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
                                Desfoga <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Studio AI</span>
                            </h1>
                            <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                                Una plataforma disruptiva que fusiona la IA generativa con el análisis cinematográfico para predecir el éxito de guiones y tendencias visuales.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {["Python", "OpenAI API", "PyTorch", "Next.js", "Gen AI"].map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest">
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
                            <div className="absolute inset-0 bg-cyan-500/20 blur-[120px] -z-10" />
                            <img
                                src="/projects/desfoga.png"
                                alt="AI Studio Preview"
                                className="rounded-[2.5rem] shadow-2xl border border-white/5 w-full"
                            />
                        </motion.div>
                    </div>

                    {/* Módulos */}
                    <h2 className="text-4xl font-black mb-16 tracking-tight text-center">IA de Última Generación</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        <ModuleCard
                            icon={<Brain className="text-cyan-400" />}
                            title="Análisis de Guiones"
                            desc="Modelos LLM personalizados que evalúan coherencia, arcos de personajes y potencial comercial de historias."
                        />
                        <ModuleCard
                            icon={<Sparkles className="text-purple-400" />}
                            title="Visual Storytelling"
                            desc="Generación de storyboards y conceptos visuales mediante difusión estable optimizados para producción."
                        />
                        <ModuleCard
                            icon={<Database className="text-blue-400" />}
                            title="Big Data Cinematográfico"
                            desc="Análisis de miles de películas para identificar patrones de éxito y micro-tendencias en la industria."
                        />
                    </div>

                    {/* Tech & Capabilities */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] p-12 md:p-20 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Cpu size={250} />
                        </div>
                        <div className="max-w-2xl relative z-10">
                            <h2 className="text-4xl font-black mb-10 tracking-tight">Ecosistema Gen AI</h2>
                            <div className="space-y-6">
                                <CapabilityRow title="Modelos Fine-tuned" desc="Uso de redes neuronales adaptadas específicamente para el lenguaje formal del cine." />
                                <CapabilityRow title="Procesamiento en Paralelo" desc="Infraestructura escalable que procesa volúmenes masivos de datos en segundos." />
                                <CapabilityRow title="Feedback Predictivo" desc="Sistemas que sugieren cambios en giros dramáticos para maximizar el engagement." />
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
                <Sparkles className="text-cyan-400" size={24} />
            </div>
            <div>
                <h4 className="font-bold text-xl mb-1 text-white">{title}</h4>
                <p className="text-slate-300 font-medium">{desc}</p>
            </div>
        </div>
    );
}
