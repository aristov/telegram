import moment from './moment'
import { Time } from './lib'
import { Separator } from './lib'
import { Notice } from './Notice'

export class HistoryDate extends Separator
{
    init(init) {
        super.init(init)
        this.children = init.date.isSame(moment(), 'year')?
            new Notice(new Time(init.date.format('MMMM D'))) :
            new Notice(new Time(init.date.format('MMMM D, YYYY')))
    }
}
