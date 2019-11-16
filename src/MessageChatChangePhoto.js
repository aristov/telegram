import { MessageContent } from './MessageContent'
import { Notice } from './Notice'

export class MessageChatChangePhoto extends MessageContent
{
    build({ content }) {
        return new Notice('Channel photo changed')
    }
}
