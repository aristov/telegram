import './lib/Role.debug'
import { HTMLDetails } from './lib'
import { Pre } from './lib'
import { Summary } from './lib'
// import { api } from './api'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'

// window.api = api

const build = MessageContent.prototype.build

MessageContent.prototype.build = function(init) {
    const bubble = build.call(this, init)
    bubble.append(new FormattedText([
        new HTMLDetails([
            new Summary('content'),
            new Pre(JSON.stringify(init.content, null, 2)),
        ]),
        new HTMLDetails([
            new Summary('message'),
            new Pre(JSON.stringify(init.message, null, 2)),
        ])
    ]))
    return bubble
}
