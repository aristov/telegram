import { Span } from 'htmlmodule/lib'

export class ChatPreview extends Span
{
    init(init) {
        super.init(init)
        const content = init.chat.last_message.content
        const text = content.text? content.text.text : content.caption
        this.children = text && typeof text.substring === 'function' && text.substring(0, 50)
    }
}
