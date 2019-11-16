import { Feed } from 'ariamodule/lib'
import { api } from './api'
import { MessageCard } from './MessageCard'
import './MessageFeed.css'

const LIMIT = 20

export class MessageFeed extends Feed
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
    }

    build({ chat }) {
        return new MessageCard({ message : chat.last_message })
    }

    assign(init) {
        super.assign(init)
        this.loadMessages()
    }

    loadMessages() {
        return api.send('getChatHistory', {
            chat_id : this.chat.id,
            from_message_id : this.chat.last_message.id,
            offset : 0,
            limit : LIMIT
        }).then(({ messages }) => this.addMessages(messages))
    }

    addMessages(messages) {
        console.log(messages)
        for(const message of messages) {
            this.prepend(new MessageCard({ message }))
        }
    }
}
