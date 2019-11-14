import { Body } from 'htmlmodule/lib'
import { api } from './api'
import { ChatFeed } from './ChatFeed'
import { Inner } from './Inner'
import { Progress } from './Progress'
import './Page.css'

export class Page extends Body
{
    init(init) {
        super.init(init)
        this.children = new Progress
        api.on('authorizationStateReady', this.onAuthorizationStateReady.bind(this))
    }

    onAuthorizationStateReady() {
        this.children = new Inner(new ChatFeed)
    }
}
