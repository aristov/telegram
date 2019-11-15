import moment from './moment'
import { Status } from 'ariamodule/lib'
import { api } from './api'

export class ChatStatus extends Status
{
    init(init) {
        super.init(init)
        this.build(init)
    }

    build({ chat }) {
        this.innerHTML = '&nbsp;'
        if(chat.id === 777000) {
            this.children = 'service notifications'
            return
        }
        switch(chat.type['@type']) {
            case 'chatTypeBasicGroup' :
                api.send('getBasicGroupFullInfo', {
                    basic_group_id : chat.type.basic_group_id
                }).then(group => {
                    if(!group.creator_user_id) {
                        this.children = 'group is inaccessible'
                        return
                    }
                    const count = group.members.length
                    const formatter = new Intl.NumberFormat(document.documentElement.lang, {
                        useGrouping : count > 9999
                    })
                    this.children = formatter.format(count) + ' members'
                })
                break
            case 'chatTypeSupergroup' :
                api.send('getSupergroupFullInfo', {
                    supergroup_id : chat.type.supergroup_id
                }).then(supergroup => {
                    const count = supergroup.member_count
                    const formatter = new Intl.NumberFormat(document.documentElement.lang, {
                        useGrouping : count > 9999
                    })
                    this.children = [
                        formatter.format(count),
                        chat.is_channel? ' subscribers' : ' members'
                ]
                })
                break
            case 'chatTypePrivate' :
                api.send('getUser', {
                    user_id : chat.type.user_id
                }).then(user => {
                    if(user.type['@type'] === 'userTypeBot') {
                        this.children = 'bot'
                        return
                    }
                    switch(user.status['@type']) {
                        case 'userStatusOnline' :
                            this.children = 'online'
                            this.classList.add('online')
                            break
                        case 'userStatusRecently' :
                            this.children = 'last seen recently'
                            break
                        case 'userStatusLastWeek' :
                            this.children = 'last seen last week'
                            break
                        case 'userStatusLastMonth' :
                            this.children = 'last seen last month'
                            break
                        case 'userStatusEmpty' :
                            this.children = 'last seen a long time ago'
                            break
                        case 'userStatusOffline' :
                            this.children = [
                                'last seen ',
                                moment(user.status.was_online * 1000).fromNow()
                            ]
                            break
                    }
                })
        }
    }
}
