import Citas from "./clases/Citas.js";
import UI from './clases/UI.js';
import {
    mascotaInput,
    formulario,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput
} from './selectores.js';

const citas = new Citas();
const ui = new UI();

let editando;
let DB;

// Objeto
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

// Funciones
export function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e) {
    e.preventDefault();

    // Extraer Info
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        return ui.imprimirAlerta('Todos los campos son obligatorios','error');
    }

    if (editando) {
        citas.editarCita({...citaObj});
        const transaction = DB.transaction(['citas'],"readwrite");
        const objStore = transaction.objectStore('citas');
        objStore.put(citaObj);

        transaction.oncomplete = () => {
            ui.imprimirAlerta('Editado correctamente','success');
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            editando = false;
        }

        transaction.onerror = () => {
            ui.imprimirAlerta('Hubo un error','error');
        }
    } else {
        citaObj.id = Date.now();
        citas.agregarCita({...citaObj});

        // Insertar registro en indexedDB
        const transaction = DB.transaction(['citas'],'readwrite');
        const objStore = transaction.objectStore('citas');

        objStore.add(citaObj);

        transaction.oncomplete =  () => {
            ui.imprimirAlerta('Se agregó correctamente','success');
        }
    }

    reiniciarObj();
    formulario.reset();

    ui.imprimirCitas(DB);
}

export function reiniciarObj() {
    citaObj.hora = '';
    citaObj.fecha = '';
    citaObj.telefono = '';
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.sintomas = '';
}

export function eliminarCita(id) {
    // Eliminar la cita
    const transaction = DB.transaction(['citas'],"readwrite");
    const objStore  = transaction.objectStore('citas');

    objStore.delete(id);

    transaction.oncomplete = () => {
        // Mostrar mensaje de cita eliminada
        ui.imprimirAlerta('Cita eliminada con éxito','success');

        // Refrescar
        ui.imprimirCitas(DB);
    }

    transaction.onerror = () => {
        ui.imprimirAlerta('Hubo un error','error');
    }
}

export function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar los cambios';

    editando = true;
}

export function crearDB() {
    const crearDB = window.indexedDB.open('citas',1);

    // si hay un error
    crearDB.onerror = function () {
        console.error('Hubo un error al crear la base de datos')
    }

    // Todo ok
    crearDB.onsuccess = function () {
        DB = crearDB.result;
        ui.imprimirCitas(DB);
    }

    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });

        objStore.createIndex('mascota','mascota', { unique: false });
        objStore.createIndex('propietario','propietario', { unique: false });
        objStore.createIndex('telefono','telefono', { unique: false });
        objStore.createIndex('fecha','fecha', { unique: false });
        objStore.createIndex('hora','hora', { unique: false });
        objStore.createIndex('sintomas','sintomas', { unique: false });
        objStore.createIndex('id','id', { unique: true });

        // console.log('DB Lista');
    }
}