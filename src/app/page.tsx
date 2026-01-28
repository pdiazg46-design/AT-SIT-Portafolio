"use client";

import { motion } from "framer-motion";
import { ExternalLink, Layers, Map, ShieldCheck, Zap, ArrowRight, Github, Mail, MessageCircle, FileSpreadsheet, Loader2, CheckCircle2, Cloud } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [year, setYear] = useState(2026);

    useEffect(() => {
        setYear(new Date().getFullYear());
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const whatsappNumber = "56993351620";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola%20AT-SIT,%20me%20gustaría%20saber%20más%20sobre%20vuestros%20servicios.`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
            <div className="mesh-gradient opacity-100" />

            {/* Floating WhatsApp Button */}
            <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-2xl shadow-2xl shadow-green-500/20 flex items-center justify-center group"
            >
                <MessageCircle size={32} className="fill-white" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 font-bold whitespace-nowrap">
                    Chat WhatsApp
                </span>
            </motion.a>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass py-3" : "py-6"}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                    >
                        <div className="group relative">
                            {/* Opción 1: Cápsula Premium (Por defecto ahora para máxima elegancia) */}
                            <div className="bg-slate-950 px-8 py-4 rounded-full border border-white/10 shadow-2xl transition-all duration-700 hover:border-indigo-500/50 group-hover:scale-[1.02] flex items-center justify-center">
                                <img
                                    src="/logo-atsit.png"
                                    alt="AT-SIT Logo"
                                    className="h-10 md:h-12 w-auto transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-10">
                        {["Proyectos", "Habilidades", "Contacto"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
                            Hablemos
                        </a>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-48 pb-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
                        <div className="max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
                            >
                                <Zap size={14} className="fill-indigo-600" />
                                Transformación Digital & IA para Pymes
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] text-slate-900"
                            >
                                Del Caos de Excel al <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500">
                                    Ecosistema Digital
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl font-medium"
                            >
                                Empoderamos a pequeños y medianos empresarios con herramientas digitales robustas e inteligencia artificial. Convertimos procesos manuales lentos en ecosistemas automatizados de alto rendimiento.
                            </motion.p>

                            {/* Excel to Reality Banner */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="bg-white/50 backdrop-blur-md border border-indigo-100/50 p-6 rounded-[2rem] flex items-center gap-6 mb-12 max-w-xl group relative overflow-hidden shadow-xl shadow-indigo-500/5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20 flex items-center justify-center shrink-0 relative z-10 transition-transform group-hover:scale-105">
                                    <FileSpreadsheet className="text-white" size={32} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/60">Evolución Estratégica</p>
                                    </div>
                                    <p className="text-lg font-black text-slate-900 leading-tight tracking-tight">
                                        Desde un <span className="text-indigo-600">Excel</span> pasamos a un <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Ecosistema Digital.</span>
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-5"
                            >
                                <a href="#proyectos" className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black text-center transition-all shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-2 group">
                                    Ver Proyectos <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-slate-50 px-10 py-5 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 text-slate-700">
                                    WhatsApp Directo
                                </a>
                            </motion.div>
                        </div>
                    </div>

                    {/* Background Visual Enhancements (Watermark Logo) */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-10 translate-x-1/4">
                        <img src="/logo-atsit.png" className="w-[1000px] h-auto grayscale blur-2xl" alt="" />
                    </div>
                </section>

                {/* Projects Section */}
                <section id="proyectos" className="py-32 relative bg-indigo-50/20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                            <div className="max-w-xl">
                                <h2 className="text-5xl font-black mb-6 tracking-tight text-slate-900">Proyectos de Élite</h2>
                                <p className="text-slate-600 text-lg font-medium">
                                    Sistemas de alta complejidad diseñados para el mundo real.
                                </p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <ProjectCard
                                id="inmobiliaria"
                                title="Gestión Inmobiliaria Pro"
                                desc="Control total de activos con geolocalización avanzada y administración legal automatizada."
                                tags={["Next.js", "Prisma", "Leaflet"]}
                                icon={<Map size={24} />}
                                color="indigo"
                                image="/projects/inmobiliaria.png"
                                href="/proyectos/inmobiliaria"
                            />
                            <ProjectCard
                                id="tangente"
                                title="Tangente Finance Pro"
                                desc="Dashboard financiero de alta precisión para el sector construcción y finanzas corporativas."
                                tags={["React", "Drizzle", "Fintech"]}
                                icon={<ShieldCheck size={24} />}
                                color="purple"
                                image="/projects/tangente.png"
                                href="/proyectos/tangente"
                            />
                            <ProjectCard
                                id="desfoga"
                                title="Desfoga Studio"
                                desc="Ecosistema de IA que predice tendencias cinematográficas mediante análisis de datos masivos."
                                tags={["Gen AI", "Python", "Cloud"]}
                                icon={<Layers size={24} />}
                                color="cyan"
                                image="/projects/desfoga.png"
                                href="/proyectos/desfoga"
                            />
                        </div>
                    </div>
                </section>

                {/* Evolution Infographic Section */}
                <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                                Del Caos de Excel a la <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                    Inteligencia en la Nube
                                </span>
                            </h2>
                            <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">
                                No importa la realidad de tu negocio actual. Construimos el puente hacia un ecosistema digital robusto y escalable.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connectors (Desktop only) */}
                            <div className="hidden md:block absolute top-1/2 left-[30%] right-[30%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-indigo-500/50 to-indigo-500/20 -translate-y-1/2 z-0" />

                            {/* Stage 1: Past */}
                            <motion.div
                                whileInView={{ opacity: [0, 1], x: [-30, 0] }}
                                className="relative z-10 bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl group hover:border-white/20 transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-slate-800 transition-colors">
                                    <FileSpreadsheet className="text-slate-500 group-hover:text-slate-400" size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">El Pasado: Excel Manual</h3>
                                <ul className="space-y-3 text-slate-400 font-medium">
                                    <li className="flex gap-2">✕ Carga de trabajo manual y lenta.</li>
                                    <li className="flex gap-2">✕ Alto riesgo de errores humanos.</li>
                                    <li className="flex gap-2">✕ Datos estáticos y aislados.</li>
                                    <li className="flex gap-2">✕ Sin visión en tiempo real.</li>
                                </ul>
                            </motion.div>

                            {/* Stage 2: Transition */}
                            <motion.div
                                whileInView={{ opacity: [0, 1], y: [30, 0] }}
                                className="relative z-10 bg-indigo-600 p-10 rounded-[3rem] shadow-2xl shadow-indigo-600/20 flex flex-col items-center justify-center text-center transform scale-110"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-pulse">
                                    <Zap className="text-white" size={40} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">Evolución AT-SIT</h3>
                                <p className="text-white/80 font-bold leading-relaxed">
                                    Integramos, normalizamos y migramos tus procesos hacia una arquitectura empresarial robusta.
                                </p>
                            </motion.div>

                            {/* Stage 3: Future */}
                            <motion.div
                                whileInView={{ opacity: [0, 1], x: [30, 0] }}
                                className="relative z-10 bg-white/5 border border-indigo-500/30 p-10 rounded-[3rem] backdrop-blur-xl group hover:bg-white/[0.08] transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-8 shadow-inner shadow-indigo-500/40">
                                    <Cloud className="text-indigo-400" size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">El Futuro: Ecosistema Cloud</h3>
                                <ul className="space-y-3 text-indigo-100 font-medium">
                                    <li className="flex gap-2 text-indigo-400">✓ Automatización total de procesos.</li>
                                    <li className="flex gap-2 text-indigo-400">✓ 100% integridad de datos.</li>
                                    <li className="flex gap-2 text-indigo-400">✓ Dashboards en tiempo real.</li>
                                    <li className="flex gap-2 text-indigo-400">✓ Base para Agentes Autónomos.</li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                <section id="habilidades" className="py-32 border-y border-indigo-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <h2 className="text-5xl font-black mb-10 leading-[1.1] text-slate-900 tracking-tight">
                                    Escuadrón de <br />
                                    <span className="text-indigo-600">Agentes Autónomos</span>
                                </h2>
                                <p className="text-slate-600 text-lg mb-12 leading-relaxed font-medium">
                                    Nuestros agentes de IA no solo generan código; resuelven problemas complejos con precisión estratégica y resultados medibles.
                                </p>

                                <div className="space-y-8">
                                    <SkillRow icon={<ShieldCheck className="text-indigo-600" />} title="Simplificador Técnico" desc="Abstracción total de complejidad y automatización de flujos de trabajo críticos." />
                                    <SkillRow icon={<Zap className="text-violet-600" />} title="Detective Debugging" desc="Análisis de causa raíz mediante método científico para errores persistentes." />
                                    <SkillRow icon={<Map className="text-cyan-600" />} title="Especialista en Mapas" desc="Implementación de cartografía híbrida de alta precisión con calibración inteligente." />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 relative">
                                <div className="absolute inset-0 bg-indigo-50/50 blur-[120px] -z-10" />
                                <div className="space-y-6">
                                    <StatCard value="99.9%" label="Disponibilidad" />
                                    <StatCard value="Auto" label="Escalado" />
                                </div>
                                <div className="space-y-6 mt-12">
                                    <StatCard value="AI" label="Native" />
                                    <StatCard value="100%" label="Precisión" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contacto" className="py-40 relative overflow-hidden bg-slate-900 text-white">
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <motion.div
                            whileInView={{ y: [20, 0], opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter">
                                ¿Elevamos tu <br /> estandar tecnológico?
                            </h2>
                            <p className="text-xl text-slate-400 mb-12 font-medium">
                                Transforma tu visión en una herramienta digital de alto impacto.
                            </p>

                            <div className="grid md:grid-cols-2 gap-12 items-start text-left">
                                <div className="space-y-8">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="relative glass-dark p-8 rounded-[2rem] border-white/10 overflow-hidden shadow-2xl">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                            <h3 className="text-2xl font-black mb-6 text-white tracking-tight">Canales <span className="text-indigo-400">Directos</span></h3>
                                            <div className="space-y-5">
                                                <a href="mailto:atsittelecom@gmail.com" className="flex items-center gap-4 text-slate-300 hover:text-indigo-400 transition-all group/item">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-indigo-500/50 group-hover/item:bg-indigo-500/10 transition-all">
                                                        <Mail size={20} className="text-indigo-400" />
                                                    </div>
                                                    <span className="font-medium">atsittelecom@gmail.com</span>
                                                </a>
                                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-green-400 transition-all group/item">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-green-500/50 group-hover/item:bg-green-500/10 transition-all">
                                                        <MessageCircle size={20} className="text-[#25D366]" />
                                                    </div>
                                                    <span className="font-medium">WhatsApp Chat</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <p className="text-slate-400 font-medium">
                                            "La tecnología no es solo código, es la clave para liberar el potencial de tu negocio."
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
                                    {status === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-8"
                                        >
                                            <CheckCircle2 size={64} className="text-green-500 mb-6" />
                                            <h3 className="text-2xl font-black text-slate-900 mb-2">¡Solicitud Enviada!</h3>
                                            <p className="text-slate-500 font-medium">Nos pondremos en contacto contigo lo antes posible.</p>
                                            <button
                                                onClick={() => setStatus('idle')}
                                                className="mt-8 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline"
                                            >
                                                Enviar otro mensaje
                                            </button>
                                        </motion.div>
                                    )}

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Nombre Completo</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Tu nombre..."
                                            className="w-full bg-slate-50 border border-indigo-50 rounded-2xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Correo Electrónico</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="ejemplo@correo.com"
                                            className="w-full bg-slate-50 border border-indigo-50 rounded-2xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Mensaje</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="¿Cómo podemos ayudarte?"
                                            className="w-full bg-slate-50 border border-indigo-50 rounded-2xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-5 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        {status === 'submitting' ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" /> Procesando...
                                            </>
                                        ) : (
                                            "Enviar Solicitud"
                                        )}
                                    </button>
                                    {status === 'error' && (
                                        <p className="text-red-500 text-xs font-bold text-center mt-2 uppercase tracking-tighter">Hubo un error al enviar. Reinténtalo.</p>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="bg-slate-950 p-4 rounded-[1.25rem] border border-white/5 shadow-xl">
                            <img src="/logo-atsit.png" alt="AT-SIT" className="h-10 w-auto" />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase opacity-70">Software Engineering Studio</p>
                    </div>
                    <div className="text-slate-400 text-[10px] font-bold text-center max-w-sm leading-relaxed uppercase tracking-wider">
                        © {year} AT-SIT INTEGRACIÓN TECNOLÓGICA. TRANSFORMACIÓN DIGITAL PARA EL CRECIMIENTO EMPRESARIAL.
                    </div>
                    <div className="flex items-center gap-6">
                        <Github size={20} className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
                        <a href="mailto:atsittelecom@gmail.com">
                            <Mail size={20} className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
                        </a>
                    </div>
                </div>
            </footer>
        </div >
    );
}

function ProjectCard({ title, desc, tags, icon, color, image, href, id }: any) {
    const colors: any = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white",
        purple: "text-violet-600 bg-violet-50 border-violet-100 group-hover:bg-violet-600 group-hover:text-white",
        cyan: "text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white"
    };

    return (
        <Link href={href}>
            <motion.div
                id={id}
                whileHover={{ y: -8 }}
                className="group rounded-[2.5rem] bg-white border border-indigo-100/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden flex flex-col h-full cursor-pointer"
            >
                <div className="h-64 overflow-hidden relative">
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent opacity-60" />
                </div>

                <div className="p-10 pt-6 flex flex-col flex-grow">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${colors[color]}`}>
                        {icon}
                    </div>
                    <h3 className="text-3xl font-black mb-4 tracking-tight text-slate-900">{title}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed mb-6 flex-grow">
                        {desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {tags.map((tag: any) => (
                            <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 opacity-100 transform translate-x-0 transition-all group-hover:translate-x-2">
                        Ver Detalles <ArrowRight size={16} />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

function SkillRow({ icon, title, desc }: any) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                {icon}
            </div>
            <div>
                <h4 className="font-black text-xl mb-1 text-slate-900 tracking-tight">{title}</h4>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function StatCard({ value, label }: any) {
    return (
        <div className="bg-white border border-indigo-50 p-10 rounded-[2.5rem] text-center shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
            <div className="text-5xl font-black text-indigo-600 mb-2 tracking-tighter">{value}</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo-400">{label}</div>
        </div>
    );
}
