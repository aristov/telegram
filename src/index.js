import TdClient from 'tdweb/dist/tdweb'
import { version } from '../package'

const WASM_FILE_HASH = 'b4b0d61282108a31908dd6b2dbd7067b'
const WASM_FILE_NAME = WASM_FILE_HASH + '.wasm'
const API_ID = '1038348'
const API_HASH = 'c18fa7085ac8a713f3df8ea921cfb760'
const wasmUrl = `${ WASM_FILE_NAME }?_sw-precache=${ WASM_FILE_HASH }`

const client = new TdClient({ wasmUrl })

client.onUpdate = function(update) {
    console.log('[UPDATE]', update)
    if(update['@type'] === 'updateAuthorizationState') {
        const state = update.authorization_state
        if(state['@type'] === 'authorizationStateWaitTdlibParameters') {
            client.send({
                '@type' : 'setTdlibParameters',
                parameters : {
                    '@type' : 'tdParameters',
                    api_id : API_ID,
                    api_hash : API_HASH,
                    system_language_code : navigator.language || 'en',
                    device_model : 'Chrome',
                    system_version : 'Mac/iOS',
                    application_version : version
                }
            }).then(console.log).catch(console.log)
        }
        if(state['@type'] === 'authorizationStateWaitEncryptionKey') {
            client.send({
                '@type' : 'checkDatabaseEncryptionKey',
                encryption_key : ''
            }).then(console.log).catch(console.log)
        }
        if(state['@type'] === 'authorizationStateWaitPhoneNumber') {
            client.send({
                '@type' : 'setAuthenticationPhoneNumber',
                phone_number : '+79037307615'
            }).then(console.log).catch(console.log)
        }
        if(state['@type'] === 'authorizationStateWaitCode') {
            client.send({
                '@type' : 'checkAuthenticationCode',
                code : prompt('Enter authentication code')
            }).then(console.log).catch(console.log)
        }
        if(state['@type'] === 'authorizationStateReady') {
            console.log('Authorization success!')
        }
    }
}
