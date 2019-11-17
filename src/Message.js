import { Article } from 'ariamodule/lib'
import { MessageContent } from './MessageContent'
import * as index from './MessageContent.index'
import './Message.css'

const types = {}

for(const key of Object.keys(index)) {
    types[key.toLowerCase()] = index[key]
}

export class Message extends Article
{
    init(init) {
        super.init(init)
        const message = init.message
        const content = message.content
        const type = types[content['@type'].toLowerCase()] || MessageContent
        this.children = new type({ content, message })
    }
}
