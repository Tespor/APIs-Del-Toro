const express = require('express');
const Alumno_Curso = require('../models/alumno_curso.model');
const router = express.Router();
const validateToken = require('../utils/authenticateToken');
const verifyPermissions = require('../utils/verifyPermissions');


router.get('/ver', validateToken, async (req, res) => {
    try {
        const alumno_curso = await Alumno_Curso.findAll();
        res.send(alumno_curso);
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

    const curso_data = req.body;

    try {
        await Alumno_Curso.create(curso_data);
        console.log("CURSO REGISTRADO CORRECTAMENTE");

        res.send({
            message: `CURSO REGISTRADO CORRECTAMENTE`,
            curso: curso_data
        });
    }
    catch (error) {
        console.log('OCURRIO UN ERROR AL REGISTRAR EL CURSO :', error);
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
        const curso = await Alumno_Curso.findOne({ where: { id: id } });
        if (!curso) {
            console.log("NO SE ENCONTRO EL CURSO");
            return res.status(400).send({
                message: `NO SE ENCONTRO EL CURSO CON EL ID : ${id}`
            });
        }

        await curso.update(new_data);
        console.log("CURSO EDITADO CORRECTAMENTE");
        return res.send({
            message: `CURSO CON EL ID : ${id} EDITADO CORRECTAMENTE`,
            curso
        });

    }
    catch (error) {
        console.log('OCURRIO UN ERROR AL ACTUALIZAR EL ERROR', error);
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
        const existe = await Alumno_Curso.findOne({ where: { id: id } });
        if (!existe) {
            console.log('EL CURSO QUE DESEA ELIMINAR NO EXISTE');
            return res.status(404).send({
                message: 'EL CURSO QUE DESEA ELIMINAR NO EXISTE'
            });
        }

        await existe.destroy();
        console.log(`CURSO CON EL ID: ${id} HA SIDO ELIMINADO`);

        return res.send({
            message: `CURSO CON EL ID: ${id} HA SIDO ELIMINADO`
        });

    }
    catch (error) {
        console.log('HA OCURRIDO UN ERROR AL ELIMINAR EL CURSO', error);
        return res.status(500).send({
            message: 'HA OCURRIDO UN ERROR AL ELIMINAR EL CURSO',
            error: error.message
        });

    }
});


module.exports = router;