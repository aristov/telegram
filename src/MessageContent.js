import { Div, Pre } from 'htmlmodule'
import './MessageContent.css'

export class MessageContent extends Div
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
    }

    build({ content }) {
        return new Pre(JSON.stringify(content, null, 2))
    }
}
