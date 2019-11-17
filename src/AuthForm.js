import { Form } from 'ariamodule/lib'
import './AuthForm.css'

export class AuthForm extends Form
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
        this.on('submit', this.onSubmit)
    }

    build(init) {
        void null
    }

    onSubmit(event) {
        console.log(event)
    }

    onError(error) {
        console.error(Error(error.message))
    }
}
