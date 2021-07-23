const {Model, DataTypes} = require('sequelize');
// const sequelize = require('../config/connection');

class Picture extends Model {}

Picture.init( 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image_url: {
            type:DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        // sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'picture'
    }
)

// module.exports = Picture;