import { Region } from './lib/RoleRegion'
import { Div } from './lib/HTMLDiv'
import { api } from './api'
import { ChatPhoto } from './ChatPhoto'
import { ChatStatus } from './ChatStatus'
import { ChatTitle } from './ChatTitle'
import './ChatHead.css'

export class ChatHead extends Region
{
    init(init) {
        super.init(init)
        this.children = this.build(init)
    }

    build({ chat }) {
        return [
            new ChatPhoto({ chat }),
            new ChatHeadInfo([
                new ChatTitle({ chat }),
                chat.id !== api.options.my_id && new ChatStatus({ chat })
            ])
        ]
    }
}

class ChatHeadInfo extends Div
{
}
