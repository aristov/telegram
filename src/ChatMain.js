import { Main } from 'ariamodule/lib'
import { ChatHead } from './ChatHead'
import { ChatHistory } from './ChatHistory'
import './ChatMain.css'

export class ChatMain extends Main
{
    init(init) {
        super.init(init)
        if(init.chat) {
            this.build(init)
        }
    }

    build({ chat }) {
        this.children = [
            new ChatHead({ chat }),
            this._feed = new ChatHistory({ chat })
        ]
    }

    updateFeed() {
        this._feed.addMessages([this.chat.last_message])
        this._feed.loadMessages()
    }
}

