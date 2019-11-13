import { Img } from 'ariamodule'
import { Span } from 'htmlmodule'
import './UserPic.css'

export class UserPic extends Img {
    set data(data) {
        const { photo, name } = data || {}
        if(photo) {
            this.src = photo
        }
        else this.textContent = name? name.charAt(0).toUpperCase() : '?'
        this._data = data
    }

    get data() {
        return this._data
    }

    set src(src) {
        this.style.backgroundImage = `url(${ src })`
    }

    get src() {
        return this.style.backgroundImage.replace(/^url\("(.+)"\)$/, '$1')
    }

    static get elementAssembler() {
        return Span
    }
}
