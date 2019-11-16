import { Body } from 'htmlmodule/lib'
import { CoverProgress } from './CoverProgress'
import './Page.css'

export class Page extends Body
{
    init(init) {
        super.init(init)
        this.setProperty('lastChild', this.build(init))
    }

    build(init) {
        return new CoverProgress
    }
}
