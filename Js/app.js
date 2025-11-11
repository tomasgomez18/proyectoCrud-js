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

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    renderItems();
});

function checkAuthStatus() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        showMainSection();
    } else {
        showAuthSection();
    }
}