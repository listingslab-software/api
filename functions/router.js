const PJSON = require('./package.json')
const { ping } = require( './endpoints/ping' )
const { individuals } = require( './endpoints/individuals/individuals' )
const { hosts } = require( './endpoints/hosts/hosts' )
const { localify } = require( './endpoints/localify/localify' )

exports.router = async (req, res, db) => {	
	
	let params = req.params[0].split( `/` )
	params = params.slice( 1, params.length)
	let endpoint = params[0]
	let action = params[1]

	switch (endpoint) { 
		
		case ``:			
			respond(req, res, { response: {status: 200, data: { 
				message: `Help you with something, brah?`,
				examples: {
					ping: `${ getBaseAPIUrl( req ) }ping`
				}
			}}})
			return 

		case `ping`:
			respond(req, res, {
				response:{ 
					status: 200, 
					data: { 
						message: `pong` 
					}}})
			return

		case `individuals`:
			let individualsData = await individuals(req, res, db)
			respond(req, res, { response:{ 
									error: individualsData.error, 
									status: individualsData.status, 
									data: individualsData.data, 
			}})
			return


		case `hosts`:
			let hostsData = await hosts(req, res, db, action)
			respond(req, res, { response:{ 
									error: hostsData.error, 
									status: hostsData.status, 
									data: hostsData.data, 
			}})
			return


		case `localify`:
			let localifyData = await localify(req, res, db, action)
			respond(req, res, { response:{ 
									error: localifyData.error, 
									status: localifyData.status, 
									data: localifyData.data, 
			}})
			return

		default: {
			respond(req, res, { 
				response:{ status: 404, data: {  message: `Sorry, that endpoint does not exist`}}})
			return
		}
	}
}

function respond ( req, res, response ){
	const {
		path,
		method,
	} = req
	
	let params = req.params[0].split( `/` )
	params = params.slice( 1, params.length)
	let endpoint = params[0]

	let r = {
		// app: PJSON.name,
		baseAPIUrl: getBaseAPIUrl( req ),
		version: PJSON.version,
		contact: process.env.GMAIL_ACCOUNT,
		time: Date.now(),
		request: {
			path,
			method,
			endpoint,
		},
		...response,
	}
	res.send(JSON.stringify(r))
}

function getBaseAPIUrl (req) {
	let baseAPIUrl = `https://api.listingslab.com/`
	if ( req.hostname === 'localhost' ){
		baseAPIUrl = `http://localhost:5001/listingslab--express-api/us-central1/api/`
	}
	return baseAPIUrl
}