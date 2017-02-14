import Sequelize from 'sequelize'
import dbConfig from './dbConfig'

const {database, user, password, host, port, ssl} = dbConfig

const db = new Sequelize(database, user, password, {
	host, port,
	protocol: 'postgres',
	dialect: 'postgres',
	dialectOptions: { ssl },
    logging: false,
    pool: {
    	idle: 10000,
    	min: 0,
    	max: 10
    }
})

export default db