import { MessageTypeService } from './MessageTypeService'
import { Notice } from './Notice'

export class MessageBasicGroupChatCreate extends MessageTypeService
{
    build({ content }) {
        return new Notice('Group created')
    }
}
