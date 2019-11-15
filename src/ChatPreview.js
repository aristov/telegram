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
            case 'messageChatChangeTitle' :
                return new ChatPreviewInfo('Channel name changed to ' + content.title)
            case 'messageChatChangePhoto' :
                return new ChatPreviewInfo('Channel photo changed')
            case 'messagePhoto' :
                return [
                    new ChatPreviewInfo(['Photo', content.caption.text && ', ']),
                    content.caption.text
                ]
            case 'messageAnimation' :
                return [
                    new ChatPreviewInfo(['Gif', content.caption.text && ', ']),
                    content.caption.text
                ]
            case 'messageCall' :
                const callTitle = content.discard_reason['@type'] === 'callDiscardReasonMissed'?
                    'Missed call' :
                    message.sender_user_id === api.options.my_id?
                        'Outgoing call' :
                        'Incoming call'
                const duration = content.duration
                const minutes = duration / 60 | 0
                const seconds = duration % 60
                return new ChatPreviewInfo([
                    callTitle,
                    !!duration && [
                        ' (',
                        !!minutes && minutes + ' min',
                        (!!minutes || !!seconds) && ' ',
                        !!seconds && seconds + ' s',
                        ')'
                    ]
                ])
            case 'messageContactRegistered' :
                const title = chat.title || 'Deleted Account'
                return new ChatPreviewInfo(title + ' joined Telegram')
            case 'messageChatDeleteMember' :
                return Promise.all([
                    api.send('getUser', { user_id : message.sender_user_id }),
                    api.send('getUser', { user_id : content.user_id })
                ]).then(([sender, user]) => {
                    return new ChatPreviewInfo([
                        sender.first_name,
                        sender.last_name,
                        'removed',
                        user.first_name,
                        user.last_name
                    ].filter(Boolean).join(' '))
                })
            case 'messageSupergroupChatCreate':
                return new ChatPreviewInfo('You joined this channel')
            case 'messageVideo':
                return new ChatPreviewInfo('Album')
            case 'messageText':
                const user_id = message.sender_user_id
                if(chat.id !== 777000 && user_id) {
                    return user_id === api.options.my_id?
                        [
                            new ChatPreviewInfo('You: '),
                            content.text.text
                        ] :
                        chat.type['@type'] === 'chatTypePrivate'?
                            content.text.text :
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

    get children() {
        return super.children
    }
}

class ChatPreviewInfo extends Span
{
}
