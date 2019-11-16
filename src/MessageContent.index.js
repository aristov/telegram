import moment from './moment'
import { Div, Time } from 'htmlmodule'
import { Img, P } from 'htmlmodule/lib'
import { MessageBubble } from './MessageBubble'
import { api } from './api'
import { MessageContent } from './MessageContent'
import { Notice } from './Notice'
import { User } from './User'

export class MessageText extends MessageContent
{
    build({ content }) {
        return new MessageBubble(content.text.text.split('\n\n').map(chunk => {
            return new P({
                innerHTML : chunk.replace(/\n/g, '<br>')
            })
        }))
    }
}

export class MessagePhoto extends MessageContent
{
    build({ content }) {
        const { photo, width } = content.photo.sizes[1]
        api.getFileSrc(photo).then(src => {
            this.children = new MessageBubble({
                style : { maxWidth : width + 'px' },
                children : [
                    new Img({ src, alt : 'Photo' }),
                    content.caption.text && new P(content.caption.text)
                ]
            })
        })
    }
}

export class MessageChatChangeTitle extends MessageContent
{
    build({ content }) {
        return new Notice(`Channel name was changed to «${ content.title }»`)
    }
}

export class MessageChatChangePhoto extends MessageContent
{
    build({ content }) {
        return new Notice('Channel photo changed')
    }
}

export class MessageBasicGroupChatCreate extends MessageContent
{
    build({ content }) {
        return new Notice('Group created')
    }
}

export class MessageAnimation extends MessageContent
{
}

export class MessageCall extends MessageContent
{
    build({ content, message }) {
        const callType = message.sender_user_id === api.options.my_id?
            'Outgoing call' :
            'Incoming call'
        const durationText = moment.duration(content.duration, 'seconds').humanize()
        return new MessageBubble([
            new Div(callType),
            new CallTimeInfo([
                new Time(moment.unix(message.date).format('HH:mm')),
                !!content.duration && [', ', new Time(durationText)]
            ])
        ])
    }
}

export class MessageContactRegistered extends MessageContent
{
    build({ message, content }) {
        api.send('getUser', { user_id : message.sender_user_id })
            .then(user => {
                this.children = new Notice([
                    User.getFullName(user),
                    ' joined Telegram'
                ])
            })
    }
}

export class MessageChatDeleteMember extends MessageContent
{
    build({ message, content }) {
        Promise.all([
            api.send('getUser', { user_id : message.sender_user_id }),
            api.send('getUser', { user_id : content.user_id })
        ]).then(([sender, user]) => {
            this.children = new Notice([
                User.getFullName(sender),
                ' removed ',
                User.getFullName(user)
            ])
        })
    }
}

export class MessageSupergroupChatCreate extends MessageContent
{
}

export class MessageVideo extends MessageContent
{
}

class CallTimeInfo extends Div
{
}
