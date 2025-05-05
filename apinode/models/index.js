const { sequelize } = require("../config/db.config");

const genero = require("./genero")(sequelize);
const artista = require("./artista")(sequelize);
const album = require("./album")(sequelize);
const cancion = require("./cancion")(sequelize);

genero.hasMany(artista, { foreignKey: "generoId", as: "artistas" });
artista.belongsTo(genero, { foreignKey: "generoId", as: "genero" });
artista.hasMany(album, { foreignKey: "artistaId", as: "albums" });
album.belongsTo(artista, { foreignKey: "artistaId", as: "artista" });
album.hasMany(cancion, { foreignKey: "albumId", as: "canciones" });
cancion.belongsTo(album, { foreignKey: "albumId", as: "album" });

module.exports = {
    genero,
    artista,
    album,
    cancion,
    sequelize,
    Sequelize: sequelize.Sequelize
};