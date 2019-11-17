import { MessageTypeService } from './MessageTypeService'
import { Notice } from './Notice'

export class MessageSupergroupChatCreate extends MessageTypeService
{
    build({ content }) {
        return new Notice('You joined this channel')
    }
}
