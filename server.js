//require('dotenv').config(); // Para usar .env
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./utils/database');
const User = require('./models/user.model');
const cors = require('cors')

const app = express();
const SECRET_KEY = 'holaMundo';

app.use(express.json(), cors({
  origin: '*'
}));



// Inicialización de la BD
// (async () => {
//   await db.connect();
//   await User.sync({ alter: true }); // Crea tabla si no existe
// })();

// Registro
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.status(201).json({ message: 'Usuario registrado', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar usuario (¿correo duplicado?)' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
}

// Ruta protegida
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Bienvenido al perfil protegido', user: req.user });
});

// Arranca servidor
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
