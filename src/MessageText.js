import { api } from './api'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'
import { PublicationTime } from './PublicationTime'
import { UserName } from './UserName'

export class MessageText extends MessageContent
{
    build({ chat, content, message }) {
        const user_id = message.sender_user_id
        const isGroup = !chat.type.is_channel && /group$/i.test(chat.type['@type'])
        return new Bubble([
            isGroup && user_id !== api.options.my_id?
                new UserName({ user_id : message.sender_user_id }) :
                null,
            new FormattedText({ formattedText : content.text }),
            new PublicationTime({ message })
        ])
    }
}
