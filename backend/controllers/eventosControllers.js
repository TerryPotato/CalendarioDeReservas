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
    const { id, title, start, end } = req.body;
    if (!id) {
        res.status(400);
        throw new Error("Por favor proporciona el id del evento a modificar");
    }

    const evento = await Eventos.findById(id);
    if (!evento) {
        res.status(404);
        throw new Error("Evento no encontrado");
    }

    // Actualiza los campos del evento
    if (title) evento.title = title;
    if (start) evento.start = start;
    if (end) evento.end = end;

    const eventoActualizado = await evento.save();
    res.status(200).json({
        mensaje: `Evento con id ${id} actualizado`,
        evento: eventoActualizado
    });
});

const deleteEvento = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400);
        throw new Error("Por favor proporciona un número de evento a eliminar");
    }

    const eventoEliminado = await Eventos.findByIdAndDelete(id);
    if (!eventoEliminado) {
        res.status(404);
        throw new Error("Evento no encontrado");
    }

    res.status(200).json({ mensaje: `Evento con id ${id} eliminado` });
});

module.exports = {
    getEventos,
    createEvento,
    updateEvento,
    deleteEvento
};