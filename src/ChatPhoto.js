import { Img } from 'ariamodule'
import { Span } from 'htmlmodule'
import './ChatPhoto.css'

export class ChatPhoto extends Img
{
    init(init) {
        super.init(init)
        this.app.on('readFile', event => {
            const photo = this.chat.photo
            if(photo && event.detail.file.id === photo.small.id) {
                this.src = URL.createObjectURL(event.detail.data)
            }
        }, this)
    }

    set chat(chat) {
        const title = chat.title
        this.textContent = title? title.charAt(0).toUpperCase() : '?'
        this._chat = chat
    }

    get chat() {
        return this._chat
    }

    set src(src) {
        this.textContent = ''
        this.style.backgroundImage = `url(${ src })`
    }

    get src() {
        return this.style.backgroundImage.replace(/^url\("(.+)"\)$/, '$1')
    }

    static get elementAssembler() {
        return Span
    }
}
