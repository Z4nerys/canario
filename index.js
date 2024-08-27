document.addEventListener('DOMContentLoaded', async () => {
    const categorias = await cargarProductos();

    if (categorias) {
        renderizarCategorias(categorias);
    }
});

async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        const products = await response.json();
        return products.categorias;
    } catch (error) {
        return null;
    }
}

function renderizarCategorias(categorias) {
    const contenedor = document.getElementById('categoria');

    categorias.forEach(categoria => {
        const card = document.createElement('div');
        card.classList.add('cardIndex');

        card.innerHTML = `
            <img src="${categoria.imagen}" alt="${categoria.nombre}">
            <div class="card-content">
                <h3>${categoria.nombre}</h3>
                <p>${categoria.descripcion}</p>
            </div>
            <button value="${categoria.id}" class="btn-seleccionar">Ver Productos</button>
        `;

        contenedor.appendChild(card);
    });

    // Añadir eventos a los botones "Ver Productos"
    const botones = document.querySelectorAll('.btn-seleccionar');
    botones.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const categoriaId = event.target.value;
            window.location.href = `productos.html?id=${categoriaId}`;
        });
    });
}