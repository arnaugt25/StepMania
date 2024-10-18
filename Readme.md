# Simulador de Ball - StepMania Project

## Descripció

Aquest projecte és una aplicació web inspirada en jocs rítmics com *StepMania*, on els usuaris poden afegir, jugar i gestionar cançons. L'objectiu és prémer les tecles correctes en el moment adequat seguint el ritme de la música, aconseguint així la màxima puntuació.

## Funcionalitats Principals

- **Afegir Cançons**: Pujar noves cançons, amb caràtules, música i les seqüències de joc.
- **Jugar Cançons**: Reproduir la cançó seleccionada mentre es premen les tecles correctes seguint el ritme.
- **Classificació**: Guarda i mostra les puntuacions dels jugadors en una taula de rànquings.
- **Editar/Eliminar Cançons**: Modificar o eliminar cançons existents.
- **Interfície Amigable**: Disseny responsiu i clar, apte per a tot tipus de dispositius.

## Estructura del Projecte

### **/css/**:
- **font/**: Tipus de lletra utilitzats en l'aplicació.
- **img/**: Imatges que s'utilitzen, com les caràtules de les cançons.
- **styles.css**: Full d'estils principal que defineix l'aparença de totes les pàgines.

### **/js/**:
- **afegir.js**: Lògica per gestionar la pujada de noves cançons.
- **editar.js**: Gestió de la modificació de cançons existents.
- **game.js**: Codi que gestiona la lògica del joc en si, sincronitzant les tecles amb la música.
- **playlist.js**: Gestió de la llista de reproducció de cançons.
- **ranking.js** i **ranking2.js**: Gestionen la visualització i actualització de les classificacions.
- **script.js**: Conté funcions auxiliars generals utilitzades en diferents parts de l'aplicació.

### **/json/**:
- Conté fitxers JSON per gestionar les dades de les cançons i les seves seqüències.

### **/php/**:
- **editar.php**: Lògica del servidor per editar cançons.
- **eliminar.php**: S'encarrega d'eliminar cançons de la base de dades.
- **game.php**: Gestiona les dades del joc en el servidor.
- **playlist.php**: Gestiona les llistes de reproducció des del backend.
- **save_ranking.php**: Desa les puntuacions dels jugadors al rànquing.

### **/uploads/**:
- Carpeta on es guarden les cançons, caràtules i fitxers de tecles pujats pels usuaris.

### Fitxers HTML:
- **afegir.html**: Formulari per pujar noves cançons.
- **index.html**: Pàgina d'inici.
- **playlist.html**: Mostra la llista de cançons disponibles.
- **ranking.html**: Taula amb les millors puntuacions.

## Requisits del Sistema

- **PHP** 7.4 o superior.
- **Servidor Web**: Apache, Nginx, o servidor local com XAMPP o WAMP.
- **Navegador modern**: Chrome, Firefox, Edge.
- Opcional: **WireGuard** per a una xarxa VPN si es vol accedir de manera segura en entorns de producció.

## Instal·lació

1. Clona el repositori:
    ```bash
    git clone https://github.com/arnaugt25/StepMania.git
    ```

2. Navega al directori del projecte:
    ```bash
    cd StepMania
    ```

3. Executa el servidor PHP:
    ```bash
    php -S localhost:8080
    ```

4. Accedeix a l'aplicació des del navegador:
    ```bash
    http://localhost:8080
    ```

## Utilització

1. **Pantalla d'Inici**: Introdueix el teu nom per començar.
2. **Afegir Cançons**: Pujar noves cançons i seqüències de joc a través d'un formulari.
3. **Jugar**: Selecciona una cançó i comença a jugar prement les tecles correctes seguint el ritme.
4. **Classificació**: Després de cada partida, es desa la puntuació a la taula de classificacions.

## Millores Futures

- **Mode multijugador**: Competir amb altres jugadors en temps real.
- **Compatibilitat amb dispositius físics de ball**: Afegir suport per a catifes de ball i altres controladors.
- **Nivells de dificultat**: Diferents nivells per adaptar el joc a diferents habilitats.
- **Personalització de perfils**: Permet als jugadors personalitzar els seus perfils amb avatars i informació personalitzada.

## Llicència

Aquest projecte està sota la llicència **MIT**, la qual cosa permet l'ús, modificació i distribució lliure del codi, sempre que es mantinguin els crèdits originals.
