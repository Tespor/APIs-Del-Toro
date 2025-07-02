const express = require('express');
const Profesor = require('../models/profesor.model');
const router = express.Router();
const validateToken = require('../utils/authenticateToken');
const { validate, where } = require('../utils/database');
const Alumno = require('../models/alumno.model');



router.get('ver', validateToken, async (req, res) => {
    try {
        const profesores = await Profesor.findAll();
        res.send(Profesor);
    }
    catch (error) {
        console.log (error);
        return res.status(400).send({
            message: error 
        });
    }
});

router.post ('ingresar', validateToken, async (req, res) => {

    const profesor_data = req.body;

    const existe = await Profesor.findOne({ where: {id: profesor_data.id}})
    if (existe) {
        console.log(`EL PROFESOR CON EL ID : ${profesor_data.id} YA EXISTE`);
        return res.status(409).send({
            error : `EL PROFESOR CON EL ID : ${profesor_data.id} YA EXISTE`

        });

    }

    try {
        await Profesor.create(profesor_data);
        console.log('PROFESOR REGISTRADO CORRECTAMENTE');

        res.send({
            message: 'PROFESOR CREADO CORRECTAMENTE',
            profesor: profesor_data
        })

    } catch(error) {
        console.log('HA OCURRIDO UN ERROR AL REGISTRAR AL USUARIO', error);
        return res.status(400).send(error);

    }
    
});

router.put('/editar/:id', validateToken, async (req, res) =>{
    const { id } = req.params;
    const new_data = req.body;

    try {
        const profesor = await Profesor.findOne({where: {id: id}});

        if (!profesor) {
            console.log('EL PROFESOR QUE DESEA ACTUALIZAR NO EXISTE');
            return res.status(404).send({
                message: 'EL PROFESOR QUE DESEA ACTUALIZAR NO EXISTE'
            });
        }
        await profesor.update(new_data);
        console.log(`EL PROFESOR CON EL ID ${id} HA SIDO ACTUALIZADO`);
        return res.send({
            message: `PROFESOR CON EL ID : ${id} HA SIDO ACTUALIZADO`,
            profesor
        });

}
catch (error) {
    console.log('OCURRIO UN ERROR AL ACTUALIZAR AL PROFESOR', error);
    return res.status(400).send (error);
}

});

router.delete('/eliminar/:id', validateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const existe =await Profesor.findOne({where: {id: id}});

        if (!existe) {
            console.log('EL PROFESOR QUE SE DESEA ELIMINAR NO EXISTE');
            return res.status(404).send({
                message: 'EL PROFESOR QUE DESEA ELIMINAR NO EXISTE'
            });
        }
        await existe.destroy();
        console.log(`PROFESOR CON EL ID : ${id} HA SIDO ELIMINADO ` );

        return res.send({
            message: `PROFESOR CON EL ID ${id} HA SIDO ELIMINADO`
        });

    }
    catch(error){
        console.log('HA OCURRIDO UN ERROR AL ELIMINAR AL PROFESOR');
        return res.status(500).send({
            message: 'HA OCURRIDO UN ERROR AL ELIMINAR AL ALUMNO ',
            error: error.message
        });
    }
});

module.exports = router;