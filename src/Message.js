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
        this.setProperty('children', this.build(init))
    }

    build({ chat, message }) {
        const content = message.content
        const contentType = this.constructor.getContentType(content)
        return new contentType({ chat, message, content })
    }

    static getContentType(content) {
        return types[content['@type'].toLowerCase()] || MessageContent
    }
}
