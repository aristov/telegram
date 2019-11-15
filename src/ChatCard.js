import { Article } from 'ariamodule/lib'
import { api } from './api'
import { ChatNotifier } from './ChatNotifier'
import { ChatPhoto } from './ChatPhoto'
import { ChatPreview } from './ChatPreview'
import { ChatTime } from './ChatTime'
import { ChatTitle } from './ChatTitle'
import { Inner } from './Inner'
import './ChatCard.css'

export class ChatCard extends Article
{
    init(init) {
        super.init(init)
        this.build(init)
        api.on('updateChatPhoto', this.onUpdate.bind(this))
        api.on('updateChatTitle', this.onUpdate.bind(this))
        api.on('updateChatLastMessage', this.onUpdate.bind(this))
        api.on('updateChatReadInbox', this.onUpdate.bind(this))
        api.on('updateChatIsMarkedAsUnread', this.onUpdate.bind(this))
    }

    async onUpdate({ detail : { chat_id } }) {
        if(chat_id !== this.chat.id) return
        this.build({
            chat : this.chat = await api.send('getChat', { chat_id })
        })
    }

    build({ chat }) {
        this.children = [
            new ChatPhoto({ chat }),
            new Inner([
                new ChatTitle({ chat }),
                chat.last_message && new ChatTime({ chat })
            ]),
            new Inner([
                chat.last_message && new ChatPreview({ chat }),
                !!chat.unread_count && new ChatNotifier({ chat })
            ])
        ]
    }
}
