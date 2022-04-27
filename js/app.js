// Variables
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
const formulario = document.querySelector('#nueva-cita');
const contenedorCita = document.querySelector('#citas');

let editando;

// Listeners
document.addEventListener('DOMContentLoaded', () => {
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);
    formulario.addEventListener('submit', nuevaCita);
});

// Clases
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [... this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}
const citas = new Citas();

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Creando y seteando el elemento
        const pMensaje = document.createElement('p');
        pMensaje.className = 'text-center alert w-100';

        // Tipo de error
        if (tipo === 'error') {
            pMensaje.classList.add('alert-danger');
        } else {
            pMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        pMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(pMensaje,document.querySelector('.agregar-cita'));

        setTimeout(() => {
            pMensaje.remove();
        },3000)
    }

    imprimirCitas({citas}) {
        this.limpiarHtml();

       citas.forEach( cita => {
           const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

           const divCita = document.createElement('div');
           divCita.classList.add('cita','p-3');
           divCita.setAttribute('id',id);

           const mascotaH = document.createElement('h2');
           mascotaH.className = 'card-title font-weight-bolder';
           mascotaH.textContent = mascota;

           const propietarioP = document.createElement('p');
           propietarioP.innerHTML = `<span class="font-weight-bolder">Propietario: </span>${propietario}`;

           const telP = document.createElement('p');
           telP.innerHTML = `<span class="font-weight-bolder">Telefono: </span>${telefono}`;

           const fechaP = document.createElement('p');
           fechaP.innerHTML = `<span class="font-weight-bolder">Fecha: </span>${fecha}`;

           const horaP = document.createElement('p');
           horaP.innerHTML = `<span class="font-weight-bolder">Hora: </span>${hora}`;

           const sintomaP = document.createElement('p');
           sintomaP.innerHTML = `<span class="font-weight-bolder">Sintomas: </span>${sintomas}`;

           // Botón para eliminar
           const btnEliminar = document.createElement('button');
           btnEliminar.className = 'btn btn-danger mr-2';
           btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\n' +
               '  <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />\n' +
               '</svg>';
           btnEliminar.onclick = () => eliminarCita(id);

           // Botón para editar
           const btnEditar = document.createElement('button');
           btnEditar.className = 'btn btn-warning mr-2';
           btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\n' +
               '  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />\n' +
               '</svg>';
           btnEditar.onclick = () => cargarEdicion(cita)

           divCita.appendChild(mascotaH);
           divCita.appendChild(propietarioP);
           divCita.appendChild(telP);
           divCita.appendChild(fechaP);
           divCita.appendChild(horaP);
           divCita.appendChild(sintomaP);
           divCita.appendChild(btnEliminar);
           divCita.appendChild(btnEditar);

           contenedorCita.appendChild(divCita);

       });
    }

    limpiarHtml() {
        while (contenedorCita.firstChild) {
            contenedorCita.removeChild(contenedorCita.firstChild);
        }
    }
}
const ui = new UI();

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
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

function nuevaCita(e) {
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

function reiniciarObj() {
    citaObj.hora = '';
    citaObj.fecha = '';
    citaObj.telefono = '';
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    // Eliminar la cita
    citas.eliminarCita(id);

    // Mostrar mensaje de cita eliminada
    ui.imprimirAlerta('Cita eliminada con éxito','success');

    // Refrescar
    ui.imprimirCitas(citas);
}

function cargarEdicion(cita) {
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