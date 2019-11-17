import { WindowAssembler } from 'htmlmodule/lib'
import { api } from './api'
import { AuthPage } from './AuthPage'
import { ChatPage } from './ChatPage'
import { Page } from './Page'

export class Telegram extends WindowAssembler {
    init(init) {
        super.init(init)
        this.document.documentElement.lang = 'en'
        new Page({ node : document.body })
        api.on('updateAuthorizationState', this.onUpdateAuthorizationState.bind(this))
    }

    onUpdateAuthorizationState({ detail : { authorization_state }}) {
        if(authorization_state['@type'] === 'authorizationStateReady') {
            this.page.replaceWith(new ChatPage)
        }
        else this.page.replaceWith(new AuthPage({ authorization_state }))
    }

    get page() {
        return this.document.body
    }
}

Object.defineProperty(Telegram.Assembler.prototype, 'app', {
    get() {
        return Telegram.getInstanceOf(window)
    }
})
