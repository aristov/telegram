import moment from './moment'
import { Time } from 'htmlmodule/lib'

export class ChatTime extends Time
{
    init(init) {
        super.init(init)
        this.children = this.build(init)
    }

    build(init) {
        const now = moment()
        const dayBefore = moment().subtract(1, 'day')
        const time = moment(init.chat.last_message.date * 1000)
        const format = time.isAfter(dayBefore, 'day')?
            'H:mm' :
            time.isSame(now, 'week')? 'ddd' : 'D.MM.YY'
        return time.format(format)
    }
}
