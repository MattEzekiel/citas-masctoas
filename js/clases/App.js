import {
    fechaInput,
    formulario,
    horaInput,
    mascotaInput,
    propietarioInput,
    sintomasInput,
    telefonoInput
} from "../selectores.js";
import {crearDB, datosCita, nuevaCita} from "../funciones.js";

class App {
    constructor() {
        this.initApp();
    }

    initApp() {
        mascotaInput.addEventListener('input',datosCita);
        propietarioInput.addEventListener('input',datosCita);
        telefonoInput.addEventListener('input',datosCita);
        fechaInput.addEventListener('input',datosCita);
        horaInput.addEventListener('input',datosCita);
        sintomasInput.addEventListener('input',datosCita);

        // Formulario
        formulario.addEventListener('submit', nuevaCita);

        // BBDD
        crearDB();
    }
}

export default App;