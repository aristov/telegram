import { P } from 'htmlmodule/lib'
import { Bubble } from './Bubble'
import { MessageContent } from './MessageContent'
import './MessageText.css'

export class MessageText extends MessageContent
{
    build({ content }) {
        return new Bubble(content.text.text.split('\n\n').map(chunk => {
            return new P({
                innerHTML : chunk.replace(/\n/g, '<br>')
            })
        }))
    }
}
