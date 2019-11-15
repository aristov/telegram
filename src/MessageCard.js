import { Article } from 'ariamodule/lib'
import types from './MessageContent'
import './MessageCard.css'

export class MessageCard extends Article
{
    init(init) {
        super.init(init)
        const content = init.message.content
        const handler = types[content['@type']]
        if(typeof handler === 'function') {
            this.children = handler(content)
        }
    }
}
