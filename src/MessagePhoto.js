import { Img } from 'htmlmodule/lib'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MediaContainer } from './MediaContainer'
import { MessageContent } from './MessageContent'
import { PublicationTime } from './PublicationTime'
import { TdFile } from './TdFile'

export class MessagePhoto extends MessageContent
{
    async build({ content, message }) {
        const sizes = content.photo.sizes
        const photoSize = sizes[1] || sizes[0] || sizes[2]
        if(!photoSize) {
            return new Bubble('Error: requested photo is not awailable')
        }
        const { photo, width } = photoSize
        const text = content.caption.text
        return new Bubble({
            style : { maxWidth : width + 'px' },
            children : [
                new MediaContainer([
                    new Img({
                        src : await TdFile.getFileUrl(photo),
                        alt : 'Photo'
                    }),
                    text? null : new PublicationTime({ message })
                ]),
                text && new FormattedText({
                    formattedText : content.caption,
                    time : new PublicationTime({ message })
                })
            ]
        })
    }
}
