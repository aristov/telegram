import { Feed } from 'ariamodule/lib'
import { Img } from 'htmlmodule/lib'
import { ChatCard } from './ChatCard'
import './ChatsFeed.css'

export class ChatsFeed extends Feed
{
    init(init) {
        super.init(init)
        this.busy = true
        this.app.on('ready', this.onAppReady, this)
    }

    onAppReady(event) {
        this.busy = false
        this.children = event.detail.chats.map(chat => {
            return new ChatCard(chat.title)
        })
        this.append(new Img({ src : `blob:${ location }AQADAgATRz85DwAEAgADgG_43Bb___-yL3N1CTvfKekRBQABFgQ` }))
    }
}
