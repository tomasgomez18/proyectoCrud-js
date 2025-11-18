// Clase que representa un usuario simple
// Aquí guardamos el nombre, el correo y la clave que eligió la persona
// Las funciones abajo verifican que los datos tengan sentido
class Usuario {
  constructor(nombre, email, password) {
    this.nombre = nombre;
    this.email = email;
    this.password = password;
  }

  // Revisamos que el usuario tenga nombre, correo y una clave suficientemente larga
  // Si algo está mal devolvemos un aviso con el motivo
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

// Clase encargada de guardar nuevos usuarios
// Se encarga de comprobar que no se repita el correo y de guardar en el navegador
class Registro {
  constructor() {
    // cargamos la lista que ya esté guardada, o empezamos vacíos
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  // Intenta registrar un usuario nuevo
  // Devuelve un objeto con {valido: true/false, mensaje: '...'} para mostrar al usuario
  registrarUsuario(nombre, email, password) {
    const usuario = new Usuario(nombre, email, password);
    const validacion = usuario.validar();

    if (!validacion.valido) {
      return validacion;
    }

    // comprobamos que el correo no esté repetido
    const usuarioExistente = this.usuarios.find((u) => u.email === email);
    if (usuarioExistente) {
      return { valido: false, mensaje: "El email ya está registrado" };
    }

    // guardamos el usuario y lo persistimos en el navegador
    this.usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
    return { valido: true, mensaje: "Usuario registrado exitosamente" };
  }
}

// Clase que controla todo lo relacionado con el login en la página
// Maneja mostrar/ocultar formularios y validar al entrar
class Login {
  constructor() {
    // guardamos la lista de usuarios para comparar cuando alguien intenta entrar
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    this.registro = new Registro();
    this.inicializarEventos();
  }

  // Conecta los botones y formularios de la página con funciones de este archivo
  inicializarEventos() {
    // cuando se envía el formulario de login, evitamos que la página recargue
    // y llamamos a la función que valida los datos
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.validarLogin();
    });

    // enlaces para cambiar entre el formulario de registro y el de login
    document.getElementById("link-registro").addEventListener("click", (e) => {
      e.preventDefault();
      this.mostrarFormularioRegistro();
    });

    document.getElementById("link-volver-login").addEventListener("click", (e) => {
      e.preventDefault();
      this.mostrarFormularioLogin();
    });

    // cuando se envía el formulario de registro, procesamos los datos
    document.getElementById("registroForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.procesarRegistro();
    });
  }

  // Verifica las credenciales que puso la persona en el formulario de login
  validarLogin() {
    // recargamos la lista por si alguien se registró justo antes
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    // buscamos si hay un usuario con ese correo y clave
    const usuario = this.usuarios.find(
      (user) => user.email === email && user.password === password
    );

    if (usuario) {
      // si está bien, avisamos y guardamos quién está activo
      mensaje.textContent = "Login exitoso!";
      mensaje.style.color = "green";

      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

      // esperamos un segundo y vamos al sistema
      setTimeout(() => {
        window.location.href = "pages/sistema.html";
      }, 1000);
    } else {
      // si no, mostramos un mensaje para que lo intente de nuevo
      mensaje.textContent = "Email o contraseña incorrectos";
      mensaje.style.color = "red";
    }
  }

  // Lee lo que puso la persona en el formulario de registro y lo guarda
  procesarRegistro() {
    const nombre = document.getElementById("nombre-registro").value;
    const email = document.getElementById("email-registro").value;
    const password = document.getElementById("password-registro").value;
    const confirmarPassword = document.getElementById("confirmar-password").value;
    const mensaje = document.getElementById("mensaje-registro");

    // comprobamos que las dos claves coincidan
    if (password !== confirmarPassword) {
      mensaje.textContent = "Las contraseñas no coinciden";
      mensaje.style.color = "red";
      return;
    }

    // intentamos registrar y mostramos el resultado
    const resultado = this.registro.registrarUsuario(nombre, email, password);

    mensaje.textContent = resultado.mensaje;
    mensaje.style.color = resultado.valido ? "green" : "red";

    if (resultado.valido) {
      setTimeout(() => {
        // si todo fue bien, actualizamos la lista de usuarios y volvemos al login
        this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        this.mostrarFormularioLogin();
        document.getElementById("registroForm").reset();
        document.getElementById("mensaje-registro").textContent = "";
      }, 2000);
    }
  }

  // Muestra el formulario de registro y oculta el de login
  mostrarFormularioRegistro() {
    document.getElementById("formulario-login").style.display = "none";
    document.getElementById("formulario-registro").style.display = "block";
  }

  // Muestra el formulario de login y oculta el de registro
  mostrarFormularioLogin() {
    document.getElementById("formulario-login").style.display = "block";
    document.getElementById("formulario-registro").style.display = "none";
  }
}

// Al cargar la página, arrancamos la lógica de login
document.addEventListener("DOMContentLoaded", () => {
  new Login();

  // si no hay usuarios guardados, creamos uno de ejemplo para probar
  if (!localStorage.getItem("usuarios")) {
    const usuarios = [{ nombre: "Usuario Demo", email: "tomas@proyecto.com", password: "123456" }];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
});
