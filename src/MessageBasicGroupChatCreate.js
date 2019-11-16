import { MessageContent } from './MessageContent'
import { Notice } from './Notice'

export class MessageBasicGroupChatCreate extends MessageContent
{
    build({ content }) {
        return new Notice('Group created')
    }
}
