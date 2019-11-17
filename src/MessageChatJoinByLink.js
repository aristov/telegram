import { MessageTypeService } from './MessageTypeService'
import { Notice } from './Notice'

export class MessageChatJoinByLink extends MessageTypeService
{
    build({ content }) {
        return new Notice('New user joined this group')
    }
}
