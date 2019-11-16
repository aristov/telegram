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
        else this.emit(type, { detail : update })
    }

    /*================================================================*/

    async getFileUrl(file) {
        const { id, local } = file
        if(local.is_downloading_completed) {
            return await this.readFile(id)
        }
        else if(!local.is_downloading_active && local.can_be_downloaded) {
            this.send('downloadFile', { file_id : id, priority : 1 })
            return new Promise(resolve => {
                const handler = ({ detail : { file } }) => {
                    if(file.id === id && file.local.is_downloading_completed) {
                        this.readFile(file.id).then(resolve)
                        this.un('updateFile', handler)
                    }
                }
                this.on('updateFile', handler)
            })
        }
    }

    async readFile(file_id) {
        const { data } = await this.send('readFile', { file_id })
        return URL.createObjectURL(data)
    }

    /*================================================================*/

    updateOption(update) {
        this.options[update.name] = update.value.value
    }

    updateAuthorizationState(update) {
        const state = update.authorization_state
        const type = state['@type']
        if(typeof this[type] === 'function') {
            this[type](state)
        }
    }

    authorizationStateWaitTdlibParameters(state) {
        this.send('setTdlibParameters', {
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
        this.send('checkDatabaseEncryptionKey', {
            encryption_key : ''
        }).then(console.log).catch(console.error)
    }

    authorizationStateWaitPhoneNumber(state) {
        this.send('setAuthenticationPhoneNumber', {
            phone_number : '+79037307615'
        }).then(console.log).catch(console.error)
    }

    authorizationStateWaitCode(state) {
        this.send('checkAuthenticationCode', {
            code : prompt('Enter authentication code')
        }).then(console.log).catch(console.error)
    }

    authorizationStateReady(state) {
        this.emit('authorizationStateReady', { detail : state })
    }
}
