import { MessageContent } from './MessageContent'
import { Notice } from './Notice'

export class MessageChatChangeTitle extends MessageContent
{
    build({ content }) {
        return new Notice(`Channel name was changed to «${ content.title }»`)
    }
}
