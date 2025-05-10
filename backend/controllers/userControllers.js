const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

    
        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ message: 'Datos inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
};

// Iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

// Obtener el perfil del usuario
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email
        });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
};

// Generar un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = { registerUser, loginUser, getUserProfile };