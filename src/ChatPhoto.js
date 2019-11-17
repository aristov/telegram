import { RoleImg as Img } from './lib'
import { Span } from './lib'
import { api } from './api'
import { TdFile } from './TdFile'
import savedmessages_svg from './icons/savedmessages_svg.svg'
import './ChatPhoto.css'

export class ChatPhoto extends Img
{
    init(init) {
        super.init(init)
        this.build(init)
    }

    build({ chat }) {
        if(chat.id === api.options.my_id) {
            this.innerHTML = savedmessages_svg
            return
        }
        const { title, photo } = chat
        this.textContent = title? title.charAt(0).toUpperCase() : 'DA'
        if(photo) {
            TdFile.getFileUrl(photo.small).then(src => this.src = src)
        }
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
