import { api } from './api'
import { ChatPhoto } from './ChatPhoto'
import { MessageTypeService } from './MessageTypeService'
import { Notice } from './Notice'

export class MessageChatChangePhoto extends MessageTypeService
{
    async build({ content, message }) {
        return [
            new Notice('Channel photo changed'),
            new ChatPhoto({
                chat : await api.send('getChat', { chat_id : message.chat_id })
            })
        ]
    }
}
