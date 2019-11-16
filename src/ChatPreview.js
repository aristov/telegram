import moment from './moment'
import { Span, Time } from 'htmlmodule/lib'
import { api } from './api'
import { TdUser } from './TdUser'

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
                const durationTime = moment.duration(content.duration, 'seconds').humanize()
                return new ChatPreviewInfo([
                    message.sender_user_id === api.options.my_id?
                        'Outgoing call' :
                        'Incoming call',
                    !!content.duration && [', ', new Time(durationTime)]
                ])
            case 'messageContactRegistered' :
                const title = chat.title || 'Deleted Account'
                return new ChatPreviewInfo(title + ' joined Telegram')
            case 'messageChatDeleteMember' :
                return Promise.all([
                    api.send('getUser', { user_id : message.sender_user_id }),
                    api.send('getUser', { user_id : content.user_id })
                ]).then(([sender, user]) => new ChatPreviewInfo([
                    TdUser.getFullName(sender),
                    ' removed ',
                    TdUser.getFullName(user)
                ]))
            case 'messageBasicGroupChatCreate':
                return api.send('getUser', { user_id : content.member_user_ids[0] })
                    .then(user => {
                        return new ChatPreviewInfo([
                            user.first_name,
                            user.last_name,
                            'created the group',
                            `«${ chat.title }»`
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
            case 'messageDocument':
                return new ChatPreviewInfo(content.document.file_name)
        }
    }
}

class ChatPreviewInfo extends Span
{
}
