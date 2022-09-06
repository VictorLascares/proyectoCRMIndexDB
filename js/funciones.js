import { formulario, contenedorForm } from './selectores.js';

let DB;

// Crear la base de datos de IndexDB
function crearDB() {
   const crearDB = window.indexedDB.open('crm', 1); 


   crearDB.onerror = function() {
      console.log('Ocurrio un error');
   }

   crearDB.onsuccess = function() {
      DB = crearDB.result;
   }

   crearDB.onupgradeneeded = function(e) {
      const db = e.target.result;

      const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true }); 

      // Campos del cliente
      objectStore.createIndex('nombre', 'nombre', { unique: false });
      objectStore.createIndex('correo', 'correo', { unique: true });
      objectStore.createIndex('telefono', 'telefono', { unique: false });
      objectStore.createIndex('empresa', 'empresa', { unique: false });
      objectStore.createIndex('id', 'id', { unique: true });

      console.log('Base de datos creada');
   }
}

// Conectar a la base de datos
function conectarDB() {
   const abrirConexion = window.indexedDB.open('crm',1);

   abrirConexion.onerror = function() {
      console.log('Ocurrio un error al tratar de conectar a la base de datos');
   }

   abrirConexion.onsuccess = function() {
      DB = abrirConexion.result;
   }
}

// Validacion de formulario
function validarCliente(e) {
   e.preventDefault();
   
   // Leer todos los inputs
   const nombre = document.querySelector('#nombre').value;
   const correo = document.querySelector('#email').value;
   const telefono = document.querySelector('#telefono').value;
   const empresa = document.querySelector('#empresa').value;

   if (!nombre || !correo || !telefono || !empresa) {
      imprimirAlerta('Todos los campos son obligatorios', 'error');
      return;
   }
}

// Crear Alerta
function imprimirAlerta(mensaje, tipo) {
   const alerta = document.querySelector('.alerta');

   if (!alerta) {
      const divMensaje = document.createElement('div');
      divMensaje.classList.add('px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','sticky','bottom-0','alerta');

      if (tipo === 'error') {
         divMensaje.classList.add('bg-red-200','text-red-700');
      } else {
         divMensaje.classList.add('bg-green-200','text-green-700');
      }

      divMensaje.textContent = mensaje;
      contenedorForm.appendChild(divMensaje);
      
      setTimeout(() => {
         divMensaje.remove();
      }, 3000); 
   }

   
}

export { crearDB, conectarDB, validarCliente };
