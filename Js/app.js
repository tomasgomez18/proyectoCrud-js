// Normaliza rutas de imagen para que funcionen desde la página
// Explico esto: dependiendo de cómo se guarde la ruta (solo nombre, img/archivo, assets/archivo)
// necesitamos convertirla a la forma que usa la página dentro de `pages/`.
function normalizarRutaImagenGlobal(ruta) {
  if (!ruta) return "../assets/imgPrueba.jpeg"; // imagen por defecto si no hay nada
  ruta = ruta.trim();
  if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta; // enlace fuera
  if (ruta.startsWith("../")) return ruta; // ya está bien para esta página
  if (ruta.startsWith("assets/")) return "../" + ruta; // lo movemos un nivel arriba
  if (ruta.startsWith("img/")) return "../assets/" + ruta.split("/").pop(); // nombre antiguo
  if (ruta.indexOf("/") === -1) return "../assets/" + ruta; // solo nombre → asumimos assets
  return ruta; // si no es ninguno de los casos, lo devolvemos tal cual
}

// Esta clase se encarga de todo lo del carrito: sumar, eliminar y mostrar
class Carrito {
  // agregar un producto al carrito (si ya está, aumentamos cantidad)
  static agregarProducto(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1,
      });
    }

    // guardamos el carrito en el navegador para que persista
    localStorage.setItem("carrito", JSON.stringify(carrito));
    this.mostrarCarrito();
  }

  // sacar un producto del carrito
  static eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter((item) => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    this.mostrarCarrito();
  }

  // dibuja el carrito en la pantalla
  static mostrarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    if (!listaCarrito) return; // si no existe el contenedor no hacemos nada

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
      listaCarrito.innerHTML = "<p>El carrito está vacío</p>";
      if (totalCarrito) {
        totalCarrito.textContent = "0.00";
      }
      return;
    }

    let total = 0;

    carrito.forEach((item) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      // usamos la función que normaliza la ruta para que el navegador encuentre la imagen
      const imgSrc = normalizarRutaImagenGlobal(item.imagen);

      const divItem = document.createElement("div");
      divItem.className = "item-carrito";
      divItem.innerHTML = `
            <div>
              <img src="${imgSrc}" alt="${item.nombre}" onerror="this.onerror=null;this.src='../assets/imgPrueba.jpeg'" />
              <h3>${item.nombre}</h3>
              <p>Precio: $${item.precio} x ${item.cantidad}</p>
              <p>Subtotal: $${subtotal.toFixed(2)}</p>
            </div>
            <button class="btn-eliminar-carrito" data-id="${item.id}">Eliminar</button>
          `;
      listaCarrito.appendChild(divItem);
    });

    if (totalCarrito) {
      totalCarrito.textContent = total.toFixed(2);
    }

    // añadimos el evento para eliminar a cada botón
    document.querySelectorAll(".btn-eliminar-carrito").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        Carrito.eliminarProducto(id);
      });
    });
  }
}

// Clase que controla los productos y la navegación entre secciones
class Sistema {
  constructor() {
    // cargamos productos (desde el navegador si ya hay, o los por defecto)
    this.cargarProductos();
    this.inicializarEventos();
    this.mostrarProductos();
    this.cambiarSeccion("seccion-productos");
  }

  // cargamos productos desde localStorage o creamos los de ejemplo
  cargarProductos() {
    const productosGuardados = localStorage.getItem("productos");
    if (productosGuardados) {
      // Normalizamos las rutas y guardamos de nuevo para dejar todo consistente
      this.productos = JSON.parse(productosGuardados).map((p) => ({
        ...p,
        imagen: this.normalizarRutaImagen(p.imagen),
      }));
      localStorage.setItem("productos", JSON.stringify(this.productos));
    } else {
      // productos por defecto, con rutas apuntando a la carpeta assets
      this.productos = [
        { id: 1, nombre: "Macbook", precio: 1200, imagen: "../assets/macbooj.jpeg" },
        { id: 2, nombre: "Iphone 13 pro", precio: 800, imagen: "../assets/iphone13.jpeg" },
        { id: 3, nombre: "Tablet", precio: 500, imagen: "../assets/tablet.jpeg" },
        { id: 4, nombre: "Auriculares", precio: 150, imagen: "../assets/auriculares.jpeg" },
      ];
      localStorage.setItem("productos", JSON.stringify(this.productos));
    }
  }

  // convierte rutas que pueda haber en distintas formas a la que usa la página
  normalizarRutaImagen(ruta) {
    if (!ruta) return "../assets/imgPrueba.jpeg"; // si no hay ruta, usamos una imagen de prueba
    ruta = ruta.trim();
    if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;
    if (ruta.startsWith("../")) return ruta;
    if (ruta.startsWith("assets/")) return "../" + ruta;
    if (ruta.startsWith("img/")) return "../assets/" + ruta.split("/").pop();
    if (ruta.indexOf("/") === -1) return "../assets/" + ruta;
    return ruta;
  }

  // devuelve el próximo id disponible para un nuevo producto
  obtenerProximoId() {
    return Math.max(...this.productos.map((p) => p.id), 0) + 1;
  }

  // agrega producto a la lista y lo guarda
  agregarProducto(nombre, precio, imagen) {
    const nuevoProducto = {
      id: this.obtenerProximoId(),
      nombre: nombre,
      precio: parseFloat(precio),
      imagen: this.normalizarRutaImagen(imagen),
    };

    this.productos.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(this.productos));
    this.mostrarProductos();

    return nuevoProducto;
  }

  // conectamos los enlaces del menú y el formulario de nuevo producto
  inicializarEventos() {
    document.getElementById("link-productos").addEventListener("click", (e) => {
      e.preventDefault();
      this.cambiarSeccion("seccion-productos");
    });

    document.getElementById("link-crear-producto").addEventListener("click", (e) => {
      e.preventDefault();
      this.cambiarSeccion("seccion-crear-producto");
    });

    document.getElementById("link-carrito").addEventListener("click", (e) => {
      e.preventDefault();
      this.cambiarSeccion("seccion-carrito");
      Carrito.mostrarCarrito();
    });

    document.getElementById("link-salir").addEventListener("click", (e) => {
      e.preventDefault();
      this.salir();
    });

    const formCrear = document.getElementById("form-crear-producto");
    if (formCrear) {
      formCrear.addEventListener("submit", (e) => {
        e.preventDefault();
        this.manejarCrearProducto();
      });
    }
  }

  // lee el formulario de nuevo producto, valida y lo guarda
  manejarCrearProducto() {
    const nombre = document.getElementById("nombre-producto").value.trim();
    const precio = document.getElementById("precio-producto").value;
    const imagen = document.getElementById("imagen-producto").value.trim();
    const mensajeDiv = document.getElementById("mensaje-producto");

    if (!nombre || !precio) {
      mensajeDiv.textContent = "Por favor completa todos los campos requeridos";
      mensajeDiv.style.color = "red";
      return;
    }

    const producto = this.agregarProducto(nombre, precio, imagen);

    document.getElementById("form-crear-producto").reset();

    mensajeDiv.textContent = `¡Producto "${producto.nombre}" creado exitosamente!`;
    mensajeDiv.style.color = "green";

    setTimeout(() => {
      mensajeDiv.textContent = "";
    }, 3000);

    setTimeout(() => {
      this.cambiarSeccion("seccion-productos");
    }, 1500);
  }

  // cambiar entre secciones mostrando y ocultando
  cambiarSeccion(seccionId) {
    document.querySelectorAll("section").forEach((seccion) => {
      seccion.classList.remove("seccion-activa");
      seccion.classList.add("seccion-oculta");
    });
    const seccion = document.getElementById(seccionId);
    if (seccion) {
      seccion.classList.remove("seccion-oculta");
      seccion.classList.add("seccion-activa");
    }
  }

  // dibuja la lista de productos en la pantalla
  mostrarProductos() {
    const listaProductos = document.getElementById("lista-productos");
    if (listaProductos) {
      listaProductos.innerHTML = "";
      this.productos.forEach((producto) => {
        // calculamos la ruta que usará la imagen y la mostramos en consola para ayuda
        const imgSrc = this.normalizarRutaImagen(producto.imagen) || normalizarRutaImagenGlobal(producto.imagen);
        console.debug("Producto:", producto.nombre, "imagen guardada:", producto.imagen, "-> usar src:", imgSrc);
        const divProducto = document.createElement("div");
        divProducto.className = "producto";
        divProducto.innerHTML = `
                    <img src="${imgSrc}" alt="${producto.nombre}" onerror="this.onerror=null;this.src='../assets/imgPrueba.jpeg'">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                    <button class="btn-agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
                `;
        listaProductos.appendChild(divProducto);
      });

      // eventos para agregar al carrito
      document.querySelectorAll(".btn-agregar-carrito").forEach((button) => {
        button.addEventListener("click", (e) => {
          const id = parseInt(e.target.getAttribute("data-id"));
          const producto = this.productos.find((p) => p.id === id);
          if (producto) {
            Carrito.agregarProducto(producto);
            alert(`${producto.nombre} agregado al carrito`);
          }
        });
      });
    }
  }

  mostrarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    if (!listaCarrito) return;

    Carrito.mostrarCarrito();
  }

  // cerrar sesión y volver al login
  salir() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "../index.html";
  }
}

// al cargar la página hacemos un pequeño reinicio si hace falta para arreglar rutas
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("productosResetV2") && localStorage.getItem("productos")) {
    // borra productos y carrito una vez para forzar re-guardado con rutas correctas
    localStorage.removeItem("productos");
    localStorage.removeItem("carrito");
    localStorage.setItem("productosResetV2", "1");
    location.reload();
    return;
  }

  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  new Sistema();
});
