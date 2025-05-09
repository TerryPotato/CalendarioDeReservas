const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        unique: true, // No se permiten duplicados
        trim: true // Elimina espacios en blanco al inicio y al final
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        unique: true, // No se permiten duplicados
        match: [/.+\@.+\..+/, "Por favor, ingresa un correo válido"] // Validación básica de email
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    }
    }, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});



// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Si la contraseña no se modifica, no la encripta
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema, "Users");