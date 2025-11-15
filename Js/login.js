// Clase para manejar usuarios
class Usuario {
  constructor(nombre, email, password) {
    this.nombre = nombre;
    this.email = email;
    this.password = password;
  }

  validar() {
    if (!this.nombre || !this.email || !this.password) {
      return { valido: false, mensaje: "Todos los campos son requeridos" };
    }

    if (this.email.indexOf("@") === -1) {
      return { valido: false, mensaje: "Email inválido" };
    }

    if (this.password.length < 6) {
      return { valido: false, mensaje: "La contraseña debe tener al menos 6 caracteres" };
    }

    return { valido: true, mensaje: "Usuario válido" };
  }
}

// Clase para manejar el registro
class Registro {
  constructor() {
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  registrarUsuario(nombre, email, password) {
    const usuario = new Usuario(nombre, email, password);
    const validacion = usuario.validar();

    if (!validacion.valido) {
      return validacion;
    }

    const usuarioExistente = this.usuarios.find((u) => u.email === email);
    if (usuarioExistente) {
      return { valido: false, mensaje: "El email ya está registrado" };
    }

    this.usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
    return { valido: true, mensaje: "Usuario registrado exitosamente" };
  }
}

// Clase para manejar el login
class Login {
  constructor() {
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    this.registro = new Registro();
    this.inicializarEventos();
  }

  inicializarEventos() {
    // Eventos del formulario de login
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.validarLogin();
    });

    // Eventos para cambiar entre formularios
    document.getElementById("link-registro").addEventListener("click", (e) => {
      e.preventDefault();
      this.mostrarFormularioRegistro();
    });

    document.getElementById("link-volver-login").addEventListener("click", (e) => {
      e.preventDefault();
      this.mostrarFormularioLogin();
    });

    // Evento del formulario de registro
    document.getElementById("registroForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.procesarRegistro();
    });
  }

  validarLogin() {
    // Recargar usuarios del localStorage para asegurar que tenemos los más actualizados
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
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

  procesarRegistro() {
    const nombre = document.getElementById("nombre-registro").value;
    const email = document.getElementById("email-registro").value;
    const password = document.getElementById("password-registro").value;
    const confirmarPassword = document.getElementById("confirmar-password").value;
    const mensaje = document.getElementById("mensaje-registro");

    if (password !== confirmarPassword) {
      mensaje.textContent = "Las contraseñas no coinciden";
      mensaje.style.color = "red";
      return;
    }

    const resultado = this.registro.registrarUsuario(nombre, email, password);

    mensaje.textContent = resultado.mensaje;
    mensaje.style.color = resultado.valido ? "green" : "red";

    if (resultado.valido) {
      setTimeout(() => {
        // Recargar usuarios del localStorage en la instancia de Login
        this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        this.mostrarFormularioLogin();
        document.getElementById("registroForm").reset();
        document.getElementById("mensaje-registro").textContent = "";
      }, 2000);
    }
  }

  mostrarFormularioRegistro() {
    document.getElementById("formulario-login").style.display = "none";
    document.getElementById("formulario-registro").style.display = "block";
  }

  mostrarFormularioLogin() {
    document.getElementById("formulario-login").style.display = "block";
    document.getElementById("formulario-registro").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Login();

  // Crear usuarios de prueba si no existen
  if (!localStorage.getItem("usuarios")) {
    const usuarios = [{ nombre: "Usuario Demo", email: "tomas@proyecto.com", password: "123456" }];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
});
