import TdClient from 'tdweb/dist/tdweb'
import { version } from '../package'

const WASM_FILE_HASH = 'b4b0d61282108a31908dd6b2dbd7067b'
const WASM_FILE_NAME = WASM_FILE_HASH + '.wasm'
const API_ID = '1038348'
const API_HASH = 'c18fa7085ac8a713f3df8ea921cfb760'

const client = new TdClient({
    /*logVerbosityLevel : 1,
    jsLogVerbosityLevel : 3,
    mode : 'wasm',
    prefix : 'tdlib',
    readOnly : false,
    isBackground : false,
    useDatabase : false,*/
    wasmUrl : `${ WASM_FILE_NAME }?_sw-precache=${ WASM_FILE_HASH }`
})

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
    }

}
