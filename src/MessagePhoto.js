import { Img, P } from 'htmlmodule/lib'
import { api } from './api'
import { Bubble } from './Bubble'
import { MessageContent } from './MessageContent'
import './MessagePhoto.css'

export class MessagePhoto extends MessageContent
{
    build({ content }) {
        const { photo, width } = content.photo.sizes[1]
        api.getFileUrl(photo).then(src => {
            this.children = new Bubble({
                style : { maxWidth : width + 'px' },
                children : [
                    new Img({ src, alt : 'Photo' }),
                    content.caption.text && new P(content.caption.text)
                ]
            })
        })
    }
}
