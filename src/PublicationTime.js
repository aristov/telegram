import moment from './moment'
import { Time } from 'htmlmodule/lib'
import './PublicationTime.css'

export class PublicationTime extends Time
{
    init(init) {
        super.init(init)
        this.children = moment.unix(init.message.date).format('H:mm')
    }
}
