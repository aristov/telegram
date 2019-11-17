import { MessageTypeService } from './MessageTypeService'
import { Notice } from './Notice'

export class MessageChatChangeTitle extends MessageTypeService
{
    build({ content }) {
        return new Notice(`Channel name was changed to «${ content.title }»`)
    }
}
