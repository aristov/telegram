import { Img } from 'htmlmodule/lib'
import { api } from './api'
import { MediaContainer } from './MediaContainer'
import { MessageContent } from './MessageContent'

export class MessageSticker extends MessageContent
{
    async build({ message, content }) {
        const { sticker } = content.sticker
        return new MediaContainer(new Img({
            src : await api.getFileUrl(sticker),
            alt : 'Sticker'
        }))
    }
}
