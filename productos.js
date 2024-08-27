document.addEventListener('DOMContentLoaded', async () => {
    const categoriaSelect = document.getElementById("categoria-select");

    const products = await cargarProductos();
    if (products) {
        const productos = products.productos;
        const categorias = products.categorias;
        const telefono = products.telefono;

        const urlParams = new URLSearchParams(window.location.search);
        // Es el id del producto que viene por la URL de categorías
        const productoID = urlParams.get('id');

        // Rellenar el menú de categorías
        categoriaSelect.innerHTML = '';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            categoriaSelect.appendChild(option);
        });

        // Seleccionar la opción que corresponde al id de la URL, si existe
        if (productoID) {
            categoriaSelect.value = productoID;
            mostrarProductos(productoID, productos, telefono);
        } else {
            // Selecciona la primera categoría si no hay id en la URL
            categoriaSelect.value = categorias[0].id;
            mostrarProductos(categorias[0].id, productos, telefono);
        }

        // Actualizar productos al cambiar la categoría desde el select
        categoriaSelect.addEventListener('change', (e) => {
            const categoriaSeleccionada = e.target.value;
            mostrarProductos(categoriaSeleccionada, productos, telefono);
        });

    } else {
        const contenedorProductos = document.getElementById("nuestros-productos");
        contenedorProductos.innerHTML = `<div style="height: 50vh;">No hay productos!</div>`;
    }
});

async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        const products = await response.json();
        return products;
    } catch (error) {
        return null;
    }
}

const mostrarProductos = (categoria, productos, telefono) => {
    const contenedorProductos = document.getElementById("nuestros-productos");
    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    contenedorProductos.innerHTML = '';

    productosFiltrados.forEach(producto => {
        const productCard = document.createElement("div");
        productCard.className = "card";
        productCard.innerHTML = `
            <div class="card-image" data-src="${producto.imagen}"></div>
            <div class="card-content">
                <h3 class="card-title">${producto.titulo}</h3>
                <p class="card-description">${producto.descripcion}</p>
                <p class="card-price">${producto.precio}</p>
                <div class="card-footer">
                    <p class="card-stock">${producto.stock ? 'En stock' : 'Agotado'}</p>
                    <a href="https://wa.me/${telefono}?text=Hola!%20Estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(producto.titulo)}" class="card-button" target="_blank">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(productCard);
    });

    // Implementar lazy loading para las imágenes de fondo
    lazyLoadImages();
}

function lazyLoadImages() {
    const cards = document.querySelectorAll('.card-image');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cardImage = entry.target;
                const src = cardImage.getAttribute('data-src');
                cardImage.style.backgroundImage = `url('${src}')`;
                observer.unobserve(cardImage);
            }
        });
    });

    cards.forEach(card => observer.observe(card));
}