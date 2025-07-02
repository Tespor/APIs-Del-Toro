const express = require('express');
const User = require('../models/user.model');
const router = express.Router();
const validateToken = require('../utils/authenticateToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'holaMundo';
const verifyPermissions = require('../utils/verifyPermissions');


router.get('/ver', validateToken, async (req, res) => {
    try {
        const users = await User.findAll();
        res.send(users);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            message: error
        });
    }
});

router.post('/ingresar', validateToken, async (req, res) => {

    const permissions = verifyPermissions(req, res);
    if (permissions != 1100 && permissions != 1110 && permissions != 1101 && permissions != 1111) {
        return res.send({
            message: 'NO TIENES PERMISO PARA INGRESAR DATOS'
        });
    }


    const user_data = req.body;

    const existe = await User.findOne({ where: { email: user_data.email } })
    if (existe) {
        console.log(`EL USUARIO CON EL EMAIL : ${user_data.email} YA EXISTE`);
        return res.status(409).send({
            error: `EL USUARIO CON EL EMAIL : ${user_data.email} YA EXISTE`

        });
    }

    try {
        const hash = await bcrypt.hash(user_data.password, 10);
        user_data.password = hash;
        await User.create(user_data);
        console.log('USUARIO REGISTRADO CORRECTAMENTE');

        res.send({
            message: 'USUARIO REGISTRADO CORRECTAMENTE',
            user: user_data
        });
    }
    catch (error) {
        console.log('OCURRIO UN ERROR AL REGISTRAR UN USUARIO', error);
        return res.status(400).send(error);
    }
});

router.put('/editar/:id', validateToken, async (req, res) => {

    const permissions = verifyPermissions(req, res);
    if (permissions != 1010 && permissions != 1110 && permissions != 1011 && permissions != 1111) {
        return res.send({
            message: 'NO TIENES PERMISO PARA EDITAR DATOS'
        });
    }

    const { id } = req.params;
    const new_data = req.body;

    try {
        const user = await User.findOne({ where: { id: id } });

        if (!user) {
            console.log('EL USUARIO QUE DESEA ACTUALIZAR NO EXISTE');
            return res.status(404).send({
                message: 'EL USUARIO QUE  DESEA ACTUALIZAR NO EXISTE'
            });
        }
        const hash = await bcrypt.hash(new_data.password, 10);
        new_data.password = hash;
        await user.update(new_data);
        console.log(`EL USUARIO CON EL ID : ${id} HA SIDO ACTUALIZADO`);

        return res.send({
            message: `USUARIO CON EL ID : ${id} HA SIDO ACTUALIZADO`,
            alumno
        });
    }
    catch (error) {
        console.log('OCURRIO UN ERROR AL ACTUALIZAR UN USUARIO', error);
        return res.status(400).send(error);
    }
});

router.delete('/eliminar/:id', validateToken, async (req, res) => {

    const permissions = verifyPermissions(req, res);
    if (permissions != 1001 && permissions != 1101 && permissions != 1011 && permissions != 1111) {
        return res.send({
            message: 'NO TIENES PERMISO PARA ELIMINAR DATOS'
        });
    }

    const { id } = req.params;

    try {
        const existe = await User.findOne({ where: { id: id } });

        if (!existe) {
            console.log('EL USUARIO QUE DESEA ELIMINAR NO EXISTE');
            return res.status(404).send({
                message: 'El USUARIO QUE DESEA ELIMINAR NO EXISTE'
            });
        }

        await existe.destroy();
        console.log(`USUARIO CO EL ID: ${id} HA SIDO ELIMINADO`);

        return res.send({
            message: `USUARIO CON EL ID: ${id} HA SIDO ELIMINADO`
        });
    }
    catch (error) {
        console.log('HA OCURRIDO UN ERROR AL ELIMINAR EL USUARIO', error);
        return res.status(500).send({
            message: 'HA OCURRIDO UN ERROR AL ELIMINAR EL USUARIO',
            error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({
        id: user.id,
        permissions: user.permissions,
        email: user.email,
        password: user.password
    },
        SECRET_KEY, { expiresIn: '1h' });

    res.json({
        user: user,
        token: token
    });

});


module.exports = router;