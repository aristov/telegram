import { Div } from './lib'
import { Time } from './lib'
import { api } from './api'
import { CallTimeInfo } from './CallTimeInfo'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'
import { PublicationTime } from './PublicationTime'
import moment from './moment'

export class MessageCall extends MessageContent
{
    build({ content, message }) {
        const callType = message.sender_user_id === api.options.my_id?
            'Outgoing call' :
            'Incoming call'
        const durationText = moment.duration(content.duration, 'seconds').humanize()
        return new Bubble([
            new FormattedText([
                new Div(callType),
                new CallTimeInfo([
                    new Time(moment.unix(message.date).format('HH:mm')),
                    !!content.duration && [', ', new Time(durationText)]
                ])
            ]),
            new PublicationTime({ message })
        ])
    }
}
