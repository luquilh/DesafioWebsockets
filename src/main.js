const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const Contenedor = require('./contenedores/Contenedor.js')
const productosCont = new Contenedor('./productos.txt');
const chatCont = new Contenedor('./historialChat.txt');


let productos = [];
productosCont.getAll()
        .then( catalogo => {
            
        productos = catalogo.slice();
        });


let mensajes=[];
chatCont.getAll()
        .then( historial => {
            
        mensajes = historial.slice();
        });

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', productos);
    // carga inicial de mensaje
    socket.emit('mensajes', mensajes);

    // actualizacion de productos
    socket.on('update', producto => {
        productosCont.save(producto);
        productos.push(producto)
        io.sockets.emit('productos', productos);
    })

    //actualizacion de mensajes
    socket.on('nuevo-mensaje', data => {
        chatCont.save(data);
        mensajes.push(data);
        io.sockets.emit('mensajes', mensajes);
    })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
