import { Article } from 'ariamodule/lib'
import { MessageContent } from './MessageContent'
import * as index from './MessageContent.index'
import { MessageTypeService } from './MessageTypeService'
import { UserPhoto } from './UserPhoto'
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
        const contentType = types[content['@type'].toLowerCase()] || MessageContent
        this.children = [
            !message.is_outgoing && !MessageTypeService.isPrototypeOf(contentType)?
                new UserPhoto({
                    user_id : message.sender_user_id
                }) :
                null,
            new contentType({ chat : init.chat, message, content })
        ]
    }
}
