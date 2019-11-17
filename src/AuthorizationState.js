import { Form } from 'ariamodule/lib'
import './AuthorizationState.css'

export class AuthorizationState extends Form
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
        this.on('submit', console.log)
    }
}
