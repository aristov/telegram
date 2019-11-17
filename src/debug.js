import './lib/debug'
import { Details, Pre, Summary } from 'htmlmodule/lib'
// import { api } from './api'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'

// window.api = api

const build = MessageContent.prototype.build

MessageContent.prototype.build = function(init) {
    const bubble = build.call(this, init)
    bubble.append(new FormattedText([
        new Details([
            new Summary('content'),
            new Pre(JSON.stringify(init.content, null, 2)),
        ]),
        new Details([
            new Summary('message'),
            new Pre(JSON.stringify(init.message, null, 2)),
        ])
    ]))
    return bubble
}
