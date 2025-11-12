
class Login {
  constructor() {
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    this.inicializarEventos();
  }


  inicializarEventos() {
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.validarLogin();
    });
  }


  validarLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");


    const usuario = this.usuarios.find(
      (user) => user.email === email && user.password === password
    );

    if (usuario) {
      mensaje.textContent = "Login exitoso!";
      mensaje.style.color = "green";

      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

     
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


  if (!localStorage.getItem("usuarios")) {
    const usuarios = [{ email: "tomas@proyecto.com", password: "123456" }];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
});
