import { RoleImg as Img } from './lib/RoleImg'
import './TelegramLogo.css'

export class TelegramLogo extends Img
{
    init(init) {
        super.init(init)
        // this.src = '/TelegramLogo.png'
        this.label = 'Telegram'
    }
}
