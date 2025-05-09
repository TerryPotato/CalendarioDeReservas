const express = require('express');
const router = express.Router();
const { getHabitaciones, createHabitacion, updateHabitacion, deleteHabitacion } = require('../controllers/habitacionesControllers');
const { getEventos, createEvento, updateEvento, deleteEvento } = require('../controllers/eventosControllers');

// Obtenemos las habitaciones
router.get('/', getEventos);
// Creamos una habitación
router.post('/', createEvento);
// Modificamos la disponibilidad de una habitación
router.put('/', updateEvento);
// Eliminamos una habitación
router.delete('/', deleteEvento);

module.exports = router;