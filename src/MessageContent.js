import { Div } from './lib'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import './MessageContent.css'

export class MessageContent extends Div
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
    }

    build({ message, content }) {
        return new Bubble(new FormattedText({
            style : { fontFamily : 'monospace' },
            children : `Message type "${ content['@type'] }" is not supported`
        }))
    }
}
