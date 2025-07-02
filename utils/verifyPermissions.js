const jwt = require('jsonwebtoken');
const SECRET_KEY = 'holaMundo';

function verifyPermissions(req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        if (!token) {
            throw new Error('Token no proporcionado');
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        return decoded.permissions;
    } catch (error) {
        console.error('Error al verificar permisos:', error.message);
        return null; 
    }
}

module.exports = verifyPermissions;


/*
SIN PERMISOS PURO GET = 1000
CREAR = 1100
EDITAR = 1010
ELIMINAR = 1001

CREAR + EDITAR = 1110
CREAR + ELIMINAR = 1101
EDITAR + ELIMINAR = 1011
CREAR + EDITAR + ELIMINAR = 1111

*/