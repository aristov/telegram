import { MessageContent } from './MessageContent'
import { Notice } from './Notice'

export class MessageSupergroupChatCreate extends MessageContent
{
    build({ content }) {
        return new Notice('You joined this channel')
    }
}
