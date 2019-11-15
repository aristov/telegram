import { Img, Pre } from 'htmlmodule'
import { api } from './api'
import { Content } from './Content'

export class MessageContent extends Content
{
}

class MessagePhoto extends Img
{
    init(init) {
        super.init(init)
        api.getFileSrc(init.photo.sizes[1].photo).then(src => this.src = src)
    }
}

export default {
    messageText : content => {
        return new MessageContent({
            innerHTML : content.text.text.replace(/\n/g, '<br>')
        })
    },
    messageChatChangeTitle(content) {
        return new MessageContent({
            children : 'Channel name changed to ' + content.title
        })
    },
    messageChatChangePhoto(content) {
        return new MessageContent({
            children : 'Channel photo changed'
        })
    },
    messagePhoto(content) {
        return new MessageContent({
            children : new MessagePhoto({ photo : content.photo })
        })
    },
    messageAnimation(content) {
        return new MessageContent({
            children : new Pre(JSON.stringify(content, null, 2))
        })
    },
    messageCall(content) {
        return new MessageContent({
            children : new Pre(JSON.stringify(content, null, 2))
        })
    },
    messageContactRegistered(content) {
        return new MessageContent({
            children : new Pre(JSON.stringify(content, null, 2))
        })
    },
    messageChatDeleteMember(content) {
        return new MessageContent({
            children : new Pre(JSON.stringify(content, null, 2))
        })
    },
    messageBasicGroupChatCreate(content) {
        return new MessageContent({
            children : new Pre(JSON.stringify(content, null, 2))
        })
    },
    messageSupergroupChatCreate(content) {
        return new MessageContent({
            children : new Pre(JSON.stringify(content, null, 2))
        })
    },
    messageVideo(content) {
        return new MessageContent({
            children : new Pre(JSON.stringify(content, null, 2))
        })
    }
}
