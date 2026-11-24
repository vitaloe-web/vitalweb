
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. CONFIGURACIÓN GENERAL
    // ==========================================

    const NUMERO_WHATSAPP = "59176125513";

    const CLAVE_CARRITO = "vitaloe_carrito";

    const formatoMoneda = new Intl.NumberFormat("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function moneda(valor) {
        return formatoMoneda.format(valor) + " Bs";
    }


    // ==========================================
    // 2. ALMACENAMIENTO DEL CARRITO
    // ==========================================

    function cargarCarrito() {

        try {

            const guardado = localStorage.getItem(CLAVE_CARRITO);

            if (!guardado) return [];

            const datos = JSON.parse(guardado);

            if (!Array.isArray(datos)) return [];

            return datos.filter(function (producto) {

                return (
                    producto &&
                    ["power", "aloe"].includes(producto.id) &&
                    typeof producto.nombre === "string" &&
                    Number.isFinite(producto.precio) &&
                    producto.precio > 0 &&
                    Number.isInteger(producto.cantidad) &&
                    producto.cantidad > 0 &&
                    producto.cantidad <= 999
                );

            });

        } catch (error) {

            console.error("Error al cargar el carrito:", error);

            return [];

        }

    }

    const carrito = cargarCarrito();

    function guardarCarrito() {

        try {

            localStorage.setItem(
                CLAVE_CARRITO,
                JSON.stringify(carrito)
            );

        } catch (error) {

            console.error("No se pudo guardar el carrito:", error);

            mostrarMensaje(
                "No se pudo guardar el carrito en este navegador.",
                "error"
            );

        }

    }


    // ==========================================
    // 3. EFECTO DE ESCRITURA
    // ==========================================

    const palabras = [
        "Aloe Vera Puro",
        "Power Blue",
        "Hidratación Natural",
        "Refrescancia Natural"
    ];

    const texto = document.getElementById("texto");

    let indicePalabra = 0;
    let indiceLetra = 0;
    let borrando = false;

    function escribir() {

        if (!texto) return;

        const palabra = palabras[indicePalabra];

        if (!borrando) {

            indiceLetra++;

            texto.textContent =
                palabra.substring(0, indiceLetra);

            if (indiceLetra === palabra.length) {

                borrando = true;

                setTimeout(escribir, 1800);

            } else {

                setTimeout(escribir, 90);

            }

        } else {

            indiceLetra--;

            texto.textContent =
                palabra.substring(0, indiceLetra);

            if (indiceLetra === 0) {

                borrando = false;

                indicePalabra =
                    (indicePalabra + 1) % palabras.length;

                setTimeout(escribir, 400);

            } else {

                setTimeout(escribir, 45);

            }

        }

    }

    escribir();


    // ==========================================
    // 4. NOTIFICACIONES
    // ==========================================

    const mensaje = document.getElementById("mensaje");

    let temporizadorMensaje;

    function mostrarMensaje(contenido, tipo = "exito") {

        if (!mensaje) return;

        clearTimeout(temporizadorMensaje);

        mensaje.textContent = contenido;

        mensaje.classList.remove("exito", "error");
        mensaje.classList.add(tipo);

        mensaje.style.display = "block";
        mensaje.style.opacity = "1";

        temporizadorMensaje = setTimeout(function () {

            mensaje.style.opacity = "0";

            setTimeout(function () {

                mensaje.style.display = "none";

            }, 400);

        }, 3000);

    }


    // ==========================================
    // 5. ELEMENTOS DEL CARRITO
    // ==========================================

    const listaCarrito =
        document.getElementById("lista-carrito");

    const contadorCarrito =
        document.getElementById("contador-carrito");

    const cantidadTotal =
        document.getElementById("cantidad-total");

    const subtotal =
        document.getElementById("subtotal");

    const total =
        document.getElementById("total");


    // ==========================================
    // 6. ACTUALIZAR CARRITO
    // ==========================================

    function actualizarCarrito() {

        if (!listaCarrito) return;

        listaCarrito.innerHTML = "";

        let cantidad = 0;
        let importe = 0;

        if (carrito.length === 0) {

            listaCarrito.innerHTML = `
                <div class="carrito-vacio">

                    <i class="bi bi-cart-x"></i>

                    <h4>Tu carrito está vacío</h4>

                    <p>
                        Agrega tus productos favoritos de VITALOE.
                    </p>

                    <a href="#productos" class="btn btn-success">
                        Ver productos
                    </a>

                </div>
            `;

        } else {

            carrito.forEach(function (producto) {

                const importeProducto =
                    producto.precio * producto.cantidad;

                cantidad += producto.cantidad;

                importe += importeProducto;

                const elemento = document.createElement("div");

                elemento.className = "carrito-producto";


                // INFORMACIÓN

                const informacion = document.createElement("div");

                informacion.className = "carrito-info";

                const nombre = document.createElement("h4");

                nombre.textContent = producto.nombre;

                const precio = document.createElement("p");

                precio.textContent =
                    moneda(producto.precio) + " por unidad";

                informacion.append(nombre, precio);


                // CONTROLES DE CANTIDAD

                const controles = document.createElement("div");

                controles.className = "controles-cantidad";

                const botonMenos = document.createElement("button");

                botonMenos.type = "button";
                botonMenos.textContent = "−";

                botonMenos.setAttribute(
                    "aria-label",
                    "Disminuir cantidad"
                );

                botonMenos.addEventListener("click", function () {

                    cambiarCantidad(producto.id, -1);

                });


                const numero = document.createElement("span");

                numero.textContent = producto.cantidad;


                const botonMas = document.createElement("button");

                botonMas.type = "button";
                botonMas.textContent = "+";

                botonMas.setAttribute(
                    "aria-label",
                    "Aumentar cantidad"
                );

                botonMas.addEventListener("click", function () {

                    cambiarCantidad(producto.id, 1);

                });

                controles.append(
                    botonMenos,
                    numero,
                    botonMas
                );


                // IMPORTE

                const importeElemento =
                    document.createElement("strong");

                importeElemento.textContent =
                    moneda(importeProducto);


                // ELIMINAR

                const eliminar =
                    document.createElement("button");

                eliminar.type = "button";

                eliminar.className = "eliminar-producto";

                eliminar.innerHTML =
                    '<i class="bi bi-trash"></i>';

                eliminar.setAttribute(
                    "aria-label",
                    "Eliminar producto"
                );

                eliminar.addEventListener("click", function () {

                    eliminarProducto(producto.id);

                });


                elemento.append(
                    informacion,
                    controles,
                    importeElemento,
                    eliminar
                );

                listaCarrito.appendChild(elemento);

            });

        }


        // ACTUALIZAR RESUMEN

        if (contadorCarrito) {
            contadorCarrito.textContent = cantidad;
        }

        if (cantidadTotal) {
            cantidadTotal.textContent = cantidad;
        }

        if (subtotal) {
            subtotal.textContent = moneda(importe);
        }

        if (total) {
            total.textContent = moneda(importe);
        }

        guardarCarrito();

    }


    // ==========================================
    // 7. AGREGAR PRODUCTOS
    // ==========================================

    const botonesComprar =
        document.querySelectorAll(".comprar");

    botonesComprar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const id = boton.dataset.id;

            const nombre = boton.dataset.nombre;

            const precio = Number(boton.dataset.precio);

            if (
                !id ||
                !nombre ||
                !Number.isFinite(precio) ||
                precio <= 0
            ) {

                mostrarMensaje(
                    "No se pudo agregar el producto.",
                    "error"
                );

                return;

            }


            const productoExistente =
                carrito.find(function (producto) {

                    return producto.id === id;

                });


            if (productoExistente) {

                if (productoExistente.cantidad >= 999) {

                    mostrarMensaje(
                        "Alcanzaste el límite de unidades.",
                        "error"
                    );

                    return;

                }

                productoExistente.cantidad++;

            } else {

                carrito.push({

                    id: id,
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1

                });

            }

            actualizarCarrito();

            mostrarMensaje(
                "✅ " + nombre + " agregado al carrito."
            );

        });

    });


    // ==========================================
    // 8. AUMENTAR Y DISMINUIR CANTIDAD
    // ==========================================

    function cambiarCantidad(id, cambio) {

        const producto =
            carrito.find(function (item) {

                return item.id === id;

            });

        if (!producto) return;

        if (cambio > 0 && producto.cantidad >= 999) {

            mostrarMensaje(
                "Alcanzaste el límite de unidades.",
                "error"
            );

            return;

        }

        producto.cantidad += cambio;

        if (producto.cantidad <= 0) {

            eliminarProducto(id);

            return;

        }

        actualizarCarrito();

    }


    // ==========================================
    // 9. ELIMINAR PRODUCTO
    // ==========================================

    function eliminarProducto(id) {

        const indice = carrito.findIndex(function (producto) {

            return producto.id === id;

        });

        if (indice !== -1) {

            const nombre = carrito[indice].nombre;

            carrito.splice(indice, 1);

            actualizarCarrito();

            mostrarMensaje(
                "🗑️ " + nombre + " eliminado del carrito."
            );

        }

    }


    // ==========================================
    // 10. VACIAR CARRITO
    // ==========================================

    const botonVaciar =
        document.getElementById("vaciar-carrito");

    if (botonVaciar) {

        botonVaciar.addEventListener("click", function () {

            if (carrito.length === 0) {

                mostrarMensaje(
                    "El carrito ya está vacío.",
                    "error"
                );

                return;

            }

            carrito.length = 0;

            actualizarCarrito();

            mostrarMensaje(
                "🛒 Se vació el carrito correctamente."
            );

        });

    }


    // ==========================================
    // 11. FINALIZAR COMPRA POR WHATSAPP
    // ==========================================

    const finalizarCompra =
        document.getElementById("finalizar-compra");

    if (finalizarCompra) {

        finalizarCompra.addEventListener("click", function () {

            if (carrito.length === 0) {

                mostrarMensaje(
                    "⚠️ Agrega productos antes de realizar tu pedido.",
                    "error"
                );

                return;

            }


            let importeTotal = 0;

            let detalle =
                "¡Hola VITALOE! Quiero realizar el siguiente pedido:\n\n";


            carrito.forEach(function (producto) {

                const importe =
                    producto.precio * producto.cantidad;

                importeTotal += importe;

                detalle +=
                    "• " + producto.nombre + "\n" +
                    "  Cantidad: " + producto.cantidad + "\n" +
                    "  Precio unitario: " +
                    moneda(producto.precio) + "\n" +
                    "  Subtotal: " + moneda(importe) + "\n\n";

            });


            detalle +=
                "TOTAL: " + moneda(importeTotal) + "\n\n" +
                "Quisiera confirmar la disponibilidad y coordinar mi pedido. Gracias.";


            const enlace =
                "https://wa.me/" +
                NUMERO_WHATSAPP +
                "?text=" +
                encodeURIComponent(detalle);


            window.open(
                enlace,
                "_blank",
                "noopener,noreferrer"
            );

        });

    }


    // ==========================================
    // 12. FORMULARIO DE CONTACTO
    // ==========================================

    const formulario =
        document.getElementById("formulario");

    if (formulario) {

        formulario.addEventListener("submit", function (e) {

            e.preventDefault();

            if (!formulario.reportValidity()) return;


            const nombre =
                document.getElementById("nombre").value.trim();

            const correo =
                document.getElementById("correo").value.trim();

            const mensajeUsuario =
                document.getElementById("mensajeUsuario").value.trim();


            if (!nombre || !correo || !mensajeUsuario) {

                mostrarMensaje(
                    "Completa todos los campos.",
                    "error"
                );

                return;

            }


            const contenido =
                "¡Hola VITALOE! Tengo una consulta.\n\n" +
                "Nombre: " + nombre + "\n" +
                "Correo: " + correo + "\n" +
                "Mensaje: " + mensajeUsuario;


            const enlace =
                "https://wa.me/" +
                NUMERO_WHATSAPP +
                "?text=" +
                encodeURIComponent(contenido);


            window.open(
                enlace,
                "_blank",
                "noopener,noreferrer"
            );


            mostrarMensaje(
                "✅ Se preparó tu consulta en WhatsApp."
            );

            formulario.reset();

        });

    }


    // ==========================================
    // 13. BOTÓN FLOTANTE WHATSAPP
    // ==========================================

    const whatsapp =
        document.querySelector(".whatsapp");

    if (whatsapp) {

        whatsapp.href =
            "https://wa.me/" +
            NUMERO_WHATSAPP +
            "?text=" +
            encodeURIComponent(
                "Hola VITALOE, quisiera información sobre sus productos."
            );

        whatsapp.target = "_blank";

        whatsapp.rel = "noopener noreferrer";

    }


    // ==========================================
    // 14. ANIMACIÓN DE PRODUCTOS
    // ==========================================

    const tarjetas =
        document.querySelectorAll(".producto-card");

    if ("IntersectionObserver" in window) {

        const observador = new IntersectionObserver(

            function (entradas) {

                entradas.forEach(function (entrada) {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add("visible");

                        observador.unobserve(entrada.target);

                    }

                });

            },

            { threshold: 0.12 }

        );


        tarjetas.forEach(function (tarjeta) {

            observador.observe(tarjeta);

        });

    } else {

        tarjetas.forEach(function (tarjeta) {

            tarjeta.classList.add("visible");

        });

    }


    // ==========================================
    // 15. MENÚ RESPONSIVE
    // ==========================================

    const enlaces =
        document.querySelectorAll(".navbar-nav .nav-link");

    const menu =
        document.getElementById("menu");

    enlaces.forEach(function (enlace) {

        enlace.addEventListener("click", function () {

            enlaces.forEach(function (elemento) {

                elemento.classList.remove("active");

            });

            enlace.classList.add("active");


            if (
                menu &&
                menu.classList.contains("show") &&
                typeof bootstrap !== "undefined"
            ) {

                bootstrap.Collapse
                    .getOrCreateInstance(menu)
                    .hide();

            }

        });

    });


    // ==========================================
    // 16. AÑO AUTOMÁTICO
    // ==========================================

    const copyright =
        document.getElementById("copyright");

    if (copyright) {

        copyright.textContent =
            "© " +
            new Date().getFullYear() +
            " VITALOE. Todos los derechos reservados.";

    }


    // ==========================================
    // 17. INICIALIZAR CARRITO
    // ==========================================

    actualizarCarrito();

});
