import { inputNombre, inputCorreo, inputTelefono, inputEmpresa, formulario, contenedorForm, listadoClientes } from './selectores.js';

let DB;
let idCliente;

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

// Validacion de formulario
function validarCliente(e) {
   e.preventDefault();
   
   // Leer todos los inputs
   const nombre = inputNombre.value;
   const correo = inputCorreo.value;
   const telefono = inputTelefono.value;
   const empresa = inputEmpresa.value;

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
      divMensaje.classList.add('px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','alerta');

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
   const abrirConexion = window.indexedDB.open('crm',1);

   abrirConexion.onerror = function() {
      console.log('Ocurrio un error al tratar de conectar a la base de datos');
   }

   abrirConexion.onsuccess = function() {
      DB = abrirConexion.result;
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
}

function limpiarHTML()  {
   while(listadoClientes.firstChild) {
      listadoClientes.removeChild(listadoClientes.firstChild);
   }
}

// Mostrar en pantalla los clientes agregados
function mostrarClientes() {
   limpiarHTML();
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
            btnEliminar.classList.add('bg-red-200','text-red-700','mr-2','px-3','py-2','hover:bg-red-400','leading-tight');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarCliente(id);

            // Boton para editar cliente
            const btnEditar = document.createElement('a');
            btnEditar.classList.add('bg-blue-200','text-blue-700','px-3','py-2','hover:bg-blue-400');
            btnEditar.href = `editar-cliente.html?id=${id}`;
            btnEditar.textContent = 'Editar';

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

function obtenerDatosCliente() {
   // Verificar el ID de la URL
   const parametroURL = new URLSearchParams(window.location.search);
   idCliente = parametroURL.get('id');
   if(idCliente) {
      const abrirConexion = window.indexedDB.open('crm',1);

      abrirConexion.onerror = function() {
         console.log('Error al tratar de conectar a la base de datos');
      }
      abrirConexion.onsuccess = function() {
         DB = abrirConexion.result;
         
         const transaction = DB.transaction(['crm'], 'readwrite');
         const objectStore = transaction.objectStore('crm');
         
         const cliente = objectStore.openCursor();
         cliente.onsuccess = function(e) {
            const cursor = e.target.result;
            if (cursor) {
               if (cursor.value.id === idCliente) {
                  llenarFormulario(cursor.value);
                  return;
               }
               cursor.continue();
            }
         }
      }
   }
}

function llenarFormulario(datosCliente) {
   const { nombre, correo, telefono, empresa } = datosCliente;
   inputNombre.value = nombre;
   inputCorreo.value = correo;
   inputTelefono.value = telefono;
   inputEmpresa.value = empresa;
}

function eliminarCliente(id)  {
   const transaction = DB.transaction(['crm'], 'readwrite');
   const objectStore = transaction.objectStore('crm'); 
   objectStore.delete(id);
   transaction.oncomplete = function() {
      mostrarClientes();
   }
}

function editarCliente(e) {
   e.preventDefault();
   const nombre = inputNombre.value;
   const correo = inputCorreo.value;
   const telefono = inputTelefono.value;
   const empresa = inputEmpresa.value;
   if ( !nombre || !correo || !telefono || !empresa ) {
      imprimirAlerta('Todos los campos son obligatorios', 'error');
      return;
   }

   // Actualizar cliente
   const clienteActualizado = { nombre, correo, telefono, empresa, id: idCliente };
   
   const transaction = DB.transaction(['crm'], 'readwrite');
   const objectStore = transaction.objectStore('crm');
   objectStore.put(clienteActualizado);
   transaction.onerror = function() {
      imprimirAlerta('Ocurrio un error al tratar de editar el cliente', 'error');
   }

   transaction.oncomplete = function() {
      imprimirAlerta('Cliente actualizado correctamente','exito');
   }
}

export { crearDB, validarCliente, mostrarClientes, obtenerDatosCliente, editarCliente };
