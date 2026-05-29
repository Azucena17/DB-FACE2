let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

function iniciarSesion() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === "admin" && password === "1234") {
        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("appScreen").classList.remove("hidden");

        mostrarFecha();
        consultarEstado();
        actualizarTablas();
        mostrarToast("Bienvenido a Banco UMG");
    } else {
        mostrarToast("Usuario o contraseña incorrectos", true);
    }
}

function cerrarSesion() {
    document.getElementById("appScreen").classList.add("hidden");
    document.getElementById("loginScreen").classList.remove("hidden");
    mostrarToast("Sesión cerrada");
}

function mostrarModulo(id) {
    document.querySelectorAll(".modulo").forEach(modulo => {
        modulo.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
    actualizarTablas();
}

function mostrarFecha() {
    document.getElementById("fechaActual").innerText =
        new Date().toLocaleDateString("es-GT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}

function consultarEstado() {
    document.getElementById("estadoSistema").innerHTML = `
        <strong>Banco UMG</strong><br>
        Estado: <strong style="color:#15803d;">EN LÍNEA</strong><br>
        Sistema bancario funcionando correctamente.<br>
        <small>${new Date().toLocaleString()}</small>
    `;

    mostrarToast("Estado actualizado correctamente");
}

function registrarCliente() {
    const nombre = document.getElementById("nombreCliente").value.trim();
    const dpi = document.getElementById("dpiCliente").value.trim();
    const correo = document.getElementById("correoCliente").value.trim();
    const telefono = document.getElementById("telefonoCliente").value.trim();
    const mensaje = document.getElementById("mensajeCliente");

    mensaje.style.color = "#dc2626";

    if (nombre === "" || dpi === "" || correo === "" || telefono === "") {
        mensaje.innerText = "Todos los campos son obligatorios.";
        return;
    }

    if (!/^\d{13}$/.test(dpi)) {
        mensaje.innerText = "El DPI debe contener exactamente 13 dígitos.";
        return;
    }

    if (!correo.includes("@")) {
        mensaje.innerText = "El correo debe contener el símbolo @.";
        return;
    }

    if (!/^\d{8}$/.test(telefono)) {
        mensaje.innerText = "El celular debe contener exactamente 8 dígitos.";
        return;
    }

    clientes.push({ nombre, dpi, correo, telefono });
    localStorage.setItem("clientes", JSON.stringify(clientes));

    mensaje.style.color = "#15803d";
    mensaje.innerText = "Cliente registrado correctamente.";

    document.getElementById("nombreCliente").value = "";
    document.getElementById("dpiCliente").value = "";
    document.getElementById("correoCliente").value = "";
    document.getElementById("telefonoCliente").value = "";

    actualizarTablas();
    mostrarToast("Cliente registrado correctamente");
}

function crearCuenta() {
    const numeroCuenta = document.getElementById("numeroCuenta").value.trim();
    const tipoCuenta = document.getElementById("tipoCuenta").value;
    const saldoInicial = document.getElementById("saldoInicial").value.trim();
    const mensaje = document.getElementById("mensajeCuenta");

    mensaje.style.color = "#dc2626";

    if (numeroCuenta === "" || tipoCuenta === "" || saldoInicial === "") {
        mensaje.innerText = "Todos los campos de la cuenta son obligatorios.";
        return;
    }

    if (Number(saldoInicial) < 0) {
        mensaje.innerText = "El saldo inicial no puede ser negativo.";
        return;
    }

    cuentas.push({ numeroCuenta, tipoCuenta, saldoInicial });
    localStorage.setItem("cuentas", JSON.stringify(cuentas));

    mensaje.style.color = "#15803d";
    mensaje.innerText = "Cuenta creada correctamente.";

    document.getElementById("numeroCuenta").value = "";
    document.getElementById("tipoCuenta").value = "";
    document.getElementById("saldoInicial").value = "";

    actualizarTablas();
    mostrarToast("Cuenta creada correctamente");
}

function cambiarFormularioMovimiento() {
    const tipo = document.getElementById("tipoMovimiento").value;
    const cuentaOrigen = document.getElementById("cuentaOrigen");
    const cuentaDestino = document.getElementById("cuentaDestino");

    if (tipo === "deposito") {
        cuentaOrigen.placeholder = "Número de cuenta a depositar *";
        cuentaDestino.classList.add("hidden");
    } else if (tipo === "retiro") {
        cuentaOrigen.placeholder = "Número de cuenta a retirar *";
        cuentaDestino.classList.add("hidden");
    } else if (tipo === "transferencia") {
        cuentaOrigen.placeholder = "Número de cuenta origen *";
        cuentaDestino.classList.remove("hidden");
    } else {
        cuentaOrigen.placeholder = "Número de cuenta origen *";
        cuentaDestino.classList.add("hidden");
    }
}

function registrarMovimiento() {
    const tipo = document.getElementById("tipoMovimiento").value;
    const cuentaOrigen = document.getElementById("cuentaOrigen").value.trim();
    const cuentaDestino = document.getElementById("cuentaDestino").value.trim();
    const titular = document.getElementById("nombreTitular").value.trim();
    const monto = document.getElementById("montoMovimiento").value.trim();
    const descripcion = document.getElementById("descripcionMovimiento").value.trim();
    const mensaje = document.getElementById("mensajeMovimiento");

    mensaje.style.color = "#dc2626";

    if (tipo === "") {
        mensaje.innerText = "Seleccione el tipo de movimiento.";
        return;
    }

    if (cuentaOrigen === "" || titular === "" || monto === "" || descripcion === "") {
        mensaje.innerText = "Todos los campos son obligatorios.";
        return;
    }

    if (tipo === "transferencia" && cuentaDestino === "") {
        mensaje.innerText = "Para una transferencia debe ingresar la cuenta destino.";
        return;
    }

    if (Number(monto) <= 0) {
        mensaje.innerText = "El monto debe ser mayor a cero.";
        return;
    }

    movimientos.push({
        tipo,
        cuentaOrigen,
        cuentaDestino: tipo === "transferencia" ? cuentaDestino : "No aplica",
        titular,
        monto,
        descripcion
    });

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    mensaje.style.color = "#15803d";
    mensaje.innerText = "Movimiento registrado correctamente.";

    document.getElementById("tipoMovimiento").value = "";
    document.getElementById("cuentaOrigen").value = "";
    document.getElementById("cuentaDestino").value = "";
    document.getElementById("nombreTitular").value = "";
    document.getElementById("montoMovimiento").value = "";
    document.getElementById("descripcionMovimiento").value = "";
    document.getElementById("cuentaDestino").classList.add("hidden");

    actualizarTablas();
    mostrarToast("Movimiento registrado correctamente");
}

function actualizarTablas() {
    document.getElementById("totalClientes").innerText = clientes.length;
    document.getElementById("totalCuentas").innerText = cuentas.length;
    document.getElementById("totalMovimientos").innerText = movimientos.length;

    document.getElementById("tablaClientes").innerHTML = clientes.map(cliente => `
        <tr>
            <td>${cliente.nombre}</td>
            <td>${cliente.dpi}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.telefono}</td>
        </tr>
    `).join("");

    document.getElementById("tablaCuentas").innerHTML = cuentas.map(cuenta => `
        <tr>
            <td>${cuenta.numeroCuenta}</td>
            <td>${cuenta.tipoCuenta}</td>
            <td>Q ${Number(cuenta.saldoInicial).toFixed(2)}</td>
        </tr>
    `).join("");

    document.getElementById("tablaMovimientos").innerHTML = movimientos.map(mov => `
        <tr>
            <td>${mov.tipo}</td>
            <td>${mov.cuentaOrigen}</td>
            <td>${mov.cuentaDestino}</td>
            <td>${mov.titular}</td>
            <td>Q ${Number(mov.monto).toFixed(2)}</td>
            <td>${mov.descripcion}</td>
        </tr>
    `).join("");

    actualizarGrafica();
}

function actualizarGrafica() {
    const maximo = Math.max(clientes.length, cuentas.length, movimientos.length, 1);

    document.getElementById("barraClientes").style.width = `${(clientes.length / maximo) * 100}%`;
    document.getElementById("barraCuentas").style.width = `${(cuentas.length / maximo) * 100}%`;
    document.getElementById("barraMovimientos").style.width = `${(movimientos.length / maximo) * 100}%`;
}

function cambiarModo() {
    document.body.classList.toggle("dark-mode");
}

function mostrarToast(mensaje, error = false) {
    const toast = document.getElementById("toast");

    toast.innerText = mensaje;
    toast.style.background = error ? "#dc2626" : "#15803d";
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}

function exportarCSV(tipo) {
    let datos = [];
    let encabezados = "";
    let nombreArchivo = "";

    if (tipo === "clientes") {
        datos = clientes;
        encabezados = "Nombre,DPI,Correo,Celular\n";
        nombreArchivo = "clientes_banco_umg.csv";
    }

    if (tipo === "cuentas") {
        datos = cuentas;
        encabezados = "NumeroCuenta,TipoCuenta,SaldoInicial\n";
        nombreArchivo = "cuentas_banco_umg.csv";
    }

    if (tipo === "movimientos") {
        datos = movimientos;
        encabezados = "Tipo,CuentaOrigen,CuentaDestino,Titular,Monto,Descripcion\n";
        nombreArchivo = "movimientos_banco_umg.csv";
    }

    if (datos.length === 0) {
        mostrarToast("No hay datos para exportar", true);
        return;
    }

    let contenido = encabezados;

    datos.forEach(item => {
        contenido += Object.values(item).join(",") + "\n";
    });

    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    enlace.click();

    mostrarToast("Archivo CSV exportado");
}

window.onload = function () {
    mostrarFecha();
    actualizarTablas();
};