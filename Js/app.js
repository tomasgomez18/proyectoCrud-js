// Estado de la aplicación
let isLoginMode = true;
let currentUser = null;
let items = JSON.parse(localStorage.getItem('items')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// Elementos del DOM
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authButton = document.getElementById('auth-button');
const authSwitch = document.getElementById('auth-switch');
const switchLink = document.getElementById('switch-link');
const nameField = document.getElementById('name-field');
const logoutBtn = document.getElementById('logout-btn');
const userWelcome = document.getElementById('user-welcome');
const addForm = document.getElementById('add-form');
const itemsContainer = document.getElementById('items-container');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    renderItems();
});

// Verificar estado de autenticación
function checkAuthStatus() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        showMainSection();
    } else {
        showAuthSection();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Formulario de autenticación
    authForm.addEventListener('submit', handleAuth);
    
    // Switch entre login y registro
    switchLink.addEventListener('click', toggleAuthMode);
    
    // Cerrar sesión
    logoutBtn.addEventListener('click', handleLogout);
    
    // Agregar elemento
    addForm.addEventListener('submit', handleAddItem);
}

// Manejar autenticación (login/registro)
function handleAuth(e) {
    e.preventDefault();
    
    const formData = new FormData(authForm);
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (isLoginMode) {
        // Login
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            showMainSection();
        } else {
            alert('Credenciales incorrectas');
        }
    } else {
        // Registro
        const name = formData.get('name');
        if (users.find(u => u.email === email)) {
            alert('El email ya está registrado');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        showMainSection();
    }
}

// Cambiar entre login y registro
function toggleAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        authTitle.textContent = 'Iniciar Sesión';
        authButton.textContent = 'Iniciar Sesión';
        authSwitch.innerHTML = '¿No tienes cuenta? <a href="#" id="switch-link">Regístrate aquí</a>';
        nameField.classList.add('hidden');
    } else {
        authTitle.textContent = 'Registrarse';
        authButton.textContent = 'Registrarse';
        authSwitch.innerHTML = '¿Ya tienes cuenta? <a href="#" id="switch-link">Inicia sesión aquí</a>';
        nameField.classList.remove('hidden');
    }
    
    // Re-asignar el event listener después de cambiar el HTML
    document.getElementById('switch-link').addEventListener('click', toggleAuthMode);
}

// Mostrar sección de autenticación
function showAuthSection() {
    authSection.classList.remove('hidden');
    mainSection.classList.add('hidden');
}

// Mostrar sección principal
function showMainSection() {
    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    userWelcome.textContent = `Bienvenido, ${currentUser.name}`;
    renderItems();
}

// Cerrar sesión
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAuthSection();
    authForm.reset();
}

// Agregar elemento
function handleAddItem(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('item-name');
    const descInput = document.getElementById('item-description');
    
    const newItem = {
        id: Date.now(),
        name: nameInput.value,
        description: descInput.value,
        userId: currentUser.id,
        createdAt: new Date().toLocaleString()
    };
    
    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));
    
    renderItems();
    addForm.reset();
}

// Eliminar elemento
function handleDeleteItem(itemId) {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
        items = items.filter(item => item.id !== itemId);
        localStorage.setItem('items', JSON.stringify(items));
        renderItems();
    }
}

// Renderizar elementos
function renderItems() {
    const userItems = items.filter(item => item.userId === currentUser.id);
    
    if (userItems.length === 0) {
        itemsContainer.innerHTML = '<p class="no-items">No hay elementos agregados</p>';
        return;
    }
    
    itemsContainer.innerHTML = userItems.map(item => `
        <div class="item-card">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <small>Agregado: ${item.createdAt}</small>
            </div>
            <button class="delete-btn" onclick="handleDeleteItem(${item.id})">
                Eliminar
            </button>
        </div>
    `).join('');
}