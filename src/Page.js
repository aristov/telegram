import { Body } from './lib/HTMLBody'
import { CoverProgress } from './CoverProgress'
import './Page.css'

export class Page extends Body
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
    }

    build(init) {
        return new CoverProgress
    }
}
