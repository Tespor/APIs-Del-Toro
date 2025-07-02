const express = require('express');
const Alumno = require('../models/alumno.model');
const router = express.Router();
const validateToken = require('../utils/authenticateToken');



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


router.post('/ingresar', validateToken, async (req, res) => {

    const alumno_data = req.body;

    const existe = await Alumno.findOne({ where: { matricula: alumno_data.matricula } })
    if (existe) {
        console.log(`EL ALUMNO CON LA MATRICULA : ${alumno_data.matricula} YA EXISTE`);
        return res.status(409).send({
            error: `EL ALUMNO CON LA MATRICULA : ${alumno_data.matricula} YA EXISTE`

        });
    }

    try {
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




module.exports = router;