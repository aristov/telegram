import { Expanded, Feed } from 'ariamodule/lib'
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
        this.on('focusin', this.onFocusIn)
        this.on('focusout', this.onFocusOut)
        this.on(Expanded, this.onExpanded, { subtree : true })
        // api.on('updateNewChat', this.onUpdateNewChat.bind(this))
        api.on('updateChatOrder', this.onUpdateChatOrder.bind(this))
        api.on('updateChatLastMessage', this.onUpdateChatLastMessage.bind(this))
    }

    resetTabIndex() {
        const articles = this.articles
        if(!articles.length) return
        let card
        for(const article of this.articles) {
            if(article.tabIndex = article.expanded? 0 : -1) continue
            card = article
        }
        if(!card) {
            articles[0].tabIndex = 0
        }
    }

    onFocusIn(event) {
        this.classList.add('focus')
    }

    onFocusOut(event) {
        this.classList.remove('focus')
    }

    onExpanded(record) {
        const card = ChatCard.getRoleOf(record.target)
        if(!card.expanded) return
        for(const article of this.articles) {
            if(article !== card) {
                article.expanded = false
            }
        }
        this.resetTabIndex()
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
        let article, next
        for(article of this.articles) {
            if(card.chat.order > article.chat.order) {
                next = article
                break
            }
        }
        if(next) {
            next.before(card)
        }
        else article && article.after(card)
        this.resetTabIndex()
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
                this.resetTabIndex()
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
