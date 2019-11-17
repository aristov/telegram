import { api } from './api'
import { MessageTypeService } from './MessageTypeService'
import { Notice } from './Notice'
import { TdUser } from './TdUser'

export class MessageContactRegistered extends MessageTypeService
{
    async build({ message, content }) {
        const user = await api.send('getUser', { user_id : message.sender_user_id })
        return new Notice([
            TdUser.getFullName(user),
            ' joined Telegram'
        ])
    }
}
