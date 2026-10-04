/**
 * ui-modal.js - Sistema Universal de Modales y Notificaciones Elegantes
 * Reemplaza los diálogos nativos 'alert()' y 'confirm()' del navegador
 * con tarjetas modales modernas, profesionales y ergonómicas.
 */

(function () {
  // Inyectar estilos CSS para modales y toasts si no existen
  const styleId = 'custom-dialog-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .cd-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.78);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        padding: 16px;
      }
      .cd-overlay.cd-open {
        opacity: 1;
        pointer-events: auto;
      }
      .cd-card {
        background: #1e293b;
        color: #f8fafc;
        width: 100%;
        max-width: 440px;
        border-radius: 16px;
        border: 1px solid #334155;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
        padding: 24px;
        transform: scale(0.94) translateY(10px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        gap: 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .cd-overlay.cd-open .cd-card {
        transform: scale(1) translateY(0);
      }
      .cd-header {
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }
      .cd-icon-box {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        flex-shrink: 0;
      }
      .cd-icon-info { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
      .cd-icon-success { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
      .cd-icon-warning { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
      .cd-icon-danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }

      .cd-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .cd-title {
        font-size: 17px;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: #f1f5f9;
        margin: 0;
      }
      .cd-message {
        font-size: 13px;
        line-height: 1.5;
        color: #94a3b8;
        margin: 0;
        white-space: pre-line;
      }
      .cd-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 8px;
      }
      .cd-btn {
        padding: 10px 18px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        border: none;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      .cd-btn:active {
        transform: scale(0.97);
      }
      .cd-btn-primary {
        background: #0284c7;
        color: #ffffff;
      }
      .cd-btn-primary:hover {
        background: #0369a1;
      }
      .cd-btn-success {
        background: #10b981;
        color: #ffffff;
      }
      .cd-btn-success:hover {
        background: #059669;
      }
      .cd-btn-danger {
        background: #ef4444;
        color: #ffffff;
      }
      .cd-btn-danger:hover {
        background: #dc2626;
      }
      .cd-btn-cancel {
        background: #334155;
        color: #cbd5e1;
      }
      .cd-btn-cancel:hover {
        background: #475569;
        color: #f8fafc;
      }

      /* TOAST NOTIFICATION CORNER */
      .cd-toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 100000;
        pointer-events: none;
      }
      .cd-toast {
        pointer-events: auto;
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid #334155;
        padding: 12px 18px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        font-weight: 600;
        min-width: 280px;
        transform: translateX(120%);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: inherit;
      }
      .cd-toast.cd-toast-show {
        transform: translateX(0);
      }
    `;
    document.head.appendChild(style);
  }

  // Elementos singleton
  let activeModalResolve = null;

  function createModalDOM() {
    if (document.getElementById('cd-universal-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cd-universal-modal';
    overlay.className = 'cd-overlay';
    overlay.innerHTML = `
      <div class="cd-card" id="cd-card" role="dialog" aria-modal="true">
        <div class="cd-header">
          <div class="cd-icon-box" id="cd-icon">🔔</div>
          <div class="cd-body" style="flex: 1;">
            <h3 class="cd-title" id="cd-title">Notificación</h3>
            <p class="cd-message" id="cd-message">Mensaje del sistema</p>
            <div id="cd-input-wrapper" style="display:none; margin-top:10px;">
              <input type="text" id="cd-input" placeholder="Ingrese el valor..." style="width:100%; padding:10px 14px; background:#0f172a; border:2px solid #2563eb; border-radius:10px; color:#ffffff; font-size:15px; font-weight:700; outline:none; font-family:inherit; box-sizing:border-box;">
            </div>
          </div>
        </div>
        <div class="cd-actions" id="cd-actions">
          <button class="cd-btn cd-btn-cancel" id="cd-btn-cancel" style="display:none;">Cancelar</button>
          <button class="cd-btn cd-btn-primary" id="cd-btn-confirm">Entendido</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const toastContainer = document.createElement('div');
    toastContainer.id = 'cd-toast-container';
    toastContainer.className = 'cd-toast-container';
    document.body.appendChild(toastContainer);

    // Eventos de botones
    const cancelBtn = document.getElementById('cd-btn-cancel');
    const confirmBtn = document.getElementById('cd-btn-confirm');
    const inputEl = document.getElementById('cd-input');

    cancelBtn.addEventListener('click', () => {
      closeModal(false);
    });

    confirmBtn.addEventListener('click', () => {
      closeModal(true);
    });

    if (inputEl) {
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          closeModal(true);
        }
      });
    }

    // Cerrar con Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('cd-universal-modal');
        if (modal && modal.classList.contains('cd-open')) {
          closeModal(false);
        }
      }
    });
  }

  function closeModal(result) {
    const overlay = document.getElementById('cd-universal-modal');
    const inputWrap = document.getElementById('cd-input-wrapper');
    const inputEl = document.getElementById('cd-input');

    let finalValue = result;
    if (result === true && inputWrap && inputWrap.style.display !== 'none') {
      finalValue = inputEl ? inputEl.value : '';
    } else if (result === false) {
      finalValue = null;
    }

    if (inputWrap) inputWrap.style.display = 'none';

    if (overlay) {
      overlay.classList.remove('cd-open');
    }
    if (activeModalResolve) {
      const res = activeModalResolve;
      activeModalResolve = null;
      res(finalValue);
    }
  }

  /**
   * Muestra un modal de ingreso de datos (Prompt) elegante
   * @param {string} message - Texto explicativo
   * @param {string} defaultValue - Valor por defecto en el input
   * @param {object} options - { title, icon, confirmText, cancelText, placeholder }
   */
  window.showCustomPrompt = function (message, defaultValue = '', options = {}) {
    createModalDOM();
    return new Promise((resolve) => {
      activeModalResolve = resolve;
      const overlay = document.getElementById('cd-universal-modal');
      const iconEl = document.getElementById('cd-icon');
      const titleEl = document.getElementById('cd-title');
      const msgEl = document.getElementById('cd-message');
      const inputWrap = document.getElementById('cd-input-wrapper');
      const inputEl = document.getElementById('cd-input');
      const confirmBtn = document.getElementById('cd-btn-confirm');
      const cancelBtn = document.getElementById('cd-btn-cancel');

      iconEl.className = 'cd-icon-box cd-icon-info';
      iconEl.innerHTML = options.icon || '✏️';

      titleEl.innerText = options.title || 'Ingreso de Datos';
      msgEl.innerText = message.replace(/^[✅⚠️❌ℹ️✏️]\s*/, '');

      if (inputWrap && inputEl) {
        inputWrap.style.display = 'block';
        inputEl.value = defaultValue || '';
        inputEl.placeholder = options.placeholder || 'Ingrese valor...';
      }

      cancelBtn.style.display = 'inline-flex';
      cancelBtn.innerText = options.cancelText || 'Cancelar';

      confirmBtn.className = 'cd-btn cd-btn-primary';
      confirmBtn.innerText = options.confirmText || 'Aceptar';

      overlay.classList.add('cd-open');

      setTimeout(() => {
        if (inputEl) {
          inputEl.focus();
          inputEl.select();
        }
      }, 60);
    });
  };

  /**
   * Muestra un modal de alerta elegante
   * @param {string} message - Texto principal
   * @param {object} options - { title, type: 'info'|'success'|'warning'|'danger', btnText }
   */
  window.showCustomAlert = function (message, options = {}) {
    createModalDOM();
    return new Promise((resolve) => {
      activeModalResolve = resolve;
      const overlay = document.getElementById('cd-universal-modal');
      const iconEl = document.getElementById('cd-icon');
      const titleEl = document.getElementById('cd-title');
      const msgEl = document.getElementById('cd-message');
      const confirmBtn = document.getElementById('cd-btn-confirm');
      const cancelBtn = document.getElementById('cd-btn-cancel');

      const type = options.type || (message.includes('✅') ? 'success' : (message.includes('⚠️') || message.includes('Atención')) ? 'warning' : 'info');
      
      iconEl.className = `cd-icon-box cd-icon-${type}`;
      if (type === 'success') {
        iconEl.innerHTML = '✓';
      } else if (type === 'danger') {
        iconEl.innerHTML = '✕';
      } else if (type === 'warning') {
        iconEl.innerHTML = '⚠️';
      } else {
        iconEl.innerHTML = 'ℹ️';
      }

      titleEl.innerText = options.title || (type === 'success' ? 'Operación Exitosa' : type === 'warning' ? 'Advertencia' : type === 'danger' ? 'Atención Requerida' : 'Notificación');
      msgEl.innerText = message.replace(/^[✅⚠️❌ℹ️]\s*/, '');
      
      cancelBtn.style.display = 'none';
      confirmBtn.className = `cd-btn cd-btn-${type === 'danger' ? 'danger' : type === 'success' ? 'success' : 'primary'}`;
      confirmBtn.innerText = options.btnText || 'Aceptar';

      overlay.classList.add('cd-open');
      confirmBtn.focus();
    });
  };

  /**
   * Muestra un modal de confirmación elegante
   * @param {string} message - Texto de la pregunta
   * @param {object} options - { title, type, confirmText, cancelText }
   */
  window.showCustomConfirm = function (message, options = {}) {
    createModalDOM();
    return new Promise((resolve) => {
      activeModalResolve = resolve;
      const overlay = document.getElementById('cd-universal-modal');
      const iconEl = document.getElementById('cd-icon');
      const titleEl = document.getElementById('cd-title');
      const msgEl = document.getElementById('cd-message');
      const confirmBtn = document.getElementById('cd-btn-confirm');
      const cancelBtn = document.getElementById('cd-btn-cancel');

      const isDestructive = options.type === 'danger' || message.toUpperCase().includes('BORRAR') || message.toUpperCase().includes('ELIMINAR');
      const type = options.type || (isDestructive ? 'danger' : 'warning');

      iconEl.className = `cd-icon-box cd-icon-${type}`;
      iconEl.innerHTML = type === 'danger' ? '🗑️' : '❓';

      titleEl.innerText = options.title || (type === 'danger' ? 'Confirmar Acción Crítica' : 'Confirmación');
      
      let cleanMsg = message.replace(/^¿?(ATENCIÓN:\s*)?/, '').trim();
      if (!cleanMsg.endsWith('?')) cleanMsg += '?';
      msgEl.innerText = cleanMsg;

      cancelBtn.style.display = 'inline-flex';
      cancelBtn.innerText = options.cancelText || 'Cancelar';

      confirmBtn.className = `cd-btn cd-btn-${type === 'danger' ? 'danger' : 'primary'}`;
      confirmBtn.innerText = options.confirmText || (type === 'danger' ? 'Sí, reiniciar sistema' : 'Aceptar');

      overlay.classList.add('cd-open');
      confirmBtn.focus();
    });
  };

  /**
   * Muestra un Toast ligero y no intrusivo en la esquina
   */
  window.showToast = function (message, type = 'info') {
    createModalDOM();
    const container = document.getElementById('cd-toast-container');
    if (!container) return;

    // Si ya existe un toast con el mismo mensaje, no duplicarlo en ráfaga
    const existing = Array.from(container.children);
    if (existing.some(el => el.innerText.includes(message.replace(/^[✅⚠️❌ℹ️📱]\s*/, '')))) {
      return;
    }

    // Mantener máximo 2 toasts visibles para no tapar la pantalla
    while (container.children.length >= 2) {
      container.removeChild(container.firstChild);
    }

    const toast = document.createElement('div');
    toast.className = 'cd-toast';
    
    let icon = '🔔';
    let borderColor = '#38bdf8';
    if (type === 'success' || message.includes('✅')) {
      icon = '✅';
      borderColor = '#10b981';
    } else if (type === 'danger' || message.includes('❌')) {
      icon = '❌';
      borderColor = '#ef4444';
    } else if (type === 'warning' || message.includes('⚠️')) {
      icon = '⚠️';
      borderColor = '#f59e0b';
    }

    toast.style.borderLeft = `4px solid ${borderColor}`;
    toast.innerHTML = `<span>${icon}</span> <span>${message.replace(/^[✅⚠️❌ℹ️]\s*/, '')}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('cd-toast-show');
    });

    setTimeout(() => {
      toast.classList.remove('cd-toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // Interfaz de compatibilidad UIModal
  window.UIModal = {
    alert: function (optOrMsg) {
      if (typeof optOrMsg === 'string') {
        return window.showCustomAlert(optOrMsg);
      } else if (optOrMsg && typeof optOrMsg === 'object') {
        return window.showCustomAlert(optOrMsg.message || '', {
          title: optOrMsg.title,
          type: optOrMsg.type || 'info',
          btnText: optOrMsg.btnText || optOrMsg.confirmText
        });
      }
    },
    confirm: function (optOrMsg) {
      if (typeof optOrMsg === 'string') {
        return window.showCustomConfirm(optOrMsg);
      } else if (optOrMsg && typeof optOrMsg === 'object') {
        return window.showCustomConfirm(optOrMsg.message || '', {
          title: optOrMsg.title,
          type: optOrMsg.type || 'warning',
          confirmText: optOrMsg.confirmText,
          cancelText: optOrMsg.cancelText
        });
      }
    },
    prompt: function (optOrMsg, defaultVal) {
      if (typeof optOrMsg === 'string') {
        return window.showCustomPrompt(optOrMsg, defaultVal);
      } else if (optOrMsg && typeof optOrMsg === 'object') {
        return window.showCustomPrompt(optOrMsg.message || '', optOrMsg.defaultValue || defaultVal || '', {
          title: optOrMsg.title,
          icon: optOrMsg.icon,
          confirmText: optOrMsg.confirmText || optOrMsg.btnText,
          cancelText: optOrMsg.cancelText,
          placeholder: optOrMsg.placeholder
        });
      }
    },
    toast: function (msg, type) {
      return window.showToast(msg, type);
    }
  };

  // Reemplazar alert y prompt nativos por modales elegantes para eliminar "Esta página dice"
  window.alert = function (message) {
    window.showCustomAlert(String(message));
  };

  window.prompt = function (message, defaultValue) {
    return window.showCustomPrompt(String(message), defaultValue || '');
  };
})();
