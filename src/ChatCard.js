import moment from './moment'
import { Article, Status } from 'ariamodule/lib'
import { Div, Span, Time } from 'htmlmodule/lib'
import { ChatPhoto } from './ChatPhoto'
import './ChatCard.css'

class ChatTitle extends Span
{
}

class ChatPreview extends Span
{
    init(init) {
        super.init(init)
        const content = init.chat.last_message.content
        const text = content.text? content.text.text : content.caption
        this.children = text && typeof text.substring === 'function' && text.substring(0, 50)
    }
}

class ChatTime extends Time
{
}

class ChatNotifier extends Status
{
    static get elementAssembler() {
        return Span
    }
}

export class ChatCard extends Article
{
    init(init) {
        super.init(init)
        this.children = this.build(init)
    }

    build({ chat }) {
        const time = chat.last_message.date
        return [
            new ChatPhoto({ chat }),
            new Div([
                new ChatTitle(chat.title),
                new ChatTime(moment(time * 1000).format('H:mm'))
            ]),
            new Div([
                new ChatPreview({ chat }),
                !!chat.unread_count && new ChatNotifier(chat.unread_count)
            ])
        ]
    }
}
