const express = require('express');
const router = express.Router();
const { getEventos, getEventoById, createEvento, updateEvento, deleteEvento } = require('../controllers/eventosControllers');

// Obtenemos los eventos
router.get('/', getEventos);
// Obtenemos un evento por ID
router.get('/:_id', getEventoById);
// Creamos un evento
router.post('/', createEvento);
// Modificamos un evento
router.put('/', updateEvento);
// Eliminamos un evento
router.delete('/:id', deleteEvento);

module.exports = router;