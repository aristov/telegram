import { Body } from 'htmlmodule/lib'
import { ChatFeed } from './ChatFeed'
import { Inner } from './Inner'
import './Page.css'

export class Page extends Body
{
    init(init) {
        super.init(init)
        this.children = new Inner(new ChatFeed)
    }
}
