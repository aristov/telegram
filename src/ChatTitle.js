import { Span } from 'htmlmodule/lib'

export class ChatTitle extends Span
{
    init(init) {
        super.init(init)
        this.children = init.chat.title || 'Deleted Account'
    }
}
