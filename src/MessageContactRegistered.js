import { api } from './api'
import { MessageContent } from './MessageContent'
import { Notice } from './Notice'
import { User } from './User'

export class MessageContactRegistered extends MessageContent
{
    build({ message, content }) {
        api.send('getUser', { user_id : message.sender_user_id })
            .then(user => {
                this.children = new Notice([
                    User.getFullName(user),
                    ' joined Telegram'
                ])
            })
    }
}
