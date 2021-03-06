import {GraphQLString, GraphQLBoolean, JSONType, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLObjectType, GraphQLList, GraphQLSchema, GraphQLInputObjectType} from 'graphql'
import _ from 'underscore'
import models from './index'
import {Mandrill} from 'mandrill-api/mandrill'
import ShortID from 'shortid'

const mandrillClient = new Mandrill('9QNK2YwAhHJZaWnuOxB1ZQ')

const {User, Location, Member, HousingForm} = models

async function addLocations() {
    const {count} = await Location.findAndCountAll()
    
    if (count === 0) {
        try {
            const locations = [
                {
                    description: "Gold River",
                    coordinates: ""
                },
                {
                    description: "Medway",
                    coordinates: ""
                },
                {
                    description: "Ponhook",
                    coordinates: ""
                },
                {
                    description: "Wildcat",
                    coordinates: ""
                },
                {
                    description: "Yarmouth",
                    coordinates: ""
                }
            ]

            console.log("Create locations")

            const locationResult = await Promise.all(locations.map((location) => {
                return Location.create(location)
            }))

            // const createResult = await Location.bulkCreate(, { individualHooks: true })

            // console.log(locationResult)
        }
        catch(error) {
            console.log("Error")
            console.error(error)
        }

        // console.log(createResult)
    }
}

addLocations().then(() => {
    // console.log('done')
})

const sendEmail = ({ html, text, subject, to }) => { 
    var message = {
        html, text, subject, to,
        from_email: "mailer@acadiaband.ca",
        from_name: "Acadia First Nation",
        headers: {
            "Reply-To": "mailer@acadiaband.ca"
        },
        important: false,
        track_opens: null,
        track_clicks: null,
        auto_text: null,
        auto_html: null,
        inline_css: null,
        url_strip_qs: null,
        preserve_recipients: null,
        view_content_link: null,
        tracking_domain: null,
        signing_domain: null,
        return_path_domain: null,
        merge: false,
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
            type: GraphQLInt
        },
        scisID: {
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
        },
        birthDate: {
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
        uid: {
            type: GraphQLString
        },
        createdAt: {
            type: GraphQLString
        },
        data: {
        	type: HousingFormDataType
        },
        rejectedAt: {
            type: GraphQLString
        },
        approvedAt: {
            type: GraphQLString
        },
        archivedAt: {
            type: GraphQLString
        },
        member: {
        	type: MemberType,
        	resolve: async function(findOptions, args, context, info) {
                console.log(`find member by id`)
                console.log(findOptions.memberId)

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

graphFields.housingFormWithShortId = {
    type: HousingFormType,
    args: {
        shortid: {
            type: GraphQLString
        }
    },
    resolve: (parent, { shortid: uid }) => {
        return HousingForm.findOne({
            where: { uid }
        })
    }
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
        id: {
            type: GraphQLInt
        },
        scisID: {
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
		},
        birthDate: {
            type: GraphQLString,
            default: null
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
        individuals: {
        	type: new GraphQLList(IndividualInputType)
        }
    }
})

const getFormURL = (uid) => `https://housingapp.acadiafirstnation.ca/form/${ uid }`

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
    		resolve: async function(findOptions, { input }) {
    			const {location: locationId} = input

                if (!locationId) {
                    throw(new Error("invalid location id"))
                }

                // console.log("resolve")
                console.log(`location id`)
                console.log(locationId)

                const uid = ShortID()

                const {scisID} = input.member

                let member = await Member.findOne({
                    where: {
                        scisID
                    }
                })

                let form = null

                const data = _.omit(_.clone(input), 'location', 'member')
                const formData = { data, uid, locationId }

                if (member) {
                    console.log('find forms for member')
                    console.log(member)

                    member.email = input.member.email
                    member.firstName = input.member.firstName
                    member.lastName = input.member.lastName
                    member.phone = input.member.phone
                    member.birthDate = input.member.birthDate

                    let existingForm = null

                    try {
                        await member.save()

                        existingForm = await HousingForm.findOne({
                            where: {
                                archivedAt: null
                            },
                            include: [
                                {
                                    model: Member,
                                    required: true,
                                    where: { scisID }
                                }
                            ]
                        })

                        existingForm.archivedAt = new Date()
                        existingForm.member = member.id

                        await existingForm.save()
                    }
                    catch(error) {
                        existingForm = null
                        console.log("ERROR FINDING FORM")
                        console.error(error)
                    }

                    member = member.get({ plain: true })
                    formData.memberId = member.id
                } else {
                    member = input.member
                    formData.member = input.member
                }

                console.log("Create form")

                try {
                    form = await HousingForm.create(formData, { include: [ Member ] })
                }
                catch(error) {
                    console.log(error)
                }
                console.log("Created form")
                console.log(form.get({ plain: true }))
                
                const formURL = getFormURL(uid)
                const {email, firstName, lastName} = member
                const name = `${ firstName } ${ lastName }`.trim()
                
                console.log("Send email")
                const emailBody = "Thank you for submitting your housing form. You will receive another email from us once it has been processed.\n\nTo update your form use the url below:\n\n" + formURL

                const emailHTML = `
                    <p>Thank you for submitting your housing form. You will receive another email from us once it has been processed.</p>
                    <p>To update your form use the url below:</p>
                    <a href=${ JSON.stringify(formURL) }>${ formURL }</a>`

                const supportBody = "Housing form has been received. To process forms visit the admin page:\n\nhttps://housingapp.acadiafirstnation.ca/admin/"
                const supportHTML = `
                    <p>Housing form has been received. To process forms visit the admin page:</p>
                    <a href="https://housingapp.acadiafirstnation.ca/admin/">https://housingapp.acadiafirstnation.ca/admin/</a>`

                // Send to itsupport
                sendEmail({
                    to: [{ email: 'housingapplications@acadiaband.ca', name: 'Housing Applications', type: "to" }],
                    html: supportHTML,
                    text: supportBody,
                    subject: "Housing form received",
                })

                // Send to user
                sendEmail({
                    to: [{ email, name, type: "to" }],
                    html: emailHTML,
                    text: emailBody,
                    subject: "Housing form received",
                })

    			return form
    		}
    	},
        approveForm: {
            args: {
                id: {
                    type: GraphQLInt
                },
                message: {
                    type: GraphQLString
                }
            },
            type: HousingFormType,
            resolve: async function(findOptions, { id, message }) {
                console.log(`Approve form ${ id }`)

                const form = await HousingForm.findById(id, {
                    include: [
                        { model: Member, required: true }
                    ]
                })
                
                await form.update({ approvedAt: new Date() })
                
                const {member} = form
                const {email, firstName, lastName} = member
                const name = `${ firstName } ${ lastName }`.trim()
                
                const emailBody = "Your housing form has been approved.\n\n" + message + "\n\nYou may resubmit your form by clicking below:\n\n" + formURL

                const emailHTML = `
                    <p>Your housing form has been approved.</p>
                    <p>${ message }</p>
                    <p>You may resubmit your form by clicking below:</p>
                    <a href=${ JSON.stringify(formURL) }>${ formURL }</a>`

                sendEmail({
                    to: [{ email, name, type: "to" }],
                    html: emailHTML,
                    text: emailBody,
                    subject: "Housing form approved",
                })

                return form
            }
        },
        archiveForm: {
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            type: HousingFormType,
            resolve: async function(findOptions, { id }) {
                var form = null

                try {
                    form = await HousingForm.findById(id, {
                        include: [
                            { model: Member, required: true }
                        ]
                    })

                    await form.update({ archivedAt: new Date() })
                }

                catch(error) {
                    console.log("REJECT FAILED")
                    console.error(error)
                }

                return form
            }
        },
        rejectForm: {
            args: {
                id: {
                    type: GraphQLInt
                },
                message: {
                    type: GraphQLString
                }
            },
            type: HousingFormType,
            resolve: async function(findOptions, { id, message }) {
                var form = null

                try {
                    form = await HousingForm.findById(id, {
                        include: [
                            { model: Member, required: true }
                        ]
                    })
                    
                    await form.update({ rejectedAt: new Date() })
                    
                    console.log('send email (rejection)')
                    const {member, uid} = form
                    const {email, firstName, lastName} = member
                    const name = `${ firstName } ${ lastName }`.trim()

                    const formURL = getFormURL(uid)
                    const emailBody = "Your housing form has been rejected.\n" + message + "\n\nYou may resubmit your form by clicking below:\n\n" + formURL

                    const emailHTML = `
                        <p>Your housing form has been rejected.</p>
                        <p>${ message }</p>
                        <p>You may resubmit your form by clicking below:</p>
                        <a href=${ JSON.stringify(formURL) }>${ formURL }</a>`

                    sendEmail({
                        to: [{ email, name, type: "to" }],
                        html: emailHTML,
                        text: emailBody,
                        subject: "Housing form rejected",
                    })
                }

                catch(error) {
                    console.log("REJECT FAILED")
                    console.error(error)
                }

                return form
            }
        }
    })
})

//, mutation: MutationType

export default new GraphQLSchema({ query: QueryType, mutation: MutationType })