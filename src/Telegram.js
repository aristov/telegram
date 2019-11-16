import { WindowAssembler } from 'htmlmodule/lib'
import { AuthorizationPage } from './AuthorizationPage'

export class Telegram extends WindowAssembler {
    init(init) {
        super.init(init)
        this.document.documentElement.lang = 'en'
        new AuthorizationPage({ node : document.body })
        // api.on('updateAuthorizationState', this.onUpdateAuthorizationState.bind(this))
    }

    /*onUpdateAuthorizationState(event) {}*/
}

Object.defineProperty(Telegram.Assembler.prototype, 'app', {
    get() {
        return Telegram.getInstanceOf(window)
    }
})
