import { Main } from './lib'
import { ChatHead } from './ChatHead'
import { ChatHistory } from './ChatHistory'
import './Chat.css'

export class Chat extends Main
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
