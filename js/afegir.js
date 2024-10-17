// Referencias a los campos de descripción y archivo de texto
const descripcionField = document.getElementById('descripcion');  // Campo de texto de descripción
const textFileField = document.getElementById('textFile');  // Campo de selección de archivo de texto

// Deshabilitar el archivo de texto cuando hay contenido en el campo de descripción
descripcionField.addEventListener('input', function() {
    if (this.value.trim() !== "") {  // Si hay contenido en la descripción
        textFileField.disabled = true;  // Deshabilitar la selección de archivo de texto
    } else {
        textFileField.disabled = false;  // Habilitar la selección de archivo si la descripción está vacía
    }
});

// Deshabilitar la descripción cuando se selecciona un archivo de texto
textFileField.addEventListener('change', function() {
    if (this.files.length > 0) {  // Si se ha seleccionado un archivo de texto
        descripcionField.disabled = true;  // Deshabilitar el campo de descripción
    } else {
        descripcionField.disabled = false;  // Habilitar la descripción si no hay archivo seleccionado
    }
});

// Actualizar el texto cuando se selecciona un archivo de música
document.getElementById('musica').addEventListener('change', function() {
    // Mostrar el nombre del archivo de música seleccionado o 'No hay archivo seleccionado' si no se selecciona nada
    document.getElementById('selected-music').textContent = this.files.length > 0 ? this.files[0].name : 'No hay archivo seleccionado';
});

// Actualizar el texto cuando se selecciona una nueva carátula
document.getElementById('caratula').addEventListener('change', function() {
    // Mostrar el nombre del archivo de carátula seleccionado o 'No hay archivo seleccionado' si no se selecciona nada
    document.getElementById('selected-caratula').textContent = this.files.length > 0 ? this.files[0].name : 'No hay archivo seleccionado';
});

// Actualizar el texto cuando se selecciona un nuevo archivo de texto
document.getElementById('textFile').addEventListener('change', function() {
    // Mostrar el nombre del archivo de texto seleccionado o 'No hay archivo seleccionado' si no se selecciona nada
    document.getElementById('selected-txt').textContent = this.files.length > 0 ? this.files[0].name : 'No hay archivo seleccionado';
});

// Validación del formulario para asegurar que se seleccionen tanto la canción como la carátula
document.getElementById('addSongForm').addEventListener('submit', function(event) {
    const musicaInput = document.getElementById('musica').files.length;  // Número de archivos seleccionados en el campo de música
    const caratulaInput = document.getElementById('caratula').files.length;  // Número de archivos seleccionados en el campo de carátula

    // Verificar si no se han seleccionado la canción o la carátula
    if (musicaInput === 0 || caratulaInput === 0) {
        event.preventDefault();  // Evitar el envío del formulario si no se han seleccionado ambos archivos
        alert('Debes seleccionar una canción y una carátula antes de enviar.');  // Mostrar una alerta al usuario
    }
});
