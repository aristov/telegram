import TdClient from 'tdweb/dist/tdweb'

const WASM_FILE_HASH = 'b4b0d61282108a31908dd6b2dbd7067b'
const WASM_FILE_NAME = WASM_FILE_HASH + '.wasm'
const API_ID = '1038348'
const API_HASH = 'c18fa7085ac8a713f3df8ea921cfb760'
const wasmUrl = `${ WASM_FILE_NAME }?_sw-precache=${ WASM_FILE_HASH }`

export class ApiClient
{
    constructor() {
        this._client = new TdClient({ wasmUrl })
        this._client.onUpdate = this.onUpdate.bind(this)
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
        console.log(update)
        if(update.file.local.is_downloading_completed) {
            this.readFile(update.file)
        }
    }

    readFile(file) {
        this._client.send({
            '@type' : 'readFile',
            file_id : file.id
        }).then(response => {
            window.dispatchEvent(new CustomEvent('readFile', {
                detail : {
                    file : file,
                    data : response.data
                }
            }))
        }).catch(console.error)
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
                application_version : '1.0.0'
            }
        }).then(console.log).catch(console.error)
    }

    authorizationStateWaitEncryptionKey(state) {
        this._client.send({
            '@type' : 'checkDatabaseEncryptionKey',
            encryption_key : ''
        }).then(console.log).catch(console.error)
    }

    authorizationStateWaitPhoneNumber(state) {
        this._client.send({
            '@type' : 'setAuthenticationPhoneNumber',
            phone_number : '+79037307615'
        }).then(console.log).catch(console.error)
    }

    authorizationStateWaitCode(state) {
        this._client.send({
            '@type' : 'checkAuthenticationCode',
            code : prompt('Enter authentication code')
        }).then(console.log).catch(console.error)
    }

    authorizationStateReady(state) {
        console.log(state)
        this._client.send({
            '@type' : 'getChats',
            offset_order : '9223372036854775807',
            limit : 20
        }).then(response => {
            Promise.all(response.chat_ids.map(chat_id => {
                return this._client.send({
                    '@type' : 'getChat',
                    chat_id
                })
            })).then(chats => {
                console.log(chats)
                window.dispatchEvent(new CustomEvent('ready', { detail : { chats } }))
                chats.filter(({ photo }) => photo).forEach(chat => {
                    const local = chat.photo.small.local
                    if(local.can_be_downloaded) {
                        if(local.is_downloading_completed) {
                            this.readFile(chat.photo.small)
                        }
                        else if(!local.is_downloading_active) {
                            this._client.send({
                                '@type' : 'downloadFile',
                                file_id : chat.photo.small.id,
                                priority : 1
                            }).then(console.log).catch(console.error)
                        }
                    }
                })
                /*this._client.send({
                    '@type' : 'getChatHistory',
                    chat_id : chats[0].id,
                    from_message_id : chats[0].last_message.id,
                    offset : 0,
                    limit : 20,
                }).then(console.log).catch(console.error)*/
            }).catch(console.error)
        }).catch(console.error)
    }
}
