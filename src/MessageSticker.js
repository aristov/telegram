import { HTMLImg as Img } from './lib/HTMLImg'
import { MediaContainer } from './MediaContainer'
import { MessageContent } from './MessageContent'
import { PublicationTime } from './PublicationTime'
import { TdFile } from './TdFile'

export class MessageSticker extends MessageContent
{
    async build({ message, content }) {
        const { sticker } = content.sticker
        return new MediaContainer([
            new Img({
                src : await TdFile.getFileUrl(sticker),
                alt : 'Sticker'
            }),
            new PublicationTime({ message })
        ])
    }
}
