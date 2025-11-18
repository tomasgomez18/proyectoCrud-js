class Carrito {
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

    localStorage.setItem("carrito", JSON.stringify(carrito));
    this.mostrarCarrito();
  }

  static eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter((item) => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    this.mostrarCarrito();
  }

  static mostrarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    if (!listaCarrito) return;

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

      const divItem = document.createElement("div");
      divItem.className = "item-carrito";
      divItem.innerHTML = `
                <div>
                    <img src="${item.imagen}"></img>
                    <h3>${item.nombre}</h3>
                    <p>Precio: $${item.precio} x ${item.cantidad}</p>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                </div>
                <button class="btn-eliminar-carrito" data-id="${
                  item.id
                }">Eliminar</button>
            `;
      listaCarrito.appendChild(divItem);
    });

    if (totalCarrito) {
      totalCarrito.textContent = total.toFixed(2);
    }

    document.querySelectorAll(".btn-eliminar-carrito").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        Carrito.eliminarProducto(id);
      });
    });
  }
}

class Sistema {
  constructor() {
    this.cargarProductos();
    this.inicializarEventos();
    this.mostrarProductos();
    this.cambiarSeccion("seccion-productos");
  }

  cargarProductos() {
    const productosGuardados = localStorage.getItem("productos");
    if (productosGuardados) {
      // Normalizar rutas de imagen de productos guardados
      this.productos = JSON.parse(productosGuardados).map(p => ({
        ...p,
        imagen: this.normalizarRutaImagen(p.imagen)
      }));
    } else {
      this.productos = [
        { id: 1, nombre: "Macbook", precio: 1200, imagen: "../assets/macbooj.jpeg" },
        {
          id: 2,
          nombre: "Iphone 13 pro",
          precio: 800,
          imagen: "../assets/iphone13.jpeg",
        },
        { id: 3, nombre: "Tablet", 
          precio: 500, 
          imagen: "../assets/tablet.jpeg" 
        },
        {
          id: 4,
          nombre: "Auriculares",
          precio: 150,
          imagen: "../assets/auriculares.jpeg",
        },
      ];
      localStorage.setItem("productos", JSON.stringify(this.productos));
    }
  }

  // Normaliza la ruta de la imagen para que funcione desde `pages/sistema.html`
  normalizarRutaImagen(ruta) {
    if (!ruta) return "../assets/imgPrueba.jpeg"; // imagen por defecto
    ruta = ruta.trim();
    // Si es URL absoluta
    if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;
    // Si ya es relativa desde pages (comienza con ../)
    if (ruta.startsWith("../")) return ruta;
    // Si referencia assets directamente (assets/imagen.jpg)
    if (ruta.startsWith("assets/")) return "../" + ruta;
    // Si referencia img/ (ruta antigua), convertir a ../assets/
    if (ruta.startsWith("img/")) return "../assets/" + ruta.split("/").pop();
    // Si es solo nombre de archivo, asumir está en assets
    if (ruta.indexOf("/") === -1) return "../assets/" + ruta;
    // Por defecto, devolver la ruta tal cual
    return ruta;
  }

  obtenerProximoId() {
    return Math.max(...this.productos.map((p) => p.id), 0) + 1;
  }

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

  inicializarEventos() {
    document.getElementById("link-productos").addEventListener("click", (e) => {
      e.preventDefault();
      this.cambiarSeccion("seccion-productos");
    });

    document
      .getElementById("link-crear-producto")
      .addEventListener("click", (e) => {
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

  mostrarProductos() {
    const listaProductos = document.getElementById("lista-productos");
    if (listaProductos) {
      listaProductos.innerHTML = "";
      this.productos.forEach((producto) => {
        const divProducto = document.createElement("div");
        divProducto.className = "producto";
        divProducto.innerHTML = `
                    <img src="${producto.imagen}" alt="${
          producto.nombre
        }" onerror="this.style.backgroundColor='#eee'; this.alt='Imagen no disponible'">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                    <button class="btn-agregar-carrito" data-id="${
                      producto.id
                    }">Agregar al Carrito</button>
                `;
        listaProductos.appendChild(divProducto);
      });

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

  salir() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "../index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  new Sistema();
});
