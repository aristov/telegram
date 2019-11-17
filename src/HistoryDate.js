import moment from './moment'
import { Time } from './lib/HTMLTime'
import { Separator } from './lib/RoleSeparator'
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
