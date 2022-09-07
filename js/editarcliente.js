import { obtenerDatosCliente, editarCliente } from './funciones.js';
import { formulario } from './selectores.js';

window.onload = function() {
    obtenerDatosCliente();

    formulario.addEventListener('submit', editarCliente);
}
