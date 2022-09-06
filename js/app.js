import { crearDB, mostrarClientes } from './funciones.js';

window.onload = () => {
    crearDB();

    if (window.indexedDB.open('crm',1)) {
        mostrarClientes();
    }
} 
