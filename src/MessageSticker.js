import { Img } from 'htmlmodule/lib'
import { MediaContainer } from './MediaContainer'
import { MessageContent } from './MessageContent'
import { TdFile } from './TdFile'

export class MessageSticker extends MessageContent
{
    async build({ message, content }) {
        const { sticker } = content.sticker
        return new MediaContainer(new Img({
            src : await TdFile.getFileUrl(sticker),
            alt : 'Sticker'
        }))
    }
}
