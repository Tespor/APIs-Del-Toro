const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.listen(port, () => {
  console.log(`SERVER STARTED : http://localhost:${port}`);
});

const alumnosController = require('./Controllers/alumnos.controller');
app.use('/alumnos' , alumnosController);

const profesoresController =require('./Controllers/profesores.controller');
app.use('/profesores' , profesoresController);


const cursoController = require('./Controllers/curso.controller');
app.use('/cursos' , cursoController);
