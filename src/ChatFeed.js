import { Feed } from 'ariamodule/lib'
import { api } from './api'
import { ChatCard } from './ChatCard'
import { CoverProgress } from './CoverProgress'
import { Progress } from './Progress'
import './ChatFeed.css'

const LIMIT = 20

export class ChatFeed extends Feed
{
    init(init) {
        super.init(init)
        this.loadChats()
        api.on('updateNewChat', this.onUpdateNewChat.bind(this))
        api.on('updateChatOrder', this.onUpdateChatOrder.bind(this))
        api.on('updateChatLastMessage', this.onUpdateChatLastMessage.bind(this))
    }

    async onUpdateChatLastMessage(event) {
        const { chat_id } = event.detail
        const card = this.getCardByChatId(chat_id)
        if(card) {
            card.chat = await this.getChat(chat_id)
            this.insertCard(card)
        }
    }

    async onUpdateChatOrder(event) {
        const { chat_id, order } = event.detail
        const card = this.getCardByChatId(chat_id)
        if(card) {
            card.chat.order = order
            this.insertCard(card)
        }
        else this.addChat(await this.getChat(chat_id))
    }

    async onUpdateNewChat(event) {
        const { chat } = event.detail
        const card = this.getCardByChatId(chat.id)
        if(!card) {
            this.addChat(await this.getChat(chat.id))
        }
    }

    async getChat(chat_id) {
        return await api.send('getChat', { chat_id })
    }

    getCardByChatId(chat_id) {
        return this.find(ChatCard, ({ chat : { id } }) => id === chat_id)
    }

    addChat(chat) {
        if(!this.chatIds.includes(chat.id)) {
            this.insertCard(new ChatCard({ chat }))
        }
    }

    insertCard(card) {
        let item, nextItem
        for(item of this.articles) {
            if(card.chat.order > item.chat.order) {
                nextItem = item
                break
            }
        }
        if(nextItem) {
            nextItem.before(card)
        }
        else item && item.after(card)
    }

    onScroll(event) {
        const rect = this._progress.node.getBoundingClientRect()
        if(rect.top < innerHeight) {
            this.loadMoreChats()
        }
    }

    loadChats() {
        this.children = new CoverProgress
        this.busy = true
        this.getChats()
            .then(chats => {
                this.children = [
                    chats.map(chat => new ChatCard({ chat })),
                    this._progress = new FeedProgress
                ]
                this.busy = false
                this.on('scroll', this.onScroll)
            })
            .catch(error => this.children = error)
    }

    loadMoreChats() {
        this.un('scroll', this.onScroll)
        this.busy = true
        this.getChats()
            .then(chats => {
                if(chats.length) {
                    this._progress.before(chats.map(chat => new ChatCard({ chat })))
                    this.busy = false
                    this.on('scroll', this.onScroll)
                }
                else {
                    this._progress.remove()
                    this._progress = null
                }
            })
            .catch(error => this._progress.replaceWith(error))
    }

    async getChats() {
        const { chat_ids } = await api.send('getChats', this.query)
        return await Promise.all(chat_ids.map(chat_id => {
            return this.getChat(chat_id)
        }))
    }
    
    get chatIds() {
        return this.articles.map(({ chat }) => chat.id)
    }

    get query() {
        const cards = this.articles
        const lastCard = cards[cards.length - 1]
        return lastCard? {
            offset_order : lastCard.chat.order,
            offset_chat_id : lastCard.chat.id,
            limit : LIMIT
        } : {
            offset_order : '9223372036854775807',
            limit : LIMIT
        }
    }
}

class FeedProgress extends Progress
{
}
