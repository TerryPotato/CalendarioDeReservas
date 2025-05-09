const express = require('express');
const router = express.Router();
const { getEventos, createEvento, updateEvento, deleteEvento } = require('../controllers/eventosControllers');

// Obtenemos los eventos
router.get('/', getEventos);
// Creamos un evento
router.post('/', createEvento);
// Modificamos un evento
router.put('/', updateEvento);
// Eliminamos un evento
router.delete('/', deleteEvento);

module.exports = router;