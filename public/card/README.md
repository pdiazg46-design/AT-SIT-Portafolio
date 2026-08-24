# ⚡ VentoCard — Tarjeta de Presentación Digital Soberana

[![PWA Ready](https://img.shields.io/badge/PWA-100%25_Offline-0284c7?style=for-the-badge&logo=pwa)](https://pdiazg46-design.github.io/Ventocard/)
[![Zero Server](https://img.shields.io/badge/Arquitectura-Zero_Server-10b981?style=for-the-badge)](https://pdiazg46-design.github.io/Ventocard/)
[![OWASP Compliant](https://img.shields.io/badge/Ciberseguridad-OWASP_Top10-38bdf8?style=for-the-badge)](https://pdiazg46-design.github.io/Ventocard/)
[![vCard 3.0](https://img.shields.io/badge/Standard-vCard_3.0_(RFC_2426)-818cf8?style=for-the-badge)](https://pdiazg46-design.github.io/Ventocard/)

**VentoCard** es una aplicación web progresiva (PWA) de presentación digital, networking y libreta de contactos **100% autónoma, soberana y privada**. Diseñada con arquitectura **Zero-Server** (cero bases de datos externas, cero telemetría), funciona a la velocidad de la luz directamente desde el navegador de cualquier smartphone o computadora.

---

## 🌟 Características Principales

- 📇 **Código QR Dinámico de Alta Velocidad**:
  - **Modo Agenda Móvil (vCard Limpio)**: Reconocido instantáneamente por las cámaras nativas de Samsung, iPhone, Xiaomi y Google Pixel para guardar el contacto en la agenda del teléfono con 1 solo toque y sin conexión a internet.
  - **Modo Tarjeta Web App**: Comparte la experiencia interactiva con botones directos y visualización Bento.
- 💬 **Compartir Directo por WhatsApp**: Envía tu tarjeta digital a cualquier persona o grupo de WhatsApp con un mensaje preconfigurado y enlace de acceso en un clic.
- 📱 **Integración Total de Redes & WhatsApp Usernames**:
  - Soporte para nombres de usuario de **WhatsApp (`@usuario` o enlace directo)**.
  - Accesos de 1 toque a **TikTok, Instagram, LinkedIn, GitHub, Teléfono y Correo**.
- ➕ **Campos Dinámicos Ilimitados**:
  - Crea nuevas redes sociales y datos de contacto personalizados (*Threads, Telegram, Discord, RUT / DNI, Alias Bancario, Calendly, BeReal, etc.*) según tus necesidades.
- 📞 **Formato Automático de Teléfonos (+56 X XXXX XXXX)**:
  - Formateo inteligente en tiempo real según la norma chilena, garantizando enlaces limpios y legibilidad óptima.
- 🎤 **Motor de Voz Local NLP (Español)**:
  - Búsqueda y ejecución de comandos sin tocar la pantalla (*"Llamar a Patricio"*, *"WhatsApp a ATSIT"*, *"TikTok de Patricio"*, *"Compartir tarjeta de trabajo"*).
- 🗂️ **Directorio Bento & Copia de Seguridad Soberana**:
  - Libreta interna de contactos guardados con búsqueda predictiva en milisegundos.
  - Exportación e importación completa en formato JSON para transferir tus datos entre dispositivos con total privacidad.

---

## 🚀 Despliegue en GitHub Pages (Costo Cero)

1. Haz un fork o sube este repositorio a tu cuenta de GitHub.
2. Ve a **Settings** ➔ **Pages**.
3. En **Branch**, selecciona `main` (o `master`) y la carpeta `/ (root)`.
4. Haz clic en **Save**.
5. ¡Tu VentoCard estará disponible de forma pública y gratuita en:
   ```text
   https://pdiazg46-design.github.io/Ventocard/
   ```

---

## 📲 Instalación como App Nativa (PWA)

### En Android (Samsung Galaxy / Google Pixel):
1. Abre tu URL de VentoCard en Chrome.
2. Toca los tres puntos `⋮` arriba a la derecha.
3. Selecciona **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.

### En iOS (iPhone / iPad):
1. Abre tu URL en Safari.
2. Toca el botón de Compartir (icono cuadrado con flecha hacia arriba).
3. Selecciona **"Agregar al inicio"**.

---

## 🔒 Privacidad & Ciberseguridad Soberana

- **Sin Servidores Centrales**: Toda tu información personal reside exclusivamente en la memoria local encriptada de tu dispositivo (`localStorage`).
- **Sanitización Estricta Anti-XSS**: Protección y validación rigurosa de entradas y URLs contra ataques de inyección.
- **Checksum Criptográfico**: Detección determinista de alteraciones en las cargas útiles compartidas.

---

## 👨‍💻 Créditos & Desarrollo

Desarrollado con excelencia técnica y arquitectura de alta eficiencia por **ATSIT**.
