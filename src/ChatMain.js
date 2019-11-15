import { Main } from 'ariamodule/lib'
import { CoverProgress } from './CoverProgress'

export class ChatMain extends Main
{
    init(init) {
        super.init(init)
        this.busy = true
        this.children = new CoverProgress
    }
}
