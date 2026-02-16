// Seleccionamos el botón de volver arriba
const btnTop = document.getElementById("btn-top");

// Escuchamos el evento de scroll en la ventana
window.addEventListener("scroll", () => {
    // Si bajamos más de 300 píxeles, mostramos el botón
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnTop.style.display = "block";
    } else {
        // Si estamos arriba, lo ocultamos
        btnTop.style.display = "none";
    }
});

// Cuando se hace clic en el botón, volvemos arriba suavemente
btnTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Esto hace que el salto no sea brusco
    });
});
