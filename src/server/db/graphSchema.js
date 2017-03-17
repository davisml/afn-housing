import {GraphQLString, GraphQLBoolean, JSONType, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLObjectType, GraphQLList, GraphQLSchema, GraphQLInputObjectType} from 'graphql'
import _ from 'underscore'
import models from './index'

const {User, Location, Member, HousingForm} = models

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: 'User',
    fields: {
        id: {
            type: GraphQLString
        },
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        admin: {
            type: GraphQLBoolean
        }
    }
})

const LocationType = new GraphQLObjectType({
	name: 'LocationType',
	fields: () => ({
        id: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        coordinates: {
            type: GraphQLString
        },
        forms: {
        	type: new GraphQLList(HousingFormType),
        	resolve: async function(findOptions, args, context, info) {
		    	return await HousingForm.findAll({
		    		where: {
		    			locationId: findOptions.id
		    		}
		    	})
		    }
        }
    })
})

const MemberType = new GraphQLObjectType({
	name: 'MemberType',
	fields: {
        id: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        lastName: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        }
    }
})

const IndividualType = new GraphQLObjectType({
	name: 'IndividualType',
	fields: {
		name: {
			type: GraphQLString
		},
		age: {
			type: GraphQLString
		},
		relationship: {
			type: GraphQLString
		}
	}
})

const HousingFormDataType = new GraphQLObjectType({
	name: 'HousingFormDataType',
	fields: {
		additionalInformation: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Additional Information'
        },
        currentLivingConditions: {
            type: new GraphQLNonNull(GraphQLString)
        },
        isConsideredElder: {
            type: GraphQLBoolean
        },
        isLivingOnReserve: {
            type: GraphQLBoolean
        },
        isMember: {
            type: GraphQLBoolean
        },
        requiresSupport: {
        	type: GraphQLBoolean
        },
        residesWithDisabled: {
        	type: GraphQLBoolean
        },
        disabilityConsideration: {
        	type: GraphQLString
        },
        individuals: {
        	type: new GraphQLList(IndividualType)
        }
	}
})

const HousingFormType = new GraphQLObjectType({
	name: 'HousingFormType',
	fields: {
        id: {
            type: GraphQLString
        },
        data: {
        	type: HousingFormDataType
        },
        member: {
        	type: MemberType,
        	resolve: async function(findOptions, args, context, info) {
		    	return await Member.findById(findOptions.memberId)
		    }
        },
        location: {
        	type: LocationType,
        	resolve: async function(findOptions, args, context, info) {
		    	return await Location.findById(findOptions.locationId)
		    }
        }
    }
})

let graphFields = {}

graphFields.housingForms = {
	type: new GraphQLList(HousingFormType),
    resolve: () => HousingForm.findAll()
}

graphFields.housingForm = {
    type: HousingFormType,
    args: {
        id: {
            type: GraphQLInt
        }
    },
    resolve: (parent, { id }) => HousingForm.findById(id)
}

graphFields.locations = {
	type: new GraphQLList(LocationType),
	resolve: () => Location.findAll()
}

graphFields.location = {
	type: LocationType,
	args: {
		id: {
			type: GraphQLInt
		}
	},
	resolve: (parent, { id }) => Location.findById(id)
}

const name = 'AFN'

const QueryType = new GraphQLObjectType({
    name: `${ name }Query`,
    description: `The root of all ${ name } queries`,
    fields: graphFields
})

const IndividualInputType = new GraphQLInputObjectType({
	name: 'IndividualInput',
	fields: {
		name: {
			type: GraphQLString
		},
		age: {
			type: GraphQLString
		},
		relationship: {
			type: GraphQLString
		}
	}
})

const MemberInputType = new GraphQLInputObjectType({
	name: 'MemberInput',
	fields: {
		firstName: {
			type: GraphQLString
		},
		lastName: {
			type: GraphQLString
		},
		email: {
			type: GraphQLString
		},
		phone: {
			type: GraphQLString
		}
	}
})

const HousingFormInputType = new GraphQLInputObjectType({
    name: 'HousingFormInput',
    description: 'Input for housing form',
    fields: {
        additionalInformation: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Additional Information'
        },
        currentLivingConditions: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Current Living Conditions'
        },
        isConsideredElder: {
            type: GraphQLBoolean,
            default: false
        },
        isLivingOnReserve: {
            type: GraphQLBoolean,
            default: false
        },
        isMember: {
            type: GraphQLBoolean,
            default: false
        },
        location: {
            type: GraphQLInt
        },
        member: {
            type: MemberInputType,
            description: 'Member'
        },
        requiresSupport: {
        	type: GraphQLBoolean,
        	default: false
        },
        residesWithDisabled: {
        	type: GraphQLBoolean,
        	default: false
        },
        disabilityConsideration: {
        	type: GraphQLString,
        	default: null
        },
        birthDate: {
            type: GraphQLString,
            default: null
        },
        individuals: {
        	type: new GraphQLList(IndividualInputType)
        }
    }
})

const MutationType = new GraphQLObjectType({
    name: `${ name }Mutations`,
    description: `The root of all ${ name } mutations`,
    fields: () => ({
    	submitForm: {
    		args: {
    			input: {
    				type: HousingFormInputType
    			}
    		},
    		type: HousingFormType,
    		resolve: function(findOptions, { input }) {
    			const {member, location: locationId} = input

    			const data = _.omit(_.clone(input), 'location', 'member')
    			
    			return HousingForm.create({ data, locationId, member }, {
    				include: [ Member ]
    			})
    		}
    	}
    })
})

//, mutation: MutationType

export default new GraphQLSchema({ query: QueryType, mutation: MutationType })