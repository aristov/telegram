import { api } from './api'
import { ChatPhoto } from './ChatPhoto'
import { MessageContent } from './MessageContent'
import { Notice } from './Notice'

export class MessageChatChangePhoto extends MessageContent
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
