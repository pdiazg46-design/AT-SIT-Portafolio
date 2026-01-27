import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        // Envío real con Resend
        const { data, error } = await resend.emails.send({
            from: 'AT-SIT Portfolio <onboarding@resend.dev>',
            to: 'atsittelecom@gmail.com',
            subject: `Nueva Solicitud: ${name}`,
            text: `Has recibido un nuevo mensaje desde tu portafolio:\n\nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
            replyTo: email,
        });

        if (error) {
            console.error('Error de Resend:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { message: 'Mensaje enviado correctamente', id: data?.id },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error en API de contacto:', error);
        return NextResponse.json(
            { error: error.message || 'Error al procesar la solicitud' },
            { status: 500 }
        );
    }
}
