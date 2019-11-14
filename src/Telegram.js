import { WindowAssembler } from 'htmlmodule/lib'
import { api } from './api'
import { Page } from './Page'

export class Telegram extends WindowAssembler {
    init(init) {
        super.init(init)
        new Page({ node : document.body })
    }
}

Object.defineProperty(Telegram.Assembler.prototype, 'app', {
    get() {
        return Telegram.getInstanceOf(window)
    }
})
