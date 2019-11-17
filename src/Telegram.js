import { WindowAssembler } from './lib/WindowAssembler'
import { api } from './api'
import { AuthPage } from './AuthPage'
import { ChatPage } from './ChatPage'
import { Page } from './Page'

export class Telegram extends WindowAssembler
{
    init(init) {
        super.init(init)
        this.document.documentElement.lang = 'en'
        new Page({ node : document.body })
        api.on('updateAuthorizationState', this.onUpdateAuthorizationState.bind(this))
    }

    onUpdateAuthorizationState({ detail : { authorization_state } }) {
        switch(authorization_state['@type']) {
            case 'authorizationStateReady':
                this.page = new ChatPage
                break
            case 'authorizationStateLoggingOut':
            case 'authorizationStateClosing':
                this.page = new Page
                break
            case 'authorizationStateClosed':
                location.reload()
                break
            default:
                const page = this.page
                if(page instanceof AuthPage) {
                    page.build({ authorization_state })
                    return
                }
                this.page = new AuthPage({ authorization_state })
        }
    }

    set page(page) {
        this.page.replaceWith(page)
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
