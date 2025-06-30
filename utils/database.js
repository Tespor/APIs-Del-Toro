const { Sequelize } = require('sequelize');

class Database {
    constructor() {
    }

    async connect(){
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite3'
        });
        try {
            await this.sequelize.authenticate();
            console.log('Conexion exitosa.');
        } catch (error) {
            console.error('Error en la conexion a la bd:', error);
        }
    }

    get getSequelize() {
        return this.sequelize;
    }
}

if(!global.database_singletone) {
    //Crear la instancia
    global.database_singletone = new Database();
    global.database_singletone.connect();
}

module.exports = global.database_singletone;