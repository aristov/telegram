import { Video } from 'htmlmodule/lib'
import { api } from './api'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'

export class MessageAnimation extends MessageContent
{
    async build({ message, content }) {
        const { animation, width } = content.animation
        return new Bubble({
            style : { maxWidth : width + 'px' },
            children : [
                new Video({
                    src : await api.getFileUrl(animation),
                    autoplay : true
                }),
                content.caption.text?
                    new FormattedText({ formattedText : content.caption }) :
                    null
            ]
        })
    }
}
