import { Input } from 'htmlmodule/lib'
import { InputBox } from './InputBox'

const REPLACE_RE = /[+\-\s.()\[\]]+/g
const TEST_RE = /^\d{10,20}$/

export class PhoneNumberBox extends InputBox
{
    buildEdit(init) {
        return new Input({
            type : 'tel',
            onchange : event => this.onChange(event)
        })
    }

    onFocusOut(event) {
        super.onFocusOut(event)
        this.checkValidity()
    }

    onChange(event) {
        this.reportValidity()
    }

    checkValidity() {
        if(!super.checkValidity()) {
            return false
        }
        const value = this.value
        return !!value && TEST_RE.test(value.replace(REPLACE_RE, ''))
    }

    set invalid(invalid) {
        super.invalid = invalid
        const label = this.labelledBy[0]
        if(label) {
            label.textContent = invalid?
                'Invalid Phone Number' :
                'Phone Number'
        }
    }

    get invalid() {
        return super.invalid
    }
}
