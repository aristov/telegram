import moment from './moment'
import { Feed } from './lib'
import { api } from './api'
import { HistoryDate } from './HistoryDate'
import { MessageChannelPost } from './MessageChannelPost'
import { MessageIncoming } from './MessageIncoming'
import { MessageOutgoing } from './MessageOutgoing'
import './ChatHistory.css'

const LIMIT = 20

export class ChatHistory extends Feed
{
    init(init) {
        super.init(init)
        this._scrollDelta = 0
        this.on('scroll', this.onScroll)
        this.on('load', this.onLoad, { capture : true })
    }

    onScroll(event) {
        this.saveScrollDelta()
        if(!this.busy) {
            this.checkScrollPosition()
        }
    }

    onLoad(event) {
        this.resetScroll()
    }

    checkScrollPosition() {
        const { offsetTop, offsetHeight } = this.articles[0].node
        if(offsetTop + offsetHeight > this.node.scrollTop) {
            this.loadMessages()
        }
    }

    loadMessages() {
        if(this.busy) return
        this.busy = true
        api.send('getChatHistory', this.query).then(({ messages }) => {
            this.busy = false
            if(messages.length) {
                this.addMessages(messages)
                this.checkScrollPosition()
            }
        })
    }

    addMessages(messages) {
        const node = this.node
        this.saveScrollDelta()
        const article = this.articles[0]
        let date = moment.unix(article? article.message.date : messages[0].date)
        for(const message of messages) {
            if(!date.isSame(moment.unix(message.date), 'day')) {
                this.prepend(new HistoryDate({ date }))
                date = moment.unix(message.date)
            }
            const messageType = this.getMessageType(message)
            this.prepend(new messageType({ chat : this.chat, message }))
        }
        node.scrollTo(0, node.scrollHeight - this._scrollDelta)
    }

    getMessageType(message) {
        if(message.is_channel_post) {
            return MessageChannelPost
        }
        return message.is_outgoing? MessageOutgoing : MessageIncoming
    }

    saveScrollDelta() {
        const node = this.node
        this._scrollDelta = node.scrollHeight - node.scrollTop
    }

    resetScroll() {
        const node = this.node
        node.scrollTo(0, node.scrollHeight - this._scrollDelta)
        this.saveScrollDelta()
    }

    get query() {
        const article = this.articles[0]
        return {
            chat_id : this.chat.id,
            from_message_id : article?
                article.message.id :
                this.chat.last_message.id,
            offset : 0,
            limit : LIMIT
        }
    }
}
