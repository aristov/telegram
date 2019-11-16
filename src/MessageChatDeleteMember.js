import { api } from './api'
import { MessageContent } from './MessageContent'
import { Notice } from './Notice'
import { User } from './User'

export class MessageChatDeleteMember extends MessageContent
{
    build({ message, content }) {
        Promise.all([
            api.send('getUser', { user_id : message.sender_user_id }),
            api.send('getUser', { user_id : content.user_id })
        ]).then(([sender, user]) => {
            this.children = new Notice([
                User.getFullName(sender),
                ' removed ',
                User.getFullName(user)
            ])
        })
    }
}
