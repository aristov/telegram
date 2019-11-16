import { api } from './api'
import { MessageContent } from './MessageContent'
import { Notice } from './Notice'
import { TdUser } from './TdUser'

export class MessageContactRegistered extends MessageContent
{
    build({ message, content }) {
        api.send('getUser', { user_id : message.sender_user_id })
            .then(user => {
                this.children = new Notice([
                    TdUser.getFullName(user),
                    ' joined Telegram'
                ])
            })
    }
}
