# AT-SIT: Estrategia Global de Nube y Arquitectura de Dominios (Multi-Cloud)

Este documento define la estrategia inquebrantable a largo plazo para estructurar, desplegar y escalar las aplicaciones corporativas de AT-SIT bajo un ecosistema profesional unificado.

## 1. La Arquitectura de Dominios (Subdominios B2B)
Toda aplicación nueva o existente que se comercialice responderá a un único dominio raíz consolidado, creando ramas asimétricas que centralizan el poder de la marca:

*   **Dominio Matriz (Root):** `www.at-sit.cl` (Aloja el Portafolio/Agencia, manteniéndose en redes hiper-rápidas como Vercel o CDN puro).
*   **Convención B2B (Subdominios):** Los productos de software no contarán con dominios comprados individualmente; operarán bajo prefijos del ecosistema.
    *   Ejemplo SaaS Riesgos: `miperai.at-sit.cl`
    *   Ejemplo CRM: `crm.at-sit.cl`
    *   Ejemplo Inmobiliaria: `inmobiliaria.at-sit.cl`

**Regla de Negocio:** Esto proyecta una imagen unificada ("AT-SIT" como corporación matriz), ahorra la compra de 100 dominios individuales anualmente y permite derivar tráfico hacia distintas nubes sin que el usuario final note que cambió de servidor.

<br/>

## 2. Estrategia Multi-Cloud (Vercel + Azure)
Vercel es el hogar de la agilidad. Azure es el hogar de los contratos empresariales a gran escala.

1.  **Status Quo Inicial:** Todo proyecto actual que no genera gastos pasivos violentos permanecerá en Vercel. 
2.  **Transición a Azure (Event-Driven):** Los proyectos se migrarán a Microsoft Azure *únicamente* en el momento en que escalen a un nivel corporativo que exija certificaciones de seguridad, evitar timeouts en ejecución o requerir Single Sign-On (Entra ID).

<br/>

## 3. Playbook de Migración: "Zero-Downtime" (Cero Tiempo de Inactividad)
Cuando un ecosistema como MiperAI pase de Vercel a Azure, la transición debe ser quirúrgica e invisible para los operarios. Jamás se debe aplicar una técnica de "Apagar acá para prender allá".

### Paso A: Paralelismo y Docker
*   El código Next.js se extrae y "envasa" en contenedores **Docker**.
*   Se despliega el servidor nuevo en Azure (Azure App Service / Container Apps) de forma pasiva, operando en direcciones web ocultas temporales (`.azurewebsites.net`).

### Paso B: El Trasplante Acoplado (Bases de Datos)
*   Se clona/migra la base de datos (NeonDB) hacia **Azure Database for PostgreSQL**.
*   Cualquier entorno nuevo a partir de este punto apunta estricta y rígidamente hacia Azure para evitar bifurcación de datos ("Split-Brain").

### Paso C: Enroque de Tráfico (DNS Switch)
*   En el proveedor de dominios, se cambia el registro del subdominio (Ej: `miperai.at-sit.cl`) para que apunte a las IPs del servidor Azure.
*   Mientras el DNS global se propaga (lo cual tarda horas o días dependiendo del ISP), algunos dispositivos seguirán enviando peticiones a Vercel y otros caerán ya en el nuevo Azure. Ambos sistemas operarán fluidamente consultando y escribiendo en la base de datos central de Azure. Nadie experimentará una caída.

<br/>

## 4. Preservación Residual y Redirecciones
Existen clientes y trabajadores en faena que ya tienen direcciones atávicas (Ej: `xxxxxx.vercel.app`) almacenadas como marcadores o accesos directos de la PWA.

*   **Puentear, NO borrar:** Cuando una aplicación se muda a `miperai.at-sit.cl` en Azure, el proyecto espejo en Vercel NO se elimina inmediatamente.
*   **Redirección 301 Activa:** Se modifica el código fuente del proyecto antiguo en Vercel inyectando una regla `301 Permanent Redirect`. 
*   **El Efecto:** Cualquier persona que intente acceder por costumbre al enlace viejo de Vercel experimentará un rebote invisible; Vercel absorberá el golpe e instantáneamente lo escupirá hacia el nuevo protocolo seguro en Azure, forzando la actualización de sus barras de navegación sin perder operatividad.
*   *Muerte natural:* Solo tras una sequía total de varios meses en la analítica de Vercel, se desmilitarizará el proyecto original.
