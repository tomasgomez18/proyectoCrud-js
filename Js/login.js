// Clase para el manejo del login
class Login {
    constructor() {
        this.usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        this.inicializarEventos();
    }


    inicializarEventos() {
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.validarLogin();
        });
    }

    validarLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const mensaje = document.getElementById('mensaje');

        const usuario = this.usuarios.find(user => user.email === email && user.password === password);
        
        if (usuario) {
            mensaje.textContent = 'Login exitoso!';
            mensaje.style.color = 'green';
            
            // Guardar sesión activa
            localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
            
            // Redirigir a la página principal después de 1 segundo
            setTimeout(() => {
                this.abrirSistema();
            }, 1000);
        } else {
            mensaje.textContent = 'Email o contraseña incorrectos';
            mensaje.style.color = 'red';
        }
    }
    abrirSistema() {
        const nuevaVentana = window.open('', '_self');
        nuevaVentana.document.open();
        nuevaVentana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sistema - Mi Empresa</title>
                <link rel="stylesheet" href="css/style.css">
            </head>
            <body>
                <header>
                    <div class="logo">
                        <img src="img/logo.png" alt="Logo" id="logo-animado">
                        <h1>Mi Empresa</h1>
                    </div>
                    <nav>
                        <ul class="menu">
                            <li><a href="#" id="link-productos">Productos</a></li>
                            <li><a href="#" id="link-carrito">Carrito</a></li>
                            <li><a href="#" id="link-salir">Salir</a></li>
                        </ul>
                    </nav>
                </header>
                <main>
                    <div id="contenido">
                        <!-- Aquí se cargará el contenido dinámico -->
                    </div>
                </main>
                <script src="js/main.js"></script>
                <script src="js/carrito.js"></script>
            </body>
            </html>
        `);
        nuevaVentana.document.close();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Login();
    if (!localStorage.getItem('usuarios')) {
        const usuarios = [
            { email: 'usuario@empresa.com', password: '123456' }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
});