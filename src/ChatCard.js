import { Article } from 'ariamodule/lib'
import { ChatNotifier } from './ChatNotifier'
import { ChatPhoto } from './ChatPhoto'
import { ChatPreview } from './ChatPreview'
import { ChatTime } from './ChatTime'
import { ChatTitle } from './ChatTitle'
import { Inner } from './Inner'
import './ChatCard.css'

export class ChatCard extends Article
{
    init(init) {
        super.init(init)
        this.children = this.build(init)
    }

    build({ chat }) {
        return [
            new ChatPhoto({ chat }),
            new Inner([
                new ChatTitle(chat.title),
                new ChatTime({ chat })
            ]),
            new Inner([
                new ChatPreview({ chat }),
                !!chat.unread_count && new ChatNotifier({ chat })
            ])
        ]
    }
}
