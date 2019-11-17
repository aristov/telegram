import { Video } from './lib/HTMLVideo'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MediaContainer } from './MediaContainer'
import { MessageContent } from './MessageContent'
import { PublicationTime } from './PublicationTime'
import { TdFile } from './TdFile'

export class MessageAnimation extends MessageContent
{
    async build({ message, content }) {
        const { animation, width } = content.animation
        const text = content.caption.text
        return new Bubble({
            style : { maxWidth : width + 'px' },
            children : [
                new MediaContainer([
                    new Video({
                        src : await TdFile.getFileUrl(animation),
                        autoplay : true
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
