import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AT-SIT | Portafolio Tecnológico",
    description: "Desarrollo de Aplicaciones Científicas y Soluciones de Alto Impacto",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className="antialiased">{children}</body>
        </html>
    );
}
