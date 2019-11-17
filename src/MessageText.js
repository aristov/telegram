import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'
import { PublicationTime } from './PublicationTime'

export class MessageText extends MessageContent
{
    build({ content, message }) {
        return new Bubble([
            new FormattedText({ formattedText : content.text }),
            new PublicationTime({ message })
        ])
    }
}
