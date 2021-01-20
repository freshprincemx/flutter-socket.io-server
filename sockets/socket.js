const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();
bands.addBand(new Band('Korn'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del silencio'));
bands.addBand(new Band('Metallica'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente Conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente Desconectado');
    });
    // client.on('mensaje', (payload) => {
    //     console.log('Mensaje', payload);
    //     io.emit('mensaje', {
    //         admin: 'Nuevo mensaje'
    //     });
    // });
    client.on('emitir-mensaje', (payload) => {
        //io.emit('nuevo-mensaje', payload) //Emite a todos
        client.broadcast.emit('nuevo-mensaje', payload) //Con broadcast emite a todos menos al que lo emitió
    });
    client.on('vote-band', (payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
    client.on('add-band', (payload)=>{
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });
    client.on('delete-band', (payload)=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});