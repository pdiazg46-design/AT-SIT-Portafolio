import type { Metadata } from 'next';
import MiMascotaLandingClient from './client';

export const metadata: Metadata = {
  title: 'Mi Mascota PWA — Hoja de Vida Médica Digital 100% Offline',
  description: 'Carnet clínico digital para perros, gatos y mascotas. Control de vacunas, fechas límite, historial de peso y certificados oficiales timbrados. Sin internet, sin suscripciones.',
  openGraph: {
    title: '🐾 Mi Mascota — Carnet Médico Digital de Mascotas',
    description: '100% Privado en tu celular. Guarda vacunas, desparasitaciones, peso y certificados oficiales para viajar o fiscalizaciones.',
    url: 'https://www.atsit.cl/mi-mascota',
    siteName: 'AT-SIT',
    images: [
      {
        url: 'https://www.atsit.cl/mascota/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Mi Mascota PWA',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi Mascota PWA — Hoja de Vida Médica',
    description: 'Carnet de salud animal 100% privado en tu teléfono.',
    images: ['https://www.atsit.cl/mascota/icon-512.png'],
  },
};

export default function MiMascotaPage() {
  return <MiMascotaLandingClient />;
}
