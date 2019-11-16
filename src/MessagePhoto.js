import { Img, P } from 'htmlmodule/lib'
import { api } from './api'
import { Bubble } from './Bubble'
import { MessageContent } from './MessageContent'
import './MessagePhoto.css'

export class MessagePhoto extends MessageContent
{
    async build({ content }) {
        const { photo, width } = content.photo.sizes[1]
        return new Bubble({
            style : { maxWidth : width + 'px' },
            children : [
                new Img({
                    src : await api.getFileUrl(photo),
                    alt : 'Photo'
                }),
                content.caption.text && new P(content.caption.text)
            ]
        })
    }
}
