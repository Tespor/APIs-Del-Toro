const jwt = require('jsonwebtoken');
const SECRET_KEY = 'holaMundo';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
        next();
    });
}

module.exports = authenticateToken;