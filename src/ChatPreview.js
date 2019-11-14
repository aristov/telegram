import { Span } from 'htmlmodule/lib'
import { api } from './api'

export class ChatPreview extends Span
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
    }

    build({ chat }) {
        const message = chat.last_message
        const content = message.content
        switch(content['@type']) {
            case 'messagePhoto' :
                return [new ChatPreviewInfo('Photo, '), content.caption.text]
            case 'messageAnimation' :
                return [new ChatPreviewInfo('Gif, '), content.caption.text]
            case 'messageCall' :
                const minutes = content.duration / 60 | 0
                const seconds = content.duration % 60
                return new ChatPreviewInfo([
                    'Call (',
                    minutes? minutes + ' min' : null,
                    seconds? seconds + ' s' : null,
                    ')'
                ])
            case 'messageContactRegistered' :
                return new ChatPreviewInfo(chat.title + ' joined Telegram')
            case 'messageText':
                const user_id = message.sender_user_id
                if(chat.id !== 777000 && user_id) {
                    return user_id === api.options.my_id?
                        [
                            new ChatPreviewInfo('You: '),
                            content.text.text
                        ] :
                        api.send('getUser', { user_id }).then(user => [
                            new ChatPreviewInfo(user.first_name + ': '),
                            content.text.text
                        ])
                }
                else return content.text.text
        }
    }

    set children(children) {
        if(children instanceof Promise) {
            children
                .then(result => super.children = result)
                .catch(error => super.children = error)
        }
        else super.children = children
    }
}

class ChatPreviewInfo extends Span
{
}
