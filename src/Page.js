import { Main } from 'ariamodule/lib'
import { Body } from 'htmlmodule/lib'
import { ChatsFeed } from './ChatsFeed'
import { Inner } from './Inner'
import { Progress } from './Progress'
import './Page.css'

export class Page extends Body
{
    init(init) {
        super.init(init)
        this.children = new Inner([
            new ChatsFeed(new Progress),
            new Main
        ])
    }
}
