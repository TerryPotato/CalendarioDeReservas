const mongoose = require('mongoose');

const habitacionesSchema = mongoose.Schema({ 
    title: {
        type : String,
        required: [true, "El titulo del evento es obligatorio"]
    },
    start: {
        type : Date,
        required: [true, "La fecha de inicio es obligatoria"]
    },
    end: {
        type : Date,
        required: [true, "La fecha de finalización es obligatoria"]
    }
    
},{
    timestamps: true
});

module.exports = mongoose.model("Eventos", eventosSchema, `Eventos`);