import { WindowAssembler } from 'htmlmodule/lib'
import { Page } from './Page'

export class Telegram extends WindowAssembler {
    init(init) {
        super.init(init)
        this.document.documentElement.lang = 'en'
        new Page({ node : document.body })
    }
}

Object.defineProperty(Telegram.Assembler.prototype, 'app', {
    get() {
        return Telegram.getInstanceOf(window)
    }
})
