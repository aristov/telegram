import { api } from './api'
import { MessageContent } from './MessageContent'
import { Notice } from './Notice'
import { TdUser } from './TdUser'

export class MessageContactRegistered extends MessageContent
{
    async build({ message, content }) {
        const user = await api.send('getUser', { user_id : message.sender_user_id })
        return new Notice([
            TdUser.getFullName(user),
            ' joined Telegram'
        ])
    }
}
