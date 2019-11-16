import { Div } from 'htmlmodule'
import { Bubble } from './Bubble'
import './MessageContent.css'

export class MessageContent extends Div
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
    }

    build({ message, content }) {
        return new Bubble({
            style : { color : '#aaa', fontFamily : 'monospace' },
            children : `The message type "${ content['@type'] }" is not supported`
        })
    }
}
