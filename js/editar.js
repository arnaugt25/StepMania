// Actualizar el texto cuando se selecciona un nuevo archivo de música
document.getElementById('musica').addEventListener('change', function() {
    const selectedFile = this.files[0];  // Obtener el archivo seleccionado por el usuario
    const displaySpan = document.getElementById('current-music');  // Elemento donde se mostrará el nombre del archivo
    // Si hay un archivo seleccionado, mostrar su nombre; de lo contrario, mostrar "No file selected"
    displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';
});

// Actualizar el texto cuando se selecciona una nueva carátula
document.getElementById('caratula').addEventListener('change', function() {
    const selectedFile = this.files[0];  // Obtener el archivo de imagen seleccionado
    const displaySpan = document.getElementById('current-caratula');  // Elemento donde se mostrará el nombre del archivo
    // Si hay un archivo seleccionado, mostrar su nombre; de lo contrario, mostrar "No file selected"
    displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';
});

// Actualizar el texto cuando se selecciona un nuevo archivo de texto
document.getElementById('textFile').addEventListener('change', function() {
    const selectedFile = this.files[0];  // Obtener el archivo de texto seleccionado
    const displaySpan = document.getElementById('current-text');  // Elemento donde se mostrará el nombre del archivo
    const descriptionField = document.getElementById('descripcion');  // Campo de descripción

    // Mostrar el nombre del archivo seleccionado o "No file selected" si no se ha seleccionado nada
    displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';

    // Si se selecciona un archivo, desactivar el campo de descripción
    if (selectedFile) {
        descriptionField.disabled = true;  // Desactivar la descripción
    } else {
        descriptionField.disabled = false;  // Reactivar la descripción si no se selecciona un archivo
    }
});

// Deshabilitar el campo de archivo si se escribe en la descripción
document.getElementById('descripcion').addEventListener('input', function() {
    const textFileInput = document.getElementById('textFile');  // Campo de selección de archivo de texto
    // Si el campo de descripción no está vacío, desactivar el campo de selección de archivo de texto
    if (this.value.trim().length > 0) {
        textFileInput.disabled = true;  // Desactivar la selección de archivo de texto
    } else {
        textFileInput.disabled = false;  // Reactivar la selección de archivo si se borra la descripción
    }
}); 
