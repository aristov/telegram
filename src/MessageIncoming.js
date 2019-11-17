import { Message } from './Message'
import { MessageTypeService } from './MessageTypeService'
import { UserPhoto } from './UserPhoto'

export class MessageIncoming extends Message
{
    build({ chat, message }) {
        const result = super.build({ chat, message })
        if(chat.is_channel) {
            return result
        }
        const contentType = this.constructor.getContentType(message.content)
        if(MessageTypeService.isPrototypeOf(contentType)) {
            return result
        }
        return [
            new UserPhoto({ user_id : message.sender_user_id }),
            result
        ]
    }
}
