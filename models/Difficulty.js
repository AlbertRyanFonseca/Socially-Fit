const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Difficulty extends Model {}

Difficulty.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        difficulty: {
            type: DataTypes.STRING,
            allowNull: false,

        }
    },
    {
        sequelize,
        freezeTableName: true,
        timestamps: false,
        underscored: true,
        modelName: 'difficulty'
    }
)

module.exports = Difficulty;