
/**
 * This sample shows how to connect a Box webhook to a Openwhisk app.
 */

'use strict'
import BoxSDK from 'box-node-sdk'

function main(args) {

    const boxConfig = JSON.parse(args.boxConfig)
    const boxUserId = args.boxUserId
    
    let body = new Buffer(args.__ow_body, 'base64')
    body = JSON.parse(body.toString('utf8'));

    let isValid = BoxSDK.validateWebhookMessage(stringifyBody(body), args.__ow_headers,
        boxConfig.webhooks.primaryKey, boxConfig.webhooks.secondaryKey)

    return new Promise(function (resolve, reject) {
        if (isValid) {
            //Initialize Box SDK
            const boxSDK = BoxSDK.getPreconfiguredInstance(boxConfig)

            // Get an app user client
            const boxClient = boxSDK.getAppAuthClient('user', boxUserId)

            // Print basic information about the Box event
            let message = `webhook=${body.webhook.id}`;

            // The event trigger: FILE.DOWNLOADED, FILE.UPLOADED, etc.
            message += `, trigger=${body.trigger}`;

            // The source that triggered the event: a file, folder, etc.
            if (body.source) {
                const source = body.source
                message += `, source=<${source.type} id=${source.id} name=${source.name || 'unknown'}>`
            }
            console.log(message)
            resolve({ message: message })
        } else {
            console.log(`Error 403: Message authenticity not verified ${isValid}`)
            reject({ message: `Error 403: Message authenticity not verified` })
        }
    })

}

/**
 *  Stringify the request body from 'object' to 'string'. 
 *  Fix the issue that Box validateWebhookMessage method cannot handle Chinese 
 *  and other none-ASCII characters correctly.
 */
function stringifyBody(obj) {
    var str = JSON.stringify(obj)
    str = str.replace(/\"name\":\"(.*?)\"/g, (match, str) => {
        str = "\"" + str.replace(/([^\u0000-\u007F])/g, (match, str) => {
            return escape(str).replace(/%u/g, "\\u").toLowerCase()
        }) + "\""
        return `"name":${str}`
    })
    return str
}

exports.main = main;



