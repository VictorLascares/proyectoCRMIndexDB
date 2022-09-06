import { formulario, contenedorForm, listadoClientes } from './selectores.js';

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

   // Objeto con la informacion del cliente
   const cliente = { nombre, correo, telefono, empresa, id: generarId() };
   agregarCliente(cliente);
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

// Generar un identificador unico
function generarId() {
   const random = Math.random().toString(36).substring(2);
   const fecha = Date.now().toString(36);
   return random + fecha;
}

// Agregar un cliente a la base de datos
function agregarCliente(cliente) {
   const transaction = DB.transaction(['crm'], 'readwrite');

   const objectStore = transaction.objectStore('crm');

   objectStore.add(cliente);

   transaction.onerror = function() {
      imprimirAlerta('Ocurrio un error al tratar de agregar el cliente', 'error');
   }

   transaction.oncomplete = function() {
      imprimirAlerta('Cliente agregado correctamente','exito');
      formulario.reset();
   }
}

// Mostrar en pantalla los clientes agregados
function mostrarClientes() {
   const abrirConexion = window.indexedDB.open('crm',1);

   abrirConexion.onerror = function() {
      console.log('Ocurrio un error al tratar de conectar a la base de datos');
   }

   abrirConexion.onsuccess = function() {
      DB = abrirConexion.result;
      //Leer el contenido de la base de datos
      const objectStore = DB.transaction('crm').objectStore('crm');

      objectStore.openCursor().onsuccess = function(e) {
         const cursor = e.target.result;

         if (cursor) {
            const { nombre, correo, telefono, empresa, id } = cursor.value;
            const rowCliente = document.createElement('tr');

            const nombreCliente = document.createElement('td');
            const textoNombre = document.createElement('p');
            const textoCorreo  = document.createElement('p');

            textoNombre.classList.add('text-sm','leading-5','text-gray-700','font-bold')
            textoNombre.textContent = nombre;

            textoCorreo.classList.add('text-sm','leading-10','text-gray-700');
            textoCorreo.textContent = correo;

            nombreCliente.classList.add('px-6','py-4','border-b', 'border-gray-200','whitespace-no-wrap');

            nombreCliente.appendChild(textoNombre);
            nombreCliente.appendChild(textoCorreo);

            const telefonoCliente = document.createElement('td');
            telefonoCliente.classList.add('px-6','py-4','border-b', 'border-gray-200','text-gray-600');
            telefonoCliente.textContent = telefono;

            const empresaCliente = document.createElement('td');
            empresaCliente.classList.add('px-6','py-4','border-b', 'border-gray-200', 'text-gray-600');
            empresaCliente.textContent = empresa;
            
            const accionesCliente = document.createElement('td');
            accionesCliente.classList.add('px-6','py-4','border-b', 'border-gray-200');
            // Boton para eliminar cliente
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('bg-red-200','text-red-700','mr-2','px-3','py-1','hover:bg-red-400');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarCliente(id);

            // Boton para editar cliente
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('bg-blue-200','text-blue-700','px-3','py-1','hover:bg-blue-400');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => editarCliente(id);

            accionesCliente.appendChild(btnEliminar);
            accionesCliente.appendChild(btnEditar);

            // Agregando las propiedades del cliente al rowCliente
            rowCliente.appendChild(nombreCliente);
            rowCliente.appendChild(telefonoCliente);
            rowCliente.appendChild(empresaCliente);
            rowCliente.appendChild(accionesCliente);

            // Agregar el cliente al HTML
            listadoClientes.appendChild(rowCliente);

            // Ve al siguiente elemento
            cursor.continue();
         }
      }
   }

}

function eliminarCliente(id)  {
   console.log(`Eliminando al cliente ${id}`);
}

function editarCliente(id) {
   console.log(`Editando al cliente ${id}`);
}

export { crearDB, conectarDB, validarCliente, mostrarClientes };
