/**
 * This sample shows how to connect a Box webhook to a Openwhisk app.
 */

'use strict'
import BoxSDK from 'box-node-sdk';

function handleWebhookEvent(body, sdk) {
    // Print basic information about the Box event
    let message = `webhook=${body.webhook.id}`;

    // The event trigger: FILE.DOWNLOADED, FILE.UPLOADED, etc.
    message += `, trigger=${body.trigger}`;

    // The source that triggered the event: a file, folder, etc.
	if (body.source) {
		const source = body.source
		message += `, source=<${source.type} id=${source.id} name=${source.name || 'unknown'}>`
	}
	return { statusCode: 200, body: message }
}

function handler(params) {
    // initial Box SDK
    let sdk = BoxSDK.getPreconfiguredInstance(params.BOX_CONFIG)
 
    let body = new Buffer(params.__ow_body, 'base64')
    body = JSON.parse(body.toString('utf8'));
    
    let isValid = BoxSDK.validateWebhookMessage(body, params.__ow_headers,
		params.BOX_CONFIG.webhooks.primaryKey, params.BOX_CONFIG.webhooks.secondaryKey)
    if (isValid) {
        // Handle the webhook event
        const response = handleWebhookEvent(body, sdk)
        console.log(`${response.statusCode}: ${response.body}`)
        return { message: `${response.statusCode}: ${response.body}` }
    } else {
        console.log(`Error 403: Message authenticity not verified`)
        return { message: `Error 403: Message authenticity not verified` }
    }
}

exports.main = handler;


