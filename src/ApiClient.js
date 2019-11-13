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
        client.onUpdate = this.onUpdate.bind(this)
    }

    onUpdate(update) {
        // console.log(update)
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

    updateFile(update) {
        this.dispatchEvent(new CustomEvent('updateFile', { detail : update }))
    }

    authorizationStateWaitTdlibParameters(state) {
        client.send({
            '@type' : 'setTdlibParameters',
            parameters : {
                '@type' : 'tdParameters',
                api_id : API_ID,
                api_hash : API_HASH,
                system_language_code : navigator.language || 'en',
                device_model : 'Chrome',
                system_version : 'Mac/iOS',
                application_version : '1.0.0'
            }
        }).then(console.log).catch(console.error)
    }

    authorizationStateWaitEncryptionKey(state) {
        client.send({
            '@type' : 'checkDatabaseEncryptionKey',
            encryption_key : ''
        }).then(console.log).catch(console.error)
    }

    authorizationStateWaitPhoneNumber(state) {
        client.send({
            '@type' : 'setAuthenticationPhoneNumber',
            phone_number : '+79037307615'
        }).then(console.log).catch(console.error)
    }

    authorizationStateWaitCode(state) {
        client.send({
            '@type' : 'checkAuthenticationCode',
            code : prompt('Enter authentication code')
        }).then(console.log).catch(console.error)
    }

    authorizationStateReady(state) {
        console.log(state)
        this.dispatchEvent(new CustomEvent('authorizationStateReady', { detail : state }))
    }

    getChats() {
        return client.send({
            '@type' : 'getChats',
            offset_order : '9223372036854775807',
            limit : 20
        })
    }

    getChat({ chat_id }) {
        return client.send({
            '@type' : 'getChat',
            chat_id
        })
    }

    downloadFile({ file_id }) {
        return client.send({
            '@type' : 'downloadFile',
            file_id,
            priority : 1
        })
    }

    readFile({ file_id }) {
        return client.send({
            '@type' : 'readFile',
            file_id
        })
    }

    getChatHistory({ chat_id, from_message_id }) {
        return client.send({
            '@type' : 'getChatHistory',
            chat_id,
            from_message_id,
            offset : 0,
            limit : 20
        })
    }
}
