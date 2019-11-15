import { Feed } from 'ariamodule/lib'
import { MessageCard } from './MessageCard'
import './MessageFeed.css'

export class MessageFeed extends Feed
{
    init(init) {
        super.init(init)
        this.children = new MessageCard({ message : init.chat.last_message })
    }
}
