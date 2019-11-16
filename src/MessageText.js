import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'
import './MessageText.css'

export class MessageText extends MessageContent
{
    build({ content }) {
        return new Bubble(new FormattedText({ text : content.text }))
    }
}
