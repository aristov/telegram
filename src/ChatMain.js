import { Main } from 'ariamodule/lib'
import { ChatHead } from './ChatHead'
import { CoverProgress } from './CoverProgress'
import { MessageFeed } from './MessageFeed'
import './ChatMain.css'

export class ChatMain extends Main
{
    init(init) {
        super.init(init)
        if(init.chat) {
            this.build(init)
            return
        }
        this.busy = true
        this.children = new CoverProgress
    }

    build({ chat }) {
        this.children = [
            new ChatHead({ chat }),
            new MessageFeed({ chat })
        ]
    }
}

