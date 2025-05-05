const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Cancion = sequelize.define("Cancion", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        archivo: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },{
        tableName: 'Canciones'
    });
    return Cancion;
};
