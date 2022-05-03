import { cargarEdicion, eliminarCita } from "../funciones.js";
import { contenedorCita } from '../selectores.js';

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

    imprimirCitas(DB) {
        this.limpiarHtml();

        // Leer el contenido de la base de datos
        const objStore = DB.transaction('citas').objectStore('citas');

        /*const total = objStore.count();
        total.onsuccess = function () {
            console.log(total.result);
        }*/

        objStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;

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
                const cita = cursor.value
                btnEditar.className = 'btn btn-warning mr-2';
                btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\n' +
                    '  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />\n' +
                    '</svg>';
                btnEditar.onclick = () => cargarEdicion(cita);

                divCita.appendChild(mascotaH);
                divCita.appendChild(propietarioP);
                divCita.appendChild(telP);
                divCita.appendChild(fechaP);
                divCita.appendChild(horaP);
                divCita.appendChild(sintomaP);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);

                contenedorCita.appendChild(divCita);

                // Siguiente elemento
                cursor.continue();
            }
        }

    }

    limpiarHtml() {
        while (contenedorCita.firstChild) {
            contenedorCita.removeChild(contenedorCita.firstChild);
        }
    }
}

export default UI;