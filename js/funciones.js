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
        ui.imprimirAlerta('Editado correctamente','success');
        citas.editarCita({...citaObj});
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        editando = false;
    } else {
        citaObj.id = Date.now();
        citas.agregarCita({...citaObj});
        ui.imprimirAlerta('Se agregó correctamente','success');
    }

    reiniciarObj();
    formulario.reset();

    ui.imprimirCitas(citas);
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
    citas.eliminarCita(id);

    // Mostrar mensaje de cita eliminada
    ui.imprimirAlerta('Cita eliminada con éxito','success');

    // Refrescar
    ui.imprimirCitas(citas);
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