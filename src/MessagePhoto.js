import { Img } from 'htmlmodule/lib'
import { api } from './api'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MediaContainer } from './MediaContainer'
import { MessageContent } from './MessageContent'

export class MessagePhoto extends MessageContent
{
    async build({ content }) {
        const sizes = content.photo.sizes
        const photoSize = sizes[1] || sizes[0] || sizes[2]
        if(!photoSize) {
            return new Bubble('Error: requested photo is not awailable')
        }
        const { photo, width } = photoSize
        return new Bubble({
            style : { maxWidth : width + 'px' },
            children : [
                new MediaContainer(new Img({
                    src : await api.getFileUrl(photo),
                    alt : 'Photo'
                })),
                content.caption.text?
                    new FormattedText({ formattedText : content.caption }) :
                    null
            ]
        })
    }
}
