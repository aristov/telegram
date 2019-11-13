import { RoleArticle } from 'ariamodule/lib'
import { Span } from 'htmlmodule/lib'
import { ChatPhoto } from './ChatPhoto'
import './ChatCard.css'

export class ChatCard extends RoleArticle
{
    init(init) {
        super.init(init)
        this.children = [
            new ChatPhoto({ chat : init.chat }),
            new Span(init.chat.title)
        ]
    }
}
