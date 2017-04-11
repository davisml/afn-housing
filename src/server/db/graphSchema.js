import {GraphQLString, GraphQLBoolean, JSONType, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLObjectType, GraphQLList, GraphQLSchema, GraphQLInputObjectType} from 'graphql'
import _ from 'underscore'
import models from './index'
import {Mandrill} from 'mandrill-api/mandrill'

const mandrillClient = new Mandrill('9QNK2YwAhHJZaWnuOxB1ZQ')

const sendEmail = () => { 
    var message = {
        "html": "<p>Example HTML content</p>",
        "text": "Example text content",
        "subject": "Form created",
        "from_email": "mailer@acadiaband.ca",
        "from_name": "Acadia First Nation",
        "to": [{
            "email": "mark@colovo.com",
            "name": "Mark Davis",
            "type": "to"
        }],
        "headers": {
            "Reply-To": "mailer@acadiaband.ca"
        },
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "merge": false,
        // "merge": true,
        // "merge_language": "mailchimp",
        // "global_merge_vars": [{
        //         "name": "merge1",
        //         "content": "merge1 content"
        //     }],
        // "merge_vars": [{
        //         "rcpt": "recipient.email@example.com",
        //         "vars": [{
        //                 "name": "merge2",
        //                 "content": "merge2 content"
        //             }]
        //     }],
        // "tags": [
        //     "password-resets"
        // ],
        // "subaccount": "customer-123",
        // "google_analytics_domains": [
        //     "example.com"
        // ],
        // "google_analytics_campaign": "message.from_email@example.com",
        // "metadata": {
        //     "website": "www.example.com"
        // },
        // "recipient_metadata": [{
        //         "rcpt": "recipient.email@example.com",
        //         "values": {
        //             "user_id": 123456
        //         }
        //     }],
        // "attachments": [{
        //         "type": "text/plain",
        //         "name": "myfile.txt",
        //         "content": "ZXhhbXBsZSBmaWxl"
        //     }],
        // "images": [{
        //         "type": "image/png",
        //         "name": "IMAGECID",
        //         "content": "ZXhhbXBsZSBmaWxl"
        //     }]
    }

    var async = false
    // var ip_pool = "Main Pool";
    // var send_at = "example send_at";
    mandrillClient.messages.send({ message, async/*, ip_pool, send_at*/}, (result) => {
        console.log(result)
        /*
        [{
                "email": "recipient.email@example.com",
                "status": "sent",
                "reject_reason": "hard-bounce",
                "_id": "abc123abc123abc123abc123abc123"
            }]
        */
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message)
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    })
}

sendEmail()

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
                    order: [['createdAt', 'ASC']],
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
        },
        birthDate: {
            type: GraphQLString
        }
	}
})

const HousingFormType = new GraphQLObjectType({
	name: 'HousingFormType',
	fields: {
        id: {
            type: GraphQLString
        },
        createdAt: {
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
    resolve: () => HousingForm.findAll({ order: 'createdAt ASC' })
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

                const form = HousingForm.create({ data, locationId, member }, { include: [ Member ] })

    			return form
    		}
    	}
    })
})

//, mutation: MutationType

export default new GraphQLSchema({ query: QueryType, mutation: MutationType })