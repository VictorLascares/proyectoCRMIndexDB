import { validarCliente } from './funciones.js';
import { formulario } from './selectores.js';


window.onload = () => {
    // Definir eventos
    formulario.addEventListener('submit', validarCliente);
}
