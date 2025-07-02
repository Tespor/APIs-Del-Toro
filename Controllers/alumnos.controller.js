const express = require('express');
const Alumno = require('../models/alumno.model');
const router = express.Router();
const validateToken = require('../utils/authenticateToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op, where } = require('sequelize');
const SECRET_KEY = 'holaMundo';
const verifyPermissions = require('../utils/verifyPermissions');


router.get('/ver', validateToken, async (req, res) => {
    try {
        const alumnos = await Alumno.findAll();
        res.send(alumnos);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            message: error
        });
    }

});


router.post('/ingresar', validateToken,  async (req, res) => {

    const permissions = verifyPermissions(req, res);
    if (permissions != 1100 && permissions != 1110 && permissions != 1101 && permissions != 1111) {
        return res.send({
            message: 'NO TIENES PERMISO PARA INGRESAR DATOS'
        });
    }

    const alumno_data = req.body;

    const existe = await Alumno.findOne({ where: { [Op.or]: [{ matricula: alumno_data.matricula }, { correo_electronico: alumno_data.correo_electronico }] } })
    if (existe) {
        console.log(`LOS DATOS INGRESADOS DEL ALUMNO YA EXISTE`);
        return res.status(409).send({
            error: `LOS DATOS INGRESADOS DEL ALUMNO YA EXISTE`

        });
    }

    try {
        const hash = await bcrypt.hash(alumno_data.password, 10);
        alumno_data.password = hash;
        await Alumno.create(alumno_data);
        console.log('ALUMNO REGISTRADO CORRECTAMENTE');

        res.send({
            message: 'ALUMNO CREADO CORRECTAMENTE',
            alumno: alumno_data
        })

    } catch (error) {
        console.log('OCURRIO UN ERROR AL REGISTRAR UN ALUMNO', error);
        return res.status(400).send(error);

    }


});

router.put('/editar/:matricula', validateToken, async (req, res) => {

    const permissions = verifyPermissions(req, res);
    if (permissions != 1010 && permissions != 1110 && permissions != 1011 && permissions != 1111) {
        return res.send({
            message: 'NO TIENES PERMISO PARA EDITAR DATOS'
        });
    }

    const { matricula } = req.params;
    const new_data = req.body;

    try {
        const alumno = await Alumno.findOne({ where: { matricula: matricula } });

        if (!alumno) {
            console.log('EL ALUMNO QUE  DESEA ACTUALIZAR NO EXISTE');
            return res.status(404).send({
                message: 'EL ALUMNO QUE  DESEA ACTUALIZAR NO EXISTE'
            });
        }
        const hash = await bcrypt.hash(new_data.password, 10);
        new_data.password = hash;
        await alumno.update(new_data);
        console.log(`EL ESTUDIANTE CON LA MATRICULA : ${matricula} HA SIDO ACTUALIZADO`);
        return res.send({
            message: `ALUMNO CON LA MATRICULA : ${matricula} HA SIDO ACTUALIZADO`,
            alumno
        });

    }
    catch (error) {
        console.log('OCURRIO UN ERROR AL ACTUALIZAR UN ALUMNO', error);
        return res.status(400).send(error);
    }

});

router.delete('/eliminar/:matricula', validateToken, async (req, res) => {
    
    const permissions = verifyPermissions(req, res);
    if (permissions != 1001 && permissions != 1101 && permissions != 1011 && permissions != 1111) {
        return res.send({
            message: 'NO TIENES PERMISO PARA ELIMINAR DATOS'
        });
    }
    
    const { matricula } = req.params;

    try {
        const existe = await Alumno.findOne({ where: { matricula: matricula } });

        if (!existe) {
            console.log('EL ALUMNO QUE DESEA ELIMINAR NO EXISTE');
            return res.status(404).send({
                message: 'EL ALUMNO QUE DESEA ELIMINAR NO EXISTE'
            });
        }

        await existe.destroy();
        console.log(`ALUMNO CON LA MATRICULA: ${matricula} HA SIDO ELIMINADO`);

        return res.send({
            message: `ALUMNO CON LA MATRICULA: ${matricula} HA SIDO ELIMINADO`
        });
    }
    catch (error) {
        console.log('HA OCURRIDO UN ERROR AL ELIMINAR EL ALUMNO', error);
        return res.status(500).send({
            message: 'HA OCURRIDO UN ERROR AL ELIMINAR EL ALUMNO',
            error: error.message
        });

    }
});

router.post('/login', async (req, res) => {
    const { correo_electronico, password } = req.body;

    if (!correo_electronico || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const alumno = await Alumno.findOne({ where: { correo_electronico } });

    if (!alumno || !(await bcrypt.compare(password, alumno.password))) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({
        matricula : alumno.matricula , 
        nombre : alumno.nombre , 
        apellidoP : alumno.apellidoP,
        apellidoM : alumno.apellidoM , 
        correo_electronico : alumno.correo_electronico ,  
        telefono : alumno.telefono,
        password : alumno.password,
        permissions: alumno.permissions
    },
    SECRET_KEY, {expiresIn: '1h'});

    res.json({
        alumno : alumno,
        token : token
    });
});


module.exports = router;