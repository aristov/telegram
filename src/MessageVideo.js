import { Video } from 'htmlmodule/lib'
import { api } from './api'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MediaContainer } from './MediaContainer'
import { MessageContent } from './MessageContent'

export class MessageVideo extends MessageContent
{
    async build({ message, content }) {
        const { video, width } = content.video
        return new Bubble({
            style : { maxWidth : width + 'px' },
            children : [
                new MediaContainer(new Video({
                    src : await api.getFileUrl(video),
                    controls : true
                })),
                content.caption.text?
                    new FormattedText({ formattedText : content.caption }) :
                    null
            ]
        })
    }
}
