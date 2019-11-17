import { Form } from 'ariamodule/lib'
import './AuthForm.css'

export class AuthForm extends Form
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
        this.on('submit', console.log)
    }
}
