import { Details, Div, Pre, Summary } from 'htmlmodule'
import './MessageContent.css'

export class MessageContent extends Div
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
    }

    build({ message, content }) {
        return [
            new Pre(JSON.stringify(content, null, 2)),
            new Details([
                new Summary('message'),
                new Pre(JSON.stringify(message, null, 2)),
            ])
        ]
    }
}
