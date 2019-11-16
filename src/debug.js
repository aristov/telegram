import 'ariamodule/lib/debug'
import { Details, Pre, Summary } from 'htmlmodule/lib'
import { api } from './api'
import { MessageContent } from './MessageContent'

window.api = api

MessageContent.prototype.build = function({ message, content }) {
    return [
        new Pre(JSON.stringify(content, null, 2)),
        new Details([
            new Summary('message'),
            new Pre(JSON.stringify(message, null, 2)),
        ])
    ]
}
