// Clase para el manejo del login
class Login {
  constructor() {
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    this.inicializarEventos();
  }

  // Método para inicializar eventos
  inicializarEventos() {
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.validarLogin();
    });
  }

  // Método para validar el login
  validarLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    // Verificar si el usuario existe
    const usuario = this.usuarios.find(
      (user) => user.email === email && user.password === password
    );

    if (usuario) {
      mensaje.textContent = "Login exitoso!";
      mensaje.style.color = "green";

      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

      // Redirigir a la página principal después de 1 segundo
      setTimeout(() => {
        window.location.href = "pages/sistema.html";
      }, 1000);
    } else {
      mensaje.textContent = "Email o contraseña incorrectos";
      mensaje.style.color = "red";
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new Login();

  // Crear un usuario de prueba si no existe
  if (!localStorage.getItem("usuarios")) {
    const usuarios = [{ email: "usuario@empresa.com", password: "123456" }];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
});
