import { WindowAssembler } from 'htmlmodule/lib'
import { AuthPage } from './AuthPage'

export class Telegram extends WindowAssembler {
    init(init) {
        super.init(init)
        this.document.documentElement.lang = 'en'
        new AuthPage({ node : document.body })
        // api.on('updateAuthorizationState', this.onUpdateAuthorizationState.bind(this))
    }

    /*onUpdateAuthorizationState(event) {}*/
}

Object.defineProperty(Telegram.Assembler.prototype, 'app', {
    get() {
        return Telegram.getInstanceOf(window)
    }
})
