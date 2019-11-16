import { P, Video } from 'htmlmodule/lib'
import { api } from './api'
import { Bubble } from './Bubble'
import { MessageContent } from './MessageContent'
import './MessageVideo.css'

export class MessageVideo extends MessageContent
{
    async build({ message, content }) {
        const { video, width } = content.video
        return new Bubble({
            style : { maxWidth : width + 'px' },
            children : [
                new Video({
                    src : await api.getFileUrl(video),
                    controls : true
                }),
                content.caption.text && new P(content.caption.text)
            ]
        })
    }
}