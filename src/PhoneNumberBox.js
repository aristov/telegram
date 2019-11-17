import { Input } from 'htmlmodule/lib'
import { TextBox } from './TextBox'
import './PhoneNumberBox.css'

const REPLACE_RE = /[+\-\s.()\[\]]+/g
const TEST_RE = /^\d{10,20}$/

export class PhoneNumberBox extends TextBox
{
    buildEdit(init) {
        return new Input({
            type : 'tel',
            onchange : event => this.onChange(event)
        })
    }

    onFocusIn(event) {
        super.onFocusIn(event)
        this.invalid = false
    }

    onFocusOut(event) {
        super.onFocusOut(event)
        this.checkValidity()
    }

    onChange(event) {
        this.checkValidity()
    }

    checkValidity() {
        const value = this.value
        if(value && !TEST_RE.test(value.replace(REPLACE_RE, ''))) {
            this.invalid = true
        }
    }
}
