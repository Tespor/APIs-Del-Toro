const express = require('express');
const Alumno = require('../models/curso.model');
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

router.post('/ingresar', validateToken , async (req, res) => {

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