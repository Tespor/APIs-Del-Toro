const express = require('express');
const Curso = require('../models/curso.model');
const router = express.Router();
const validateToken = require('../utils/authenticateToken');
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
        const curso = await Curso.findOne({
            where: {
                nombre_curso: {
                    [Op.like]: `${palabra}%`
                }
            }
        });

        if(!curso){
            console.log('NO SE ENCONTRO EL DATO');
            return res.status(400).send({
                message : 'NO SE ENCONTRO EL DATO'
            });
        }

        res.send({curso});
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});


router.get('/ver', validateToken, async (req, res) => {
  try {
    const Cursos = await Curso.findAll();
    res.send(Cursos);
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

  try {
    const { nombre_curso, profesor_id } = req.body;

    if (!nombre_curso || !profesor_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const nuevoCurso = await Curso.create({
      nombre_curso,
      profesor_id
    });

    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error('Error al ingresar curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/editar/:id', validateToken, async (req, res) => {

  const permissions = verifyPermissions(req, res);
  if (permissions != 1010 && permissions != 1110 && permissions != 1011 && permissions != 1111) {
    return res.send({
      message: 'NO TIENES PERMISO PARA EDITAR DATOS'
    });
  }

  try {
    const cursoId = req.params.id;
    const { nombre_curso, profesor_id } = req.body;

    const curso = await Curso.findByPk(cursoId);

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    curso.nombre_curso = nombre_curso || curso.nombre_curso;
    curso.profesor_id = profesor_id || curso.profesor_id;

    await curso.save();

    res.json({ mensaje: 'Curso actualizado correctamente', curso });
  } catch (error) {
    console.error('Error al editar curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



router.delete('/eliminar/:id', validateToken, async (req, res) => {


  const permissions = verifyPermissions(req, res);
  if (permissions != 1001 && permissions != 1101 && permissions != 1011 && permissions != 1111) {
    return res.send({
      message: 'NO TIENES PERMISO PARA ELIMINAR DATOS'
    });
  }


  try {
    const cursoId = req.params.id;

    const curso = await Curso.findByPk(cursoId);

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    await curso.destroy();

    res.json({ mensaje: 'Curso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;