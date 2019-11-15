import { Article } from 'ariamodule/lib'
import './MessageCard.css'

export class MessageCard extends Article
{
    init(init) {
        super.init(init)
        const text = init.message.content.text
        this.innerHTML = text && text.text && text.text.replace(/\n/g, '<br>')
    }
}
