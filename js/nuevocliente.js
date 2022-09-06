import { conectarDB, validarCliente } from './funciones.js';
import { formulario } from './selectores.js';


window.onload = () => {
    // Definir eventos
    formulario.addEventListener('submit', validarCliente);

    // Conectar a la base de datos
    conectarDB();
}
