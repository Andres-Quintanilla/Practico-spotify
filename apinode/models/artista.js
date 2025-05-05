const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Artista = sequelize.define("Artista", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true, 
    }
  });
  return Artista;
};
