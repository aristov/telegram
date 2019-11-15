import { Img, P } from 'htmlmodule/lib'
import { api } from './api'
import { MessageContent } from './MessageContent'
import { Notice } from './Notice'

export class MessageText extends MessageContent
{
    build({ content }) {
        return content.text.text.split('\n\n').map(chunk => {
            return new P({
                innerHTML : chunk.replace(/\n/g, '<br>')
            })
        })
    }
}

export class MessagePhoto extends MessageContent
{
    build({ photo }) {
        api.getFileSrc(photo.sizes[1].photo).then(src => {
            this.children = new Img({ src })
        })
    }
}

export class MessageChatChangeTitle extends MessageContent
{
    build({ content }) {
        return new Notice(`Channel name was changed to «${ content.title }»`)
    }
}

export class MessageChatChangePhoto extends MessageContent
{
    build({ content }) {
        return new Notice(`Channel photo changed`)
    }
}

export class MessageBasicGroupChatCreate extends MessageContent
{
    build({ content }) {
        return new Notice(`Group created`)
    }
}

export class MessageAnimation extends MessageContent {}

export class MessageCall extends MessageContent {}

export class MessageContactRegistered extends MessageContent {}

export class MessageChatDeleteMember extends MessageContent {}

export class MessageSupergroupChatCreate extends MessageContent {}

export class MessageVideo extends MessageContent {}
