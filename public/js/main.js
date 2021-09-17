const socket = io();

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    // prevengo que el formulario recargue la pagina al hacer submit
    e.preventDefault()

    // armo producto extrayendo los datos de los campos del formulario
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    
    // envio el producto al servidor via socket
    
    socket.emit('update', producto);

    // limpio el contenido de los campos del formulario
    formAgregarProducto.reset()
})

// agrego manejador de eventos de tipo 'productos'
socket.on('productos', manejarEventoProductos);

async function manejarEventoProductos(productos) {
      
    // busco la plantilla del servidor
    const recursoRemoto = await fetch('plantillas/tabla-productos.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con los productos recibidos
    const html = functionTemplate({ productos })

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('productos').innerHTML = html
}


// Agrego manejador de eventos de tipo mensajes
socket.on('mensajes', manejarEventoMensajes);

async function manejarEventoMensajes(mensajes){
    
    const recursoRemoto = await fetch('plantillas/chat.hbs')
    const textoPlantilla = await recursoRemoto.text()
    const functionTemplate = Handlebars.compile(textoPlantilla)
    const html = functionTemplate({ mensajes })
    document.getElementById('mensajes').innerHTML = html
    console.log(document.getElementById('mensajes').innerHTML)
 }


const formEnviarMensaje = document.getElementById('formEnviarMensaje')
formEnviarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    const mensaje = {
        email: document.getElementById('email').value,
        //fechaHora: Date.now().toLocaleString('ko-KR', { timeZone: 'UTC' }),
        fechaHora: moment().format('DD/MM/YYYY HH:mm:ss'),
        mensaje: formEnviarMensaje[0].value
    }
    socket.emit('nuevo-mensaje', mensaje);
    formEnviarMensaje.reset()
})