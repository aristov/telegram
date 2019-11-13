import { WindowAssembler } from 'htmlmodule/lib'
import { ApiClient } from './ApiClient'
import { Page } from './Page'

export class Telegram extends WindowAssembler {
    init(init) {
        super.init(init)
        this._client = new ApiClient
        new Page({ node : document.body })
    }
}

Object.defineProperty(Telegram.Assembler.prototype, 'app', {
    get() {
        return Telegram.getInstanceOf(window)
    }
})
