import { api } from './api'
import { MessageContent } from './MessageContent'
import { Notice } from './Notice'
import { TdUser } from './TdUser'

export class MessageChatDeleteMember extends MessageContent
{
    async build({ message, content }) {
        const sender = await api.send('getUser', { user_id : message.sender_user_id })
        const user = await api.send('getUser', { user_id : content.user_id })
        return new Notice([
            TdUser.getFullName(sender),
            ' removed ',
            TdUser.getFullName(user)
        ])
    }
}
