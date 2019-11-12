import TdClient from 'tdweb/dist/tdweb'
import { version } from '../package'

const WASM_FILE_HASH = 'b4b0d61282108a31908dd6b2dbd7067b'
const WASM_FILE_NAME = WASM_FILE_HASH + '.wasm'
const API_ID = '1038348'
const API_HASH = 'c18fa7085ac8a713f3df8ea921cfb760'
const wasmUrl = `${ WASM_FILE_NAME }?_sw-precache=${ WASM_FILE_HASH }`

export class ApiClient {
    constructor() {
        this._client = new TdClient({ wasmUrl })
        this._client.onUpdate = this.onUpdate.bind(this)
    }

    onUpdate(update) {
        console.log(update)
        const type = update['@type']
        if(typeof this[type] === 'function') {
            this[type](update)
        }
    }

    updateAuthorizationState(update) {
        const state = update.authorization_state
        const type = state['@type']
        if(typeof this[type] === 'function') {
            this[type](state)
        }
    }

    authorizationStateWaitTdlibParameters(state) {
        this._client.send({
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

    authorizationStateWaitEncryptionKey(state) {
        this._client.send({
            '@type' : 'checkDatabaseEncryptionKey',
            encryption_key : ''
        }).then(console.log).catch(console.log)
    }

    authorizationStateWaitPhoneNumber(state) {
        this._client.send({
            '@type' : 'setAuthenticationPhoneNumber',
            phone_number : '+79037307615'
        }).then(console.log).catch(console.log)
    }

    authorizationStateWaitCode(state) {
        this._client.send({
            '@type' : 'checkAuthenticationCode',
            code : prompt('Enter authentication code')
        }).then(console.log).catch(console.log)
    }

    authorizationStateReady(state) {
        console.log('Authorization success!')
    }
}
