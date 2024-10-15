        // Referencias a los campos de descripción y archivo de texto
        const descripcionField = document.getElementById('descripcion');
        const textFileField = document.getElementById('textFile');

        // Deshabilitar uno cuando el otro tiene contenido
        descripcionField.addEventListener('input', function() {
            if (this.value.trim() !== "") {
                textFileField.disabled = true; // Deshabilitar el archivo
                textFileField.disabled = true; // Deshabilitar el archivo de texto si hay contenido en la descripción
            } else {
                textFileField.disabled = false; // Habilitar el archivo de texto si la descripción está vacía
            }
        });

        textFileField.addEventListener('change', function() {
            if (this.files.length > 0) {
                descripcionField.disabled = true; // Deshabilitar la descripción si se selecciona un archivo de texto
            } else {
                descripcionField.disabled = false; // Habilitar la descripción si no se selecciona ningún archivo
            }
        });

        // Actualizar el texto cuando se selecciona un archivo
        document.getElementById('musica').addEventListener('change', function() {
            document.getElementById('selected-music').textContent = this.files.length > 0 ? this.files[0].name : 'No hay archivo seleccionado';
        });

        document.getElementById('caratula').addEventListener('change', function() {
            document.getElementById('selected-caratula').textContent = this.files.length > 0 ? this.files[0].name : 'No hay archivo seleccionado';
        });

        document.getElementById('textFile').addEventListener('change', function() {
            document.getElementById('selected-txt').textContent = this.files.length > 0 ? this.files[0].name : 'No hay archivo seleccionado';
        });

        // Validación del formulario para asegurar que se seleccionen la canción y la carátula
        document.getElementById('addSongForm').addEventListener('submit', function(event) {
            const musicaInput = document.getElementById('musica').files.length;
            const caratulaInput = document.getElementById('caratula').files.length;

            if (musicaInput === 0 || caratulaInput === 0) {
                event.preventDefault();  // Evita que el formulario se envíe
                alert('Debes seleccionar una canción y una carátula antes de enviar.');
            }
        });
