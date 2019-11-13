import { Feed } from 'ariamodule/lib'
import { api } from './api'
import { ChatCard } from './ChatCard'
import { Progress } from './Progress'
import './ChatFeed.css'

export class ChatFeed extends Feed
{
    init(init) {
        super.init(init)
        this.busy = true
        this.children = new Progress
        api.send('getChats', {
                offset_order : '9223372036854775807',
                limit : 20
            })
            .then(response => {
                this.busy = false
                Promise.all(response.chat_ids.map(chat_id => {
                    return api.send('getChat', { chat_id })
                })).then(chats => {
                    this.children = chats.map(chat => new ChatCard({ chat }))
                }).catch(console.error)
            })
            .catch(console.error)
    }
}
