import { Span } from 'htmlmodule/lib'
import { api } from './api'

export class ChatTitle extends Span
{
    init(init) {
        super.init(init)
        this.children = this.build(init)
    }

    build({ chat }) {
        return chat.id === api.options.my_id?
            'Saved Messages' :
            chat.title || 'Deleted Account'
    }
}
