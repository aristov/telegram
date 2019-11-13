import { Feed } from 'ariamodule/lib'
import { ChatCard } from './ChatCard'
import './ChatFeed.css'

export class ChatFeed extends Feed
{
    init(init) {
        super.init(init)
        this.busy = true
        this.app.on('ready', this.onAppReady, this)
    }

    onAppReady(event) {
        this.busy = false
        this.children = event.detail.chats.map(chat => {
            return new ChatCard({ chat })
        })
    }
}
