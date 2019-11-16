import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'

export class MessageText extends MessageContent
{
    build({ content }) {
        return new Bubble(new FormattedText({ formattedText : content.text }))
    }
}
