import Sequelize from 'sequelize'
import db from './db'

const paranoid = true
const force = true

const User = db.define('user', {
	username: {
		type: Sequelize.STRING,
		allowNull: false
	},
    password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
    name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	admin: {
		type: Sequelize.BOOLEAN,
		default: false,
		allowNull: false
	}
}, { paranoid })

// marie falls (mariefalls@acadiaband.ca)
// joeseph falls (jfalls@acadiaband.ca)
// jim pictou (jimpictou@)

const Location = db.define('location', {
	description: {
		type: Sequelize.STRING,
		allowNull: false
	},
	cooordinates: {
		type: Sequelize.STRING,
		allowNull: true
	}
})

const Member = db.define('member', {
	firstName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
	phone: {
		type: Sequelize.STRING,
		allowNull: false
	},
	scisID: {
		type: Sequelize.STRING,
		allowNull: false
	},
	birthDate: {
		type: Sequelize.DATE,
		defaultValue: null
	}
})

const HousingForm = db.define('housingForm', {
	data: {
		type: Sequelize.JSONB,
		allowNull: false
	},
	uid: {
		type: Sequelize.STRING,
		allowNull: false
	},
	approvedAt: {
		type: Sequelize.DATE,
		allowNull: true
	},
	rejectedAt: {
		type: Sequelize.DATE,
		allowNull: true
	},
	archivedAt: {
		type: Sequelize.DATE,
		allowNull: true
	}
})

HousingForm.belongsTo(Location)
Location.hasMany(HousingForm)

HousingForm.belongsTo(Member)
Member.hasMany(HousingForm)

db.sync()

export default { User, Member, Location, HousingForm }