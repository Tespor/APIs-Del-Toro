const express = require('express');
const Profesor = require('../models/profesor.model');
const router = express.Router();
const validateToken = require('../utils/authenticateToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'holaMundo';
const verifyPermissions = require('../utils/verifyPermissions');
const { Op} = require('sequelize');

router.get('/buscar/:palabra', validateToken, async (req, res) => {
    const { palabra } = req.params;

    if(!palabra){
        console.log('EL CAMPO ES REQUERIDO');
        return res.status(400).send({
            message : 'EL CAMPO ES REQUERIDO'
        })
    }

    try {
        const profesor = await Profesor.findOne({
            where: {
                nombre: {
                    [Op.like]: `${palabra}%`
                }
            }
        });

        if(!profesor){
            console.log('NO SE ENCONTRO EL DATO');
            return res.status(400).send({
                message : 'NO SE ENCONTRO EL DATO'
            });
        }

        res.send({profesor});
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

router.get('/ver', validateToken, async (req, res) => {
    try {
        const profesores = await Profesor.findAll();
        res.send(profesores);
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
    
    const profesor_data = req.body;

    const existe = await Profesor.findOne({ where: { correo_electronico: profesor_data.correo_electronico } });
    if (existe) {
        console.log(`EL PROFESOR CON EL EMAIL : ${profesor_data.correo_electronico} YA EXISTE`);
        return res.status(409).send({
            error: `EL PROFESOR CON EL EMAIL : ${profesor_data.correo_electronico} YA EXISTE`

        });

    }

    try {
        const hash = await bcrypt.hash(profesor_data.password, 10);
        profesor_data.password = hash;
        await Profesor.create(profesor_data);
        console.log('PROFESOR REGISTRADO CORRECTAMENTE');

        res.send({
            message: 'PROFESOR CREADO CORRECTAMENTE',
            profesor: profesor_data
        })

    } catch (error) {
        console.log('HA OCURRIDO UN ERROR AL REGISTRAR AL USUARIO', error);
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
        const profesor = await Profesor.findOne({ where: { id: id } });

        if (!profesor) {
            console.log('EL PROFESOR QUE DESEA ACTUALIZAR NO EXISTE');
            return res.status(404).send({
                message: 'EL PROFESOR QUE DESEA ACTUALIZAR NO EXISTE'
            });
        }
        const hash = await bcrypt.hash(new_data.password, 10);
        new_data.password = hash;
        await profesor.update(new_data);
        console.log(`EL PROFESOR CON EL ID ${id} HA SIDO ACTUALIZADO`);
        return res.send({
            message: `PROFESOR CON EL ID : ${id} HA SIDO ACTUALIZADO`,
            profesor
        });

    }
    catch (error) {
        console.log('OCURRIO UN ERROR AL ACTUALIZAR AL PROFESOR', error);
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
        const existe = await Profesor.findOne({ where: { id: id } });

        if (!existe) {
            console.log('EL PROFESOR QUE SE DESEA ELIMINAR NO EXISTE');
            return res.status(404).send({
                message: 'EL PROFESOR QUE DESEA ELIMINAR NO EXISTE'
            });
        }
        await existe.destroy();
        console.log(`PROFESOR CON EL ID : ${id} HA SIDO ELIMINADO `);

        return res.send({
            message: `PROFESOR CON EL ID ${id} HA SIDO ELIMINADO`
        });

    }
    catch (error) {
        console.log('HA OCURRIDO UN ERROR AL ELIMINAR AL PROFESOR');
        return res.status(500).send({
            message: 'HA OCURRIDO UN ERROR AL ELIMINAR AL ALUMNO ',
            error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    const { correo_electronico, password } = req.body;

    if (!correo_electronico || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const profesor = await Profesor.findOne({ where: { correo_electronico } });

    if (!profesor || !(await bcrypt.compare(password, profesor.password))) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({
        id : profesor.id,
        nombre : profesor.nombre,
        apellidoP : profesor.apellidoP,
        apellidoM : profesor.apellidoM,
        correo_electronico : profesor.correo_electronico,
        telefono : profesor.telefono,
        password : profesor.password,
        permissions: profesor.permissions
    },
        SECRET_KEY, { expiresIn: '1h' });

    res.json({
        profesor : profesor,
        token : token
    });

});

module.exports = router;