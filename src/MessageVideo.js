import { Video } from 'htmlmodule/lib'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MediaContainer } from './MediaContainer'
import { MessageContent } from './MessageContent'
import { TdFile } from './TdFile'

export class MessageVideo extends MessageContent
{
    async build({ message, content }) {
        const { video, width } = content.video
        return new Bubble({
            style : { maxWidth : width + 'px' },
            children : [
                new MediaContainer(new Video({
                    src : await TdFile.getFileUrl(video),
                    controls : true
                })),
                content.caption.text?
                    new FormattedText({ formattedText : content.caption }) :
                    null
            ]
        })
    }
}
