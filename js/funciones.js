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

export { crearDB };
