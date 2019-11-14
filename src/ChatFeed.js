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
                else this._progress.remove()
            })
            .catch(error => this._progress.replaceWith(error))
    }

    async getChats() {
        const { chat_ids } = await api.send('getChats', this.query)
        return await Promise.all(chat_ids.map(chat_id => {
            return api.send('getChat', { chat_id })
        }))
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
