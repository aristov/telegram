import { ChatChannel } from './ChatChannel'
import { ChatFeed } from './ChatFeed'
import { Chat } from './Chat'
import { Content } from './Content'
import { Page } from './Page'
import * as index from './ChatType.index'

const types = {}

for(const key of Object.keys(index)) {
    types[key.toLowerCase()] = index[key]
}

export class ChatPage extends Page
{
    build(init) {
        this.on('chatselected', this.onChatSelected, this)
        return new Content([
            new ChatFeed,
            new Chat
        ])
    }

    onChatSelected(event) {
        const chat = event.detail.chat
        const chatType = chat.type.is_channel?
            ChatChannel :
            types[chat.type['@type'].toLowerCase()] || Chat
        const main = new chatType({ chat : event.detail.chat })
        this.find(Chat).replaceWith(main)
        main.updateFeed()
    }
}
