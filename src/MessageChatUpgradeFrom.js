import { MessageTypeService } from './MessageTypeService'
import { Notice } from './Notice'

export class MessageChatUpgradeFrom extends MessageTypeService
{
    build({ content }) {
        return new Notice(`Group «${ content.title }» was upgraded to supergroup`)
    }
}
