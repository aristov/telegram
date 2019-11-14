import { Img } from 'ariamodule'
import { Span } from 'htmlmodule'
import { api } from './api'
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
        const photo = chat.photo
        const title = chat.title
        this.textContent = title? title.charAt(0).toUpperCase() : 'DA'
        if(photo) {
            this.getPhoto(photo)
            api.on('updateFile', this.onUpdateFile.bind(this))
        }
    }

    getPhoto(photo) {
        const small = photo.small
        const local = small.local
        const file_id = small.id
        if(local.is_downloading_completed) {
            this.readFile({ file_id })
        }
        else if(!local.is_downloading_active && local.can_be_downloaded) {
            api.send('downloadFile', { file_id, priority : 1 })
        }
    }

    onUpdateFile(event) {
        const file = event.detail.file
        if(file.id !== this.chat.photo.small.id) return
        if(!file.local.is_downloading_completed) return
        this.readFile({ file_id : file.id })
    }

    readFile({ file_id }) {
        api.send('readFile', { file_id })
           .then(response => {
               this.src = URL.createObjectURL(response.data)
           })
           .catch(console.error)
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
