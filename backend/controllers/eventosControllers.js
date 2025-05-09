const asyncHandler = require('express-async-handler');
const Eventos = require('../models/eventosModel');

const getEventos = asyncHandler(async (req, res) => {
    const eventos = await Eventos.find();
    res.status(200).json({ eventos }); 
});

const createEvento = asyncHandler(async (req, res) => {
    const { title, start, end } = req.body;
    if (!title || !start || !end) {
        res.status(400);
        throw new Error("Por favor, completa todos los campos obligatorios");
    }

    const evento = await Eventos.create({
        title,
        start,
        end
    });
    res.status(201).json({ 
        mensaje: "Evento creado",
        evento
    });
});

const updateEvento = asyncHandler(async (req, res) => {
    const { _id, title, start, end } = req.body;

    // Verifica que se proporcione un ID
    if (!_id) {
        res.status(400);
        throw new Error("Por favor proporciona un id de evento a actualizar");
    }

    // Busca el evento por ID
    const evento = await Eventos.findById(_id);
    if (!evento) {
        res.status(404);
        throw new Error("Evento no encontrado");
    }

    // Actualiza los campos del evento si se proporcionan
    if (title) evento.title = title;
    if (start) evento.start = start;
    if (end) evento.end = end;

    // Guarda los cambios en la base de datos
    const eventoActualizado = await evento.save();

    // Devuelve el evento actualizado
    res.status(200).json({
        mensaje: `Evento con id ${_id} actualizado`,
        evento: eventoActualizado
    });
});

const deleteEvento = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
        res.status(400);
        throw new Error("Por favor proporciona un número de evento a eliminar");
    }

    const eventoEliminado = await Eventos.findByIdAndDelete(_id);
    if (!eventoEliminado) {
        res.status(404);
        throw new Error("Evento no encontrado");
    }

    res.status(200).json({ mensaje: `Evento con id ${_id} eliminado` });
});

module.exports = {
    getEventos,
    createEvento,
    updateEvento,
    deleteEvento
};