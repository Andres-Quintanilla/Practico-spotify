const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Album = sequelize.define("Album", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    return Album;
};
