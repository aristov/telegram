import { Status } from 'ariamodule/lib'
import { Span } from 'htmlmodule/lib'

export class ChatNotifier extends Status
{
    init(init) {
        super.init(init)
        this.children = init.chat.unread_count
        if(init.chat.notification_settings.mute_for) {
            this.classList.add('muted')
        }
    }

    static get elementAssembler() {
        return Span
    }
}
