import TdClient from 'tdweb/dist/tdweb'

const WASM_FILE_HASH = 'b4b0d61282108a31908dd6b2dbd7067b'
const WASM_FILE_NAME = WASM_FILE_HASH + '.wasm'
const API_ID = '1038348'
const API_HASH = 'c18fa7085ac8a713f3df8ea921cfb760'
const wasmUrl = `${ WASM_FILE_NAME }?_sw-precache=${ WASM_FILE_HASH }`
const client = new TdClient({ wasmUrl })

export class ApiClient extends EventTarget
{
    constructor(...args) {
        super(...args)
        this.options = {}
        client.onUpdate = this.onUpdate.bind(this)
    }

    on(type, callback, options) {
        this.addEventListener(type, callback, options)
    }

    un(type, callback, options) {
        this.removeEventListener(type, callback, options)
    }

    emit(eventOrType, eventInitDict) {
        if(typeof eventOrType === 'string') {
            eventOrType = new CustomEvent(eventOrType, eventInitDict)
        }
        return this.dispatchEvent(eventOrType)
    }

    send(type, query = {}) {
        query['@type'] = type
        return client.send(query)
    }

    onUpdate(update) {
        // console.log(update)
        const type = update['@type']
        if(typeof this[type] === 'function') {
            this[type](update)
        }
        this.emit(type, { detail : update })
    }

    /*================================================================*/

    updateOption(update) {
        this.options[update.name] = update.value.value
    }

    updateAuthorizationState(update) {
        const state = update.authorization_state
        const type = state['@type']
        if(typeof this[type] === 'function') {
            this[type](state).then(console.log).catch(error => {
                console.error(Error(error.message))
            })
        }
    }

    authorizationStateWaitTdlibParameters(state) {
        return this.send('setTdlibParameters', {
            parameters : {
                '@type' : 'tdParameters',
                api_id : API_ID,
                api_hash : API_HASH,
                system_language_code : navigator.language || 'en',
                device_model : 'Chrome',
                system_version : 'Mac/iOS',
                application_version : '1.0.0'
            }
        })
    }

    authorizationStateWaitEncryptionKey(state) {
        return this.send('checkDatabaseEncryptionKey', {
            encryption_key : ''
        })
    }
}

// authorizationStateWaitTdlibParameters     +
// authorizationStateWaitEncryptionKey       +

// authorizationStateWaitPhoneNumber         +
// authorizationStateWaitCode                +
// authorizationStateWaitPassword
// authorizationStateWaitRegistration

// authorizationStateReady                   +

// authorizationStateClosed                  +
// authorizationStateClosing                 +
// authorizationStateLoggingOut              +
