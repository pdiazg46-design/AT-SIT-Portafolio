/**
 * DEMO 2 - Motor de Estado, Sincronización y Recetas
 * Cliente: MCMplus SpA - Sabor Al Paso (Terrapuerto Calama)
 * Desarrollo: ATSIT (Patricio Díaz)
 */

(function () {
    const STORAGE_KEY_PRODUCTS = 'mcm_pos_products_v2';
    const STORAGE_KEY_ORDERS = 'mcm_pos_orders_v2';
    const STORAGE_KEY_SALES = 'mcm_pos_sales_v2';
    const STORAGE_KEY_INVENTORY = 'mcm_pos_inventory_v2';
    const STORAGE_KEY_CATEGORIES = 'mcm_pos_categories_v2';
    const STORAGE_KEY_SUPPLIERS = 'mcm_pos_suppliers_v2';
    const STORAGE_KEY_PURCHASES = 'mcm_pos_purchases_v2';
    const STORAGE_KEY_USERS = 'mcm_pos_users_v2';
    const STORAGE_KEY_AUDIT = 'mcm_pos_audit_v2';
    const STORAGE_KEY_SESSION = 'mcm_pos_session_v2';
    const CHANNEL_NAME = 'mcm_pos_realtime_channel';

    // Usuarios por defecto (Roles: ADMIN, CAJA, MESERA, COCINA)
    const DEFAULT_USERS = [
        { id: 'u_pato', username: 'pato', name: 'Pato', role: 'ADMIN', password: 'Pato8249', active: true, createdAt: '2026-10-02T10:00:00.000Z' },
        { id: 'u_admin', username: 'admin', name: 'Administrador General', role: 'ADMIN', password: '123', active: true, createdAt: '2026-09-30T10:00:00.000Z' },
        { id: 'u_caja', username: 'cajero', name: 'María Cajera', role: 'CAJA', password: '123', active: true, createdAt: '2026-09-30T10:00:00.000Z' },
        { id: 'u_mesera', username: 'mesera', name: 'Camila Garzón', role: 'MESERA', password: '123', active: true, createdAt: '2026-09-30T10:00:00.000Z' },
        { id: 'u_cocina', username: 'cocina', name: 'Chef Carlos', role: 'COCINA', password: '123', active: true, createdAt: '2026-09-30T10:00:00.000Z' }
    ];

    // Categorías por defecto
    const DEFAULT_CATEGORIES = ['Combos', 'Hamburguesas', 'Acompañamientos', 'Bebidas', 'Cafetería', 'Postres'];

    // Proveedores por defecto
    const DEFAULT_SUPPLIERS = [
        { id: 'sup_1', rut: '76.123.456-7', name: 'Distribuidora Sopraval', contact: 'Juan Pérez', phone: '+56 9 9123 4567', email: 'ventas@sopraval.cl' },
        { id: 'sup_2', rut: '77.890.123-4', name: 'Agrosuper Calama', contact: 'María González', phone: '+56 9 8765 4321', email: 'calama@agrosuper.cl' },
        { id: 'sup_3', rut: '96.543.210-9', name: 'Coca-Cola Andina', contact: 'Servicio Cliente', phone: '+56 2 2456 7890', email: 'pedidos@andina.cl' }
    ];

    // BroadcastChannel para sincronización instantánea entre pestañas / celulares en la misma red
    const broadcast = new BroadcastChannel(CHANNEL_NAME);

    // Productos iniciales por defecto (Sabor Al Paso - Terrapuerto Calama)
    const DEFAULT_PRODUCTS = [
        {
            id: 'p1',
            code: 'CM01',
            name: 'Combo Mechada Copiapina',
            category: 'Combos',
            price: 7490,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            description: 'Carne mechada de res, palta molida, papas rústicas y bebida 350cc.',
            removableIngredients: ['Carne Mechada', 'Palta', 'Papas Rústicas', 'Bebida', 'Hielo'],
            recipe: [
                { ingredientId: 'ing_mechada', amount: 0.150, unit: 'kg' },
                { ingredientId: 'ing_pan', amount: 1, unit: 'un' },
                { ingredientId: 'ing_palta', amount: 0.080, unit: 'kg' },
                { ingredientId: 'ing_papas', amount: 0.200, unit: 'kg' },
                { ingredientId: 'ing_bebida', amount: 1, unit: 'un' }
            ]
        },
        {
            id: 'p2',
            code: 'CM02',
            name: 'Combo Doble Terrapuerto',
            category: 'Combos',
            price: 6990,
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
            description: 'Doble carne 120g, queso cheddar fundido, papas rústicas y bebida.',
            removableIngredients: ['Doble Carne', 'Queso Cheddar', 'Papas Rústicas', 'Bebida', 'Hielo'],
            recipe: [
                { ingredientId: 'ing_carne', amount: 0.240, unit: 'kg' },
                { ingredientId: 'ing_pan', amount: 1, unit: 'un' },
                { ingredientId: 'ing_cheddar', amount: 0.040, unit: 'kg' },
                { ingredientId: 'ing_papas', amount: 0.200, unit: 'kg' },
                { ingredientId: 'ing_bebida', amount: 1, unit: 'un' }
            ]
        },
        {
            id: 'p3',
            code: 'HB01',
            name: 'Hamburguesa Clásica',
            category: 'Hamburguesas',
            price: 4490,
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
            description: 'Carne 120g, lechuga fresca, tomate casero y salsa especial.',
            removableIngredients: ['Carne 120g', 'Pan Frika', 'Lechuga', 'Tomate', 'Salsa Especial'],
            recipe: [
                { ingredientId: 'ing_carne', amount: 0.120, unit: 'kg' },
                { ingredientId: 'ing_pan', amount: 1, unit: 'un' },
                { ingredientId: 'ing_lechuga', amount: 0.030, unit: 'kg' },
                { ingredientId: 'ing_tomate', amount: 0.040, unit: 'kg' }
            ]
        },
        {
            id: 'p4',
            code: 'HB02',
            name: 'Burger Doble Cheddar',
            category: 'Hamburguesas',
            price: 5490,
            image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
            description: 'Doble carne rústica de 120g con doble queso cheddar fundido.',
            removableIngredients: ['Doble Carne', 'Pan Frika', 'Queso Cheddar'],
            recipe: [
                { ingredientId: 'ing_carne', amount: 0.240, unit: 'kg' },
                { ingredientId: 'ing_pan', amount: 1, unit: 'un' },
                { ingredientId: 'ing_cheddar', amount: 0.050, unit: 'kg' }
            ]
        },
        {
            id: 'p5',
            code: 'AC01',
            name: 'Papas Rústicas Medianas',
            category: 'Acompañamientos',
            price: 2490,
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
            description: 'Papas fritas corte rústico sazonadas con sal de mar.',
            removableIngredients: ['Sal de Mar', 'Salsas'],
            recipe: [
                { ingredientId: 'ing_papas', amount: 0.250, unit: 'kg' }
            ]
        },
        {
            id: 'p6',
            code: 'BE01',
            name: 'Bebida Lata 350cc',
            category: 'Bebidas',
            price: 1500,
            image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
            description: 'Coca-Cola, Fanta, Sprite o Zero bien fría.',
            removableIngredients: ['Hielo'],
            recipe: [
                { ingredientId: 'ing_bebida', amount: 1, unit: 'un' }
            ]
        },
        {
            id: 'p7',
            code: 'CF01',
            name: 'Café Espresso / Americano',
            category: 'Cafetería',
            price: 1800,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
            description: 'Café de grano recién molido en máquina express.',
            removableIngredients: ['Azúcar', 'Endulzante'],
            recipe: [
                { ingredientId: 'ing_cafe', amount: 0.015, unit: 'kg' }
            ]
        }
    ];

    // Insumos iniciales (Inventario base Terrapuerto Calama)
    const DEFAULT_INVENTORY = [
        { id: 'ing_mechada', name: 'Carne Mechada de Res', stock: 25.0, unit: 'kg', minStock: 5.0, costPerUnit: 8500 },
        { id: 'ing_carne', name: 'Carne Molida Hamburguesa', stock: 40.0, unit: 'kg', minStock: 8.0, costPerUnit: 6200 },
        { id: 'ing_pan', name: 'Pan Frika Artesanal', stock: 150, unit: 'un', minStock: 30, costPerUnit: 250 },
        { id: 'ing_palta', name: 'Palta Hass Molida', stock: 12.0, unit: 'kg', minStock: 3.0, costPerUnit: 4500 },
        { id: 'ing_papas', name: 'Papas Rústicas Pre-fritas', stock: 50.0, unit: 'kg', minStock: 10.0, costPerUnit: 1800 },
        { id: 'ing_cheddar', name: 'Queso Cheddar Láminas', stock: 8.0, unit: 'kg', minStock: 2.0, costPerUnit: 7200 },
        { id: 'ing_lechuga', name: 'Lechuga Fresca', stock: 6.0, unit: 'kg', minStock: 1.5, costPerUnit: 1200 },
        { id: 'ing_tomate', name: 'Tomate de Ensalada', stock: 8.0, unit: 'kg', minStock: 2.0, costPerUnit: 1500 },
        { id: 'ing_bebida', name: 'Bebidas Lata 350cc Variadas', stock: 120, unit: 'un', minStock: 24, costPerUnit: 650 },
        { id: 'ing_cafe', name: 'Café en Grano Premium', stock: 5.0, unit: 'kg', minStock: 1.0, costPerUnit: 14000 }
    ];

    // Métodos helper de almacenamiento
    function loadData(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            console.error('Error cargando storage:', key, e);
            return fallback;
        }
    }

    function saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error guardando storage:', key, e);
        }
    }

    // Listado de callbacks escuchando eventos en tiempo real
    const realtimeListeners = [];

    function notifyListeners(data) {
        try { broadcast.postMessage(data); } catch (e) {}
        realtimeListeners.forEach(cb => {
            try { cb(data); } catch (e) {}
        });
    }

    function handleIncomingServerEvent(data) {
        if (!data) return;
        if (data.type === 'NEW_MESERA_ORDER' && data.order) {
            const orders = loadData(STORAGE_KEY_ORDERS, []);
            const idx = orders.findIndex(o => o.id === data.order.id || (o.tableNum === data.order.tableNum && o.status === 'PENDIENTE_PAGO'));
            if (idx !== -1) {
                orders[idx] = data.order;
            } else {
                orders.unshift(data.order);
            }
            saveData(STORAGE_KEY_ORDERS, orders);
        } else if (data.type === 'SALE_COMPLETED' && data.sale) {
            const sales = loadData(STORAGE_KEY_SALES, []);
            if (!sales.some(s => s.id === data.sale.id)) {
                sales.unshift(data.sale);
                saveData(STORAGE_KEY_SALES, sales);
            }
            if (data.pendingOrderId) {
                const orders = loadData(STORAGE_KEY_ORDERS, []).filter(o => o.id !== data.pendingOrderId);
                saveData(STORAGE_KEY_ORDERS, orders);
            }
        } else if (data.type === 'PRODUCTS_UPDATED' && data.products) {
            saveData(STORAGE_KEY_PRODUCTS, data.products);
        } else if (data.type === 'INVENTORY_UPDATED' && data.inventory) {
            saveData(STORAGE_KEY_INVENTORY, data.inventory);
        } else if (data.type === 'CATEGORIES_UPDATED' && data.categories) {
            saveData(STORAGE_KEY_CATEGORIES, data.categories);
        } else if (data.type === 'SUPPLIERS_UPDATED' && data.suppliers) {
            saveData(STORAGE_KEY_SUPPLIERS, data.suppliers);
        } else if (data.type === 'PURCHASE_COMPLETED' && data.purchases) {
            saveData(STORAGE_KEY_PURCHASES, data.purchases);
        }
        notifyListeners(data);
    }

    // Iniciar conexión SSE con el servidor HTTP para sincronización multicelular en la red local
    function initServerSync() {
        if (typeof window !== 'undefined') {
            if (window.EventSource) {
                try {
                    const evtSource = new EventSource('/api/events');
                    evtSource.onmessage = (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            handleIncomingServerEvent(data);
                        } catch (e) {}
                    };
                } catch (e) {}
            }

            fetch('/api/state')
                .then(r => r.json())
                .then(state => {
                    const localOrders = loadData(STORAGE_KEY_ORDERS, []);
                    
                    // Subir automáticamente al servidor cualquier pedido pendiente que estuviera guardado localmente
                    if (Array.isArray(localOrders) && localOrders.length > 0) {
                        localOrders.forEach(localOrd => {
                            if (localOrd && localOrd.status === 'PENDIENTE_PAGO') {
                                const serverHasIt = state.orders && state.orders.some(sOrd => sOrd.id === localOrd.id);
                                if (!serverHasIt) {
                                    fetch('/api/orders', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(localOrd)
                                    }).catch(() => {});
                                }
                            }
                        });
                    }

                    if (state.orders && state.orders.length > 0) {
                        const mergedOrders = [...state.orders];
                        if (Array.isArray(localOrders)) {
                            localOrders.forEach(lo => {
                                if (lo.status === 'PENDIENTE_PAGO' && !mergedOrders.some(mo => mo.id === lo.id)) {
                                    mergedOrders.unshift(lo);
                                }
                            });
                        }
                        saveData(STORAGE_KEY_ORDERS, mergedOrders);
                    } else if (localOrders.length > 0) {
                        saveData(STORAGE_KEY_ORDERS, localOrders);
                    }

                    if (state.sales && state.sales.length > 0) saveData(STORAGE_KEY_SALES, state.sales);
                    if (state.inventory && state.inventory.length > 0) saveData(STORAGE_KEY_INVENTORY, state.inventory);
                    if (state.products && state.products.length > 0) saveData(STORAGE_KEY_PRODUCTS, state.products);
                    if (state.categories && state.categories.length > 0) saveData(STORAGE_KEY_CATEGORIES, state.categories);
                    if (state.suppliers && state.suppliers.length > 0) saveData(STORAGE_KEY_SUPPLIERS, state.suppliers);
                    if (state.purchases && state.purchases.length > 0) saveData(STORAGE_KEY_PURCHASES, state.purchases);
                    notifyListeners({ type: 'SERVER_STATE_SYNCED' });
                })
                .catch(() => {});
        }
    }

    // Inicializar colecciones si no existen
    if (!localStorage.getItem(STORAGE_KEY_PRODUCTS)) saveData(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);
    if (!localStorage.getItem(STORAGE_KEY_INVENTORY)) saveData(STORAGE_KEY_INVENTORY, DEFAULT_INVENTORY);
    if (!localStorage.getItem(STORAGE_KEY_CATEGORIES)) saveData(STORAGE_KEY_CATEGORIES, DEFAULT_CATEGORIES);
    if (!localStorage.getItem(STORAGE_KEY_SUPPLIERS)) saveData(STORAGE_KEY_SUPPLIERS, DEFAULT_SUPPLIERS);
    if (!localStorage.getItem(STORAGE_KEY_PURCHASES)) saveData(STORAGE_KEY_PURCHASES, []);
    if (!localStorage.getItem(STORAGE_KEY_ORDERS)) saveData(STORAGE_KEY_ORDERS, []);
    if (!localStorage.getItem(STORAGE_KEY_SALES)) saveData(STORAGE_KEY_SALES, []);
    if (!localStorage.getItem(STORAGE_KEY_USERS)) saveData(STORAGE_KEY_USERS, DEFAULT_USERS);
    if (!localStorage.getItem(STORAGE_KEY_AUDIT)) saveData(STORAGE_KEY_AUDIT, []);

    initServerSync();

    window.POSStore = {
        // --- AUTENTICACIÓN, USUARIOS & AUDITORÍA ---
        getUsers() {
            let users = loadData(STORAGE_KEY_USERS, DEFAULT_USERS);
            const patoUser = users.find(u => u.username.toLowerCase() === 'pato');
            if (!patoUser) {
                users.unshift({
                    id: 'u_pato',
                    username: 'pato',
                    name: 'Pato',
                    role: 'ADMIN',
                    password: 'Pato8249',
                    active: true,
                    createdAt: '2026-10-02T10:00:00.000Z'
                });
                saveData(STORAGE_KEY_USERS, users);
            } else if (patoUser.password !== 'Pato8249' || patoUser.role !== 'ADMIN') {
                patoUser.password = 'Pato8249';
                patoUser.role = 'ADMIN';
                patoUser.active = true;
                saveData(STORAGE_KEY_USERS, users);
            }
            return users;
        },
        saveUsers(users) {
            saveData(STORAGE_KEY_USERS, users);
            notifyListeners({ type: 'USERS_UPDATED', users });
            fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(users)
            }).catch(() => {});
        },
        addUser(userData) {
            const users = this.getUsers();
            const newUser = {
                id: 'usr_' + Date.now(),
                username: userData.username.trim().toLowerCase(),
                name: userData.name.trim(),
                role: userData.role || 'MESERA',
                password: userData.password,
                active: userData.active !== false,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            this.saveUsers(users);
            this.addAuditLog('CREAR_USUARIO', `Creado usuario '${newUser.username}' (${newUser.name} - ${newUser.role})`);
            return newUser;
        },
        updateUser(userId, updatedData) {
            const users = this.getUsers();
            const idx = users.findIndex(u => u.id === userId);
            if (idx !== -1) {
                const currentUser = this.getCurrentUser();
                const targetUser = users[idx];
                if (targetUser.username.toLowerCase() === 'pato' && (!currentUser || currentUser.username.toLowerCase() !== 'pato')) {
                    return null; // Proteger superusuario pato de modificaciones externas
                }
                users[idx] = { ...users[idx], ...updatedData };
                this.saveUsers(users);
                this.addAuditLog('EDITAR_USUARIO', `Actualizado usuario '${users[idx].username}' (${users[idx].role})`);
                return users[idx];
            }
            return null;
        },
        deleteUser(userId) {
            const users = this.getUsers();
            const u = users.find(usr => usr.id === userId);
            if (!u) return false;
            if (u.username.toLowerCase() === 'admin' || u.username.toLowerCase() === 'pato') return false; // Proteger superadmin y pato
            const currentUser = this.getCurrentUser();
            if (u.username.toLowerCase() === 'pato' && (!currentUser || currentUser.username.toLowerCase() !== 'pato')) return false;
            const filtered = users.filter(usr => usr.id !== userId);
            this.saveUsers(filtered);
            this.addAuditLog('ELIMINAR_USUARIO', `Eliminado usuario '${u.username}' (${u.name})`);
            return true;
        },
        authenticate(username, password) {
            const users = this.getUsers();
            const cleanUser = (username || '').trim().toLowerCase();
            const match = users.find(u => u.username.toLowerCase() === cleanUser && u.password === password && u.active);
            if (match) {
                this.setCurrentUser(match);
                this.addAuditLog('INICIO_SESION', `Inicio de sesión exitoso en perfil ${match.role}`);
                return { success: true, user: match };
            }
            return { success: false, message: 'Usuario o contraseña incorrectos, o cuenta inactiva.' };
        },
        getCurrentUser() {
            try {
                const raw = sessionStorage.getItem(STORAGE_KEY_SESSION) || localStorage.getItem(STORAGE_KEY_SESSION);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        },
        setCurrentUser(user) {
            try {
                const sessionData = {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    loggedInAt: new Date().toISOString()
                };
                sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
                localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
                notifyListeners({ type: 'SESSION_CHANGED', user: sessionData });
            } catch (e) {}
        },
        logout() {
            const user = this.getCurrentUser();
            if (user) {
                this.addAuditLog('CIERRE_SESION', `Cierre de sesión de ${user.name}`);
            }
            sessionStorage.removeItem(STORAGE_KEY_SESSION);
            localStorage.removeItem(STORAGE_KEY_SESSION);
            notifyListeners({ type: 'SESSION_CHANGED', user: null });
        },
        getAuditLogs() {
            return loadData(STORAGE_KEY_AUDIT, []);
        },
        addAuditLog(action, details, userOverride = null) {
            const logs = this.getAuditLogs();
            const activeUser = userOverride || this.getCurrentUser() || { username: 'sistema', name: 'Sistema POS', role: 'SISTEMA' };
            const entry = {
                id: 'aud_' + Date.now() + '_' + Math.floor(Math.random()*1000),
                timestamp: new Date().toISOString(),
                username: activeUser.username,
                name: activeUser.name,
                role: activeUser.role,
                action: action,
                details: details
            };
            logs.unshift(entry);
            // Mantener últimos 500 registros
            if (logs.length > 500) logs.pop();
            saveData(STORAGE_KEY_AUDIT, logs);
            notifyListeners({ type: 'AUDIT_LOG_ADDED', entry });
            fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            }).catch(() => {});
            return entry;
        },
        // Categorías
        getCategories() {
            return loadData(STORAGE_KEY_CATEGORIES, DEFAULT_CATEGORIES);
        },
        saveCategories(categories) {
            saveData(STORAGE_KEY_CATEGORIES, categories);
            notifyListeners({ type: 'CATEGORIES_UPDATED', categories });
            fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categories)
            }).catch(e => console.warn('[POSStore] Servidor offline al guardar categorías:', e));
        },
        addCategory(categoryName) {
            const cats = this.getCategories();
            const trimmed = categoryName.trim();
            if (trimmed && !cats.includes(trimmed)) {
                cats.push(trimmed);
                this.saveCategories(cats);
            }
            return cats;
        },
        deleteCategory(categoryName) {
            const cats = this.getCategories().filter(c => c !== categoryName);
            this.saveCategories(cats);
            return cats;
        },

        // Proveedores
        getSuppliers() {
            return loadData(STORAGE_KEY_SUPPLIERS, DEFAULT_SUPPLIERS);
        },
        saveSuppliers(suppliers) {
            saveData(STORAGE_KEY_SUPPLIERS, suppliers);
            notifyListeners({ type: 'SUPPLIERS_UPDATED', suppliers });
            fetch('/api/suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(suppliers)
            }).catch(e => console.warn('[POSStore] Servidor offline al guardar proveedores:', e));
        },

        // Documentos de Abastecimiento / Compras
        getPurchases() {
            return loadData(STORAGE_KEY_PURCHASES, []);
        },
        processPurchase(purchaseDoc) {
            const purchases = this.getPurchases();
            const inv = this.getInventory();

            // Incrementar stock y actualizar costo unitario en el inventario
            if (Array.isArray(purchaseDoc.items)) {
                purchaseDoc.items.forEach(item => {
                    const invItem = inv.find(i => i.id === item.ingredientId);
                    if (invItem) {
                        invItem.stock = parseFloat((invItem.stock + item.qty).toFixed(3));
                        if (item.unitCost > 0) {
                            invItem.costPerUnit = item.unitCost;
                        }
                    }
                });
                this.saveInventory(inv);
            }

            purchases.unshift(purchaseDoc);
            saveData(STORAGE_KEY_PURCHASES, purchases);

            notifyListeners({ type: 'PURCHASE_COMPLETED', purchases, purchase: purchaseDoc });

            fetch('/api/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchaseDoc)
            }).catch(e => console.warn('[POSStore] Servidor offline al procesar compra:', e));

            return purchaseDoc;
        },

        // Boletas de Honorarios (BHE)
        getHonorarios() {
            return loadData('mcm_pos_honorarios_v2', [
                {
                    id: 'hon_1',
                    folio: '1042',
                    date: '2026-09-25',
                    rut: '15.432.109-8',
                    name: 'Juan Contador (Asesoría Contable)',
                    grossAmount: 200000,
                    retentionAmount: 27500, // 13.75%
                    netPaid: 172500,
                    notes: 'Asesoría contable mensual y confección F29'
                }
            ]);
        },
        saveHonorarios(honorarios) {
            saveData('mcm_pos_honorarios_v2', honorarios);
            notifyListeners({ type: 'HONORARIOS_UPDATED', honorarios });
        },
        addHonorario(h) {
            const list = this.getHonorarios();
            list.unshift(h);
            this.saveHonorarios(list);
            return list;
        },
        deleteHonorario(id) {
            const list = this.getHonorarios().filter(h => h.id !== id);
            this.saveHonorarios(list);
            return list;
        },

        // Propinas Entregadas a Garzón
        getTipsPaid() {
            return loadData('mcm_pos_tips_paid_v2', []);
        },
        toggleTipStatus(saleId) {
            const list = this.getTipsPaid();
            const idx = list.indexOf(saleId);
            if (idx !== -1) {
                list.splice(idx, 1);
            } else {
                list.push(saleId);
            }
            saveData('mcm_pos_tips_paid_v2', list);
            notifyListeners({ type: 'TIPS_STATUS_UPDATED', list });
            return list;
        },

        // Productos
        getProducts() {
            return loadData(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);
        },
        getRemovableIngredients(product) {
            if (!product) return [];
            if (Array.isArray(product.removableIngredients) && product.removableIngredients.length > 0) {
                return product.removableIngredients;
            }
            const inventory = this.getInventory();
            if (Array.isArray(product.recipe) && product.recipe.length > 0) {
                return product.recipe.map(r => {
                    const item = inventory.find(inv => inv.id === r.ingredientId);
                    if (!item) return null;
                    return item.name
                        .replace('Carne Mechada de Res', 'Carne Mechada')
                        .replace('Carne Molida Hamburguesa', 'Carne')
                        .replace('Pan Frika Artesanal', 'Pan Frika')
                        .replace('Palta Hass Molida', 'Palta')
                        .replace('Papas Rústicas Pre-fritas', 'Papas Rústicas')
                        .replace('Queso Cheddar Láminas', 'Queso Cheddar')
                        .replace('Lechuga Fresca', 'Lechuga')
                        .replace('Tomate de Ensalada', 'Tomate')
                        .replace('Bebidas Lata 350cc Variadas', 'Bebida')
                        .replace('Café en Grano Premium', 'Café');
                }).filter(Boolean);
            }
            return [];
        },
        getCommonAdditions(product) {
            if (!product) return [];
            if (Array.isArray(product.commonAdditions) && product.commonAdditions.length > 0) {
                return product.commonAdditions;
            }
            if (product.category === 'Hamburguesas' || product.category === 'Combos') {
                return ['Mayo Aparte', 'Ketchup', 'Mostaza', 'Extra Mayo', 'Salsa Aparte'];
            }
            if (product.category === 'Acompañamientos') {
                return ['Mayo Aparte', 'Ketchup', 'Mostaza', 'Salsa Aparte'];
            }
            if (product.category === 'Bebidas') {
                return ['Con Hielo', 'Con Bombilla', 'Sin Hielo'];
            }
            if (product.category === 'Cafetería') {
                return ['Azúcar Aparte', 'Endulzante Aparte', 'Leche Aparte'];
            }
            return ['Mayo Aparte', 'Ketchup', 'Mostaza'];
        },
        saveProducts(products) {
            saveData(STORAGE_KEY_PRODUCTS, products);
            notifyListeners({ type: 'PRODUCTS_UPDATED', products });
            fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(products)
            }).catch(e => console.warn('[POSStore] Servidor offline al guardar productos:', e));
        },

        // Inventario e Insumos
        getInventory() {
            return loadData(STORAGE_KEY_INVENTORY, DEFAULT_INVENTORY);
        },
        saveInventory(inventory) {
            saveData(STORAGE_KEY_INVENTORY, inventory);
            notifyListeners({ type: 'INVENTORY_UPDATED', inventory });
            fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inventory)
            }).catch(e => console.warn('[POSStore] Servidor offline al guardar inventario:', e));
        },
        addInventoryStock(ingredientId, addedQuantity) {
            const inv = this.getInventory();
            const item = inv.find(i => i.id === ingredientId);
            if (item) {
                item.stock = parseFloat((item.stock + addedQuantity).toFixed(3));
                this.saveInventory(inv);
            }
        },

        // Pedidos Pendientes (Meseras -> Caja)
        getPendingOrders() {
            return loadData(STORAGE_KEY_ORDERS, []);
        },
        createMeseraOrder(orderData) {
            const orders = this.getPendingOrders();
            // Verificar si la mesa ya tiene un pedido pendiente activo
            const existingOrder = orders.find(o => o.tableNum === orderData.tableNum && o.status === 'PENDIENTE_PAGO');

            let finalOrder = null;
            let isAddition = false;

            if (existingOrder) {
                // Anexar nuevos ítems al pedido existente de la mesa
                orderData.items.forEach(newItem => {
                    const match = existingOrder.items.find(i => 
                        i.productId === newItem.productId && 
                        JSON.stringify(i.removals || []) === JSON.stringify(newItem.removals || []) &&
                        JSON.stringify(i.additions || []) === JSON.stringify(newItem.additions || [])
                    );
                    if (match) {
                        match.qty += newItem.qty;
                    } else {
                        existingOrder.items.push({ ...newItem });
                    }
                });
                existingOrder.total = existingOrder.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
                if (orderData.notes) {
                    existingOrder.notes = existingOrder.notes ? `${existingOrder.notes} | ${orderData.notes}` : orderData.notes;
                }
                existingOrder.updatedAt = new Date().toISOString();
                saveData(STORAGE_KEY_ORDERS, orders);
                finalOrder = existingOrder;
                isAddition = true;
            } else {
                const currentUser = this.getCurrentUser();
                const waiterName = orderData.waiterName || (currentUser && currentUser.role === 'MESERA' ? currentUser.name : 'Camila Garzón');
                finalOrder = {
                    id: 'ORD-' + Date.now().toString().slice(-6),
                    orderNum: Math.floor(100 + Math.random() * 900),
                    tableNum: orderData.tableNum || 'Mesa 1',
                    customerName: orderData.customerName || 'Cliente Salón',
                    serviceType: 'Para Servir',
                    items: orderData.items || [],
                    total: orderData.total || 0,
                    status: 'PENDIENTE_PAGO',
                    createdAt: new Date().toISOString(),
                    createdRole: 'MESERA',
                    waiterName: waiterName,
                    notes: orderData.notes || ''
                };
                orders.unshift(finalOrder);
                saveData(STORAGE_KEY_ORDERS, orders);
                isAddition = false;
            }

            // Notificar localmente
            notifyListeners({
                type: 'NEW_MESERA_ORDER',
                order: finalOrder,
                isAddition: isAddition
            });

            this.addAuditLog(
                isAddition ? 'ADICION_PEDIDO' : 'CREAR_PEDIDO',
                `Pedido #${finalOrder.orderNum} (${finalOrder.tableNum}) - Total: $${finalOrder.total.toLocaleString('es-CL')} CLP`
            );

            // Enviar a la API del servidor para sincronizar todos los celulares y la Caja en la red
            fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalOrder)
            }).catch(e => console.warn('[POSStore] Servidor offline, guardado en modo local:', e));

            return finalOrder;
        },

        updatePendingOrder(orderId, updatedFields) {
            const orders = this.getPendingOrders();
            const idx = orders.findIndex(o => o.id === orderId);
            if (idx !== -1) {
                orders[idx] = { ...orders[idx], ...updatedFields, updatedAt: new Date().toISOString() };
                saveData(STORAGE_KEY_ORDERS, orders);
                broadcast.postMessage({ type: 'MESERA_ORDER_UPDATED', order: orders[idx] });
                return orders[idx];
            }
            return null;
        },

        revertToPending(orderId) {
            const orders = this.getPendingOrders();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.status = 'PENDIENTE_PAGO';
                order.updatedAt = new Date().toISOString();
                saveData(STORAGE_KEY_ORDERS, orders);
                broadcast.postMessage({ type: 'MESERA_ORDER_UPDATED', order });
            }
            return order;
        },

        // Procesamiento de Cobro y Venta Final
        processSale(saleData) {
            const sales = loadData(STORAGE_KEY_SALES, []);
            const now = new Date();

            const tip = saleData.tipAmount || 0;
            const subtotalConsumo = saleData.subtotal || (saleData.total - tip);
            const isCash = (saleData.paymentMethod || '').includes('Efectivo');

            const pendingOrder = saleData.pendingOrderId ? this.getPendingOrders().find(o => o.id === saleData.pendingOrderId) : null;
            const currentUser = this.getCurrentUser();
            const waiterName = saleData.waiterName || (pendingOrder ? pendingOrder.waiterName : null) || ((saleData.tableNum && saleData.tableNum.toLowerCase().startsWith('mesa')) ? 'Camila Garzón' : 'Venta Directa Caja');

            const newSale = {
                id: 'VTA-' + now.getTime().toString().slice(-6),
                receiptNum: Math.floor(1000 + Math.random() * 9000),
                orderNum: saleData.orderNum || Math.floor(100 + Math.random() * 900),
                tableNum: saleData.tableNum || 'Caja Directa',
                serviceType: saleData.serviceType || 'Para Llevar',
                items: saleData.items || [],
                subtotal: subtotalConsumo,
                tipAmount: tip,
                total: saleData.total || (subtotalConsumo + tip),
                paymentMethod: saleData.paymentMethod || 'Efectivo', // Getnet Débito, Getnet Crédito, Efectivo
                cashReceived: saleData.cashReceived || saleData.total,
                changeGiven: saleData.changeGiven || 0,
                paidAt: now.toISOString(),
                cashier: saleData.cashier || (currentUser ? currentUser.name : 'María Cajera'),
                waiterName: waiterName,
                siiStatus: isCash ? 'TRANSMITIDO_TERCERO_SII' : 'EMITIDO_GETNET_SII'
            };

            sales.unshift(newSale);
            saveData(STORAGE_KEY_SALES, sales);

            // Si provenía de un pedido pendiente de mesera, quitarlo de la lista pendiente
            if (saleData.pendingOrderId) {
                const orders = this.getPendingOrders().filter(o => o.id !== saleData.pendingOrderId);
                saveData(STORAGE_KEY_ORDERS, orders);
            }

            // Descontar automáticamente insumos del inventario según recetas
            this.deductInventoryBySale(newSale.items);

            this.addAuditLog('PROCESAR_VENTA', `Boleta #${newSale.receiptNum} (${newSale.tableNum}) - $${newSale.total.toLocaleString('es-CL')} CLP [${newSale.paymentMethod}]`);

            notifyListeners({
                type: 'SALE_COMPLETED',
                sale: newSale
            });

            fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newSale, pendingOrderId: saleData.pendingOrderId })
            }).catch(e => console.warn('[POSStore] Servidor offline:', e));

            return newSale;
        },

        // Descuento automático de inventario por recetas (BOM)
        deductInventoryBySale(items) {
            const products = this.getProducts();
            const inv = this.getInventory();
            let changed = false;

            items.forEach(item => {
                const prod = products.find(p => p.id === item.productId || p.name === item.name);
                if (prod && prod.recipe && Array.isArray(prod.recipe)) {
                    prod.recipe.forEach(ingRef => {
                        const invItem = inv.find(i => i.id === ingRef.ingredientId);
                        if (invItem) {
                            const totalDeduction = ingRef.amount * item.qty;
                            invItem.stock = Math.max(0, parseFloat((invItem.stock - totalDeduction).toFixed(3)));
                            changed = true;
                        }
                    });
                }
            });

            if (changed) {
                this.saveInventory(inv);
            }
        },

        // Revertir (restaurar) insumos en bodega cuando se anula una venta
        restoreInventoryBySale(items) {
            const products = this.getProducts();
            const inv = this.getInventory();
            let changed = false;

            items.forEach(item => {
                const prod = products.find(p => p.id === item.productId || p.name === item.name);
                if (prod && prod.recipe && Array.isArray(prod.recipe)) {
                    prod.recipe.forEach(ingRef => {
                        const invItem = inv.find(i => i.id === ingRef.ingredientId);
                        if (invItem) {
                            const totalRestore = ingRef.amount * item.qty;
                            invItem.stock = parseFloat((invItem.stock + totalRestore).toFixed(3));
                            changed = true;
                        }
                    });
                }
            });

            if (changed) {
                this.saveInventory(inv);
            }
        },

        // Anulación y Reversión de Venta (Reverso de Stock y KPIs)
        annulSale(saleId, reason = 'Error de cobro / Anulación') {
            const sales = loadData(STORAGE_KEY_SALES, []);
            const sale = sales.find(s => s.id === saleId || s.receiptNum == saleId);

            if (!sale) return { success: false, message: 'Venta no encontrada.' };
            if (sale.status === 'ANULADA') return { success: false, message: 'Esta venta ya se encuentra anulada.' };

            sale.status = 'ANULADA';
            sale.annulledAt = new Date().toISOString();
            sale.annulReason = reason;

            saveData(STORAGE_KEY_SALES, sales);

            // Revertir el stock consumido en la bodega
            if (sale.items && Array.isArray(sale.items)) {
                this.restoreInventoryBySale(sale.items);
            }

            this.addAuditLog('ANULAR_VENTA', `Boleta #${sale.receiptNum} anulada. Motivo: ${reason}`);

            broadcast.postMessage({
                type: 'SALE_ANNULLED',
                sale: sale
            });

            return { success: true, sale: sale };
        },

        // Cargar historial de ventas
        loadSales() {
            return loadData(STORAGE_KEY_SALES, []);
        },

        // Escuchar eventos en tiempo real (BroadcastChannel y Storage Events para sincronización multidispositivo/pestaña)
        onRealtimeEvent(callback) {
            if (typeof callback === 'function') {
                realtimeListeners.push(callback);
            }

            // Asegurar que broadcast propague eventos recibidos a todos los listeners
            if (!window.__pos_broadcast_attached) {
                window.__pos_broadcast_attached = true;
                broadcast.addEventListener('message', (event) => {
                    const data = event.data;
                    if (data && (data.type === 'NEW_MESERA_ORDER' || data.type === 'SALE_COMPLETED' || data.type === 'MESERA_ORDER_UPDATED')) {
                        handleIncomingServerEvent(data);
                    }
                    realtimeListeners.forEach(cb => {
                        try { cb(data); } catch (e) {}
                    });
                });
            }

            let storageDebounceTimer = null;
            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY_ORDERS || e.key === STORAGE_KEY_SALES || e.key === STORAGE_KEY_INVENTORY) {
                    if (storageDebounceTimer) clearTimeout(storageDebounceTimer);
                    storageDebounceTimer = setTimeout(() => {
                        realtimeListeners.forEach(cb => {
                            try { cb({ type: 'STORAGE_CHANGED', key: e.key }); } catch (err) {}
                        });
                    }, 80);
                }
            });
        }
    };
})();
