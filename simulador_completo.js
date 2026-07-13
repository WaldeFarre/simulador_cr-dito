  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
  let creditoAprobado = false;


//Para recuperar o mostrar información usar los métodos de la clase utilitarios, puede agregar métodos adicionales en utilitarios


// ===================== PARTE 1: NAVEGACIÓN =====================

function ocultarSecciones(){
    document.getElementById("parametros").classList.remove("activa");
    document.getElementById("clientes").classList.remove("activa");
}

function mostrarSeccion(id){
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");
}


// ===================== PARTE 2: CONFIGURAR TASA =====================

function guardarTasa(){
    let tasa = recuperarInt("tasaInteres");

    if(tasa >= 10 && tasa <= 20){
        tasaInteres = tasa;
        mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasa + "%");
    } else {
        mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    }
}


// ===================== PARTE 3: CLIENTES =====================

function guardarCliente(){
    let cedula = recuperaraTexto("cedula");
    let nombre = recuperaraTexto("nombre");
    let apellido = recuperaraTexto("apellido");
    let ingresos = recuperarFloat("ingresos");
    let egresos = recuperarFloat("egresos");

    if(cedula === "" || nombre === "" || apellido === "" || isNaN(ingresos) || isNaN(egresos)){
        mostrarTexto("mensajeCliente", "Debe llenar todos los campos");
        return;
    }
    mostrarTexto("mensajeCliente", "");

    let cliente = buscarCliente(cedula);

    if(cliente === null){
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos
        };
        clientes.push(nuevoCliente);
    } else {
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.ingresos = ingresos;
        cliente.egresos = egresos;
    }

    pintarClientes();
    limpiar();
}

function pintarClientes(){
    let contenidoTabla = "";
    let cmpTabla = document.getElementById("tablaClientes");
    let cliente;

    for(let indice = 0; indice < clientes.length; indice++){
        cliente = clientes[indice];
        contenidoTabla += "<tr>";
        contenidoTabla += "<td>" + cliente.cedula + "</td>";
        contenidoTabla += "<td>" + cliente.nombre + "</td>";
        contenidoTabla += "<td>" + cliente.apellido + "</td>";
        contenidoTabla += "<td>" + cliente.ingresos + "</td>";
        contenidoTabla += "<td>" + cliente.egresos + "</td>";
        contenidoTabla += `<td><button onclick="seleccionarCliente('` + cliente.cedula + `')">Actualizar</button></td>`;
        contenidoTabla += "</tr>";
    }
    cmpTabla.innerHTML = contenidoTabla;
}

function buscarCliente(cedula){
    let cliente;

    for(let indice = 0; indice < clientes.length; indice++){
        cliente = clientes[indice];
        if(cliente.cedula === cedula){
            return cliente;
        }
    }
    return null;
}

function seleccionarCliente(cedula){
    let cliente = buscarCliente(cedula);
    clienteSeleccionado = cliente;

    mostrarTextoEnCaja("cedula", cliente.cedula);
    mostrarTextoEnCaja("nombre", cliente.nombre);
    mostrarTextoEnCaja("apellido", cliente.apellido);
    mostrarTextoEnCaja("ingresos", cliente.ingresos);
    mostrarTextoEnCaja("egresos", cliente.egresos);
}

function buscarClienteCredito(){
    let cedula = recuperaraTexto("buscarCedulaCredito");
    let cliente = buscarCliente(cedula);
    let cmpDatos = document.getElementById("datosClienteCredito");
    let contenido = "";

    if(cliente === null){
        clienteSeleccionado = null;
        cmpDatos.innerHTML = "<p>Cliente no encontrado</p>";
        return;
    }

    clienteSeleccionado = cliente;

    contenido += "<h3>Datos del Cliente</h3>";
    contenido += "<p><strong>Cédula:</strong> " + cliente.cedula + "</p>";
    contenido += "<p><strong>Nombre:</strong> " + cliente.nombre + "</p>";
    contenido += "<p><strong>Apellido:</strong> " + cliente.apellido + "</p>";
    contenido += "<p><strong>Ingresos:</strong> " + cliente.ingresos + "</p>";
    contenido += "<p><strong>Egresos:</strong> " + cliente.egresos + "</p>";
    cmpDatos.innerHTML = contenido;
}

function calcularCredito(){
    let cmpResultado = document.getElementById("resultadoCredito");

    if(clienteSeleccionado === null){
        cmpResultado.className = "rechazado";
        cmpResultado.innerHTML = "Primero busque un cliente por cédula";
        return;
    }

    let monto = recuperarInt("montoCredito");
    let plazo = recuperarInt("plazoCredito");

    if(isNaN(monto) || monto <= 0 || isNaN(plazo) || plazo <= 0){
        cmpResultado.className = "rechazado";
        cmpResultado.innerHTML = "Ingrese un monto y un plazo válidos";
        return;
    }

    let disponible = calcularDisponible(clienteSeleccionado.ingresos, clienteSeleccionado.egresos);
    let capacidad = calcularCapacidadPago(disponible);
    let interes = calcularInteresSimple(monto, tasaInteres, plazo);
    let total = calcularTotalPagar(monto, interes);
    let cuota = calcularCuotaMensual(total, plazo);
    let aprobado = aprobarCredito(capacidad, cuota);

    montoCalculado = monto;
    plazoCalculado = plazo;
    cuotaCalculada = cuota;
    creditoAprobado = aprobado;

    let contenido = "";
    contenido += "Capacidad de pago: " + capacidad.toFixed(2) + "<br>";
    contenido += "Total a pagar: " + total.toFixed(2) + "<br>";
    contenido += "Cuota mensual: " + cuota.toFixed(2) + "<br>";

    if(aprobado){
        contenido += "RESULTADO: APROBADO";
        cmpResultado.className = "aprobado";
    } else {
        contenido += "RESULTADO: RECHAZADO";
        cmpResultado.className = "rechazado";
    }
    cmpResultado.innerHTML = contenido;
}

function limpiar(){
    mostrarTextoEnCaja("cedula", "");
    mostrarTextoEnCaja("nombre", "");
    mostrarTextoEnCaja("apellido", "");
    mostrarTextoEnCaja("ingresos", "");
    mostrarTextoEnCaja("egresos", "");
    clienteSeleccionado = null;
}


function ocultarSecciones(){
    document.getElementById("parametros").classList.remove("activa");
    document.getElementById("clientes").classList.remove("activa");
    document.getElementById("credito").classList.remove("activa");
}