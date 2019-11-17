import { ChatFeed } from './ChatFeed'
import { ChatMain } from './ChatMain'
import { Content } from './Content'
import { Page } from './Page'

export class ChatPage extends Page
{
    build(init) {
        this.on('chatselected', this.onChatSelected, this)
        return new Content([
            new ChatFeed,
            new ChatMain
        ])
    }

    onChatSelected(event) {
        const main = new ChatMain({ chat : event.detail.chat })
        this.find(ChatMain).replaceWith(main)
        main.updateFeed()
    }
}
