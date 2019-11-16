import { Feed } from 'ariamodule/lib'
import { api } from './api'
import { MessageCard } from './MessageCard'
import './MessageFeed.css'

const LIMIT = 20

export class MessageFeed extends Feed
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
        console.log(event)
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
        this.saveScrollDelta()
        for(const message of messages) {
            this.prepend(new MessageCard({ message }))
        }
        this.node.scrollTo(0, this.node.scrollHeight - this._scrollDelta)
    }

    saveScrollDelta() {
        this._scrollDelta = this.node.scrollHeight - this.node.scrollTop
    }

    resetScroll() {
        this.node.scrollTo(0, this.node.scrollHeight - this._scrollDelta)
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
