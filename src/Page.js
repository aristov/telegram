import { Body } from 'htmlmodule/lib'
import { api } from './api'
import { ChatFeed } from './ChatFeed'
import { ChatMain } from './ChatMain'
import { CoverProgress } from './CoverProgress'
import { Content } from './Content'
import './Page.css'

export class Page extends Body
{
    init(init) {
        super.init(init)
        this.children = new CoverProgress
        api.on('authorizationStateReady', this.onAuthorizationStateReady.bind(this))
    }

    onAuthorizationStateReady() {
        this.children = new Content([
            new ChatFeed,
            new ChatMain
        ])
        this.on('chatSelected', this.onChatSelected, this)
    }

    onChatSelected(event) {
        this.find(ChatMain).replaceWith(new ChatMain({ chat : event.detail.chat }))
    }
}
