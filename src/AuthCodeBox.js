import { Input } from 'htmlmodule/lib'
import { InputBox } from './InputBox'

const CODE_LENGTH = 5
const RE = new RegExp(`^\\d{${ CODE_LENGTH }}$`)

export class AuthCodeBox extends InputBox
{
    buildEdit(init) {
        return new Input({ type : 'number' })
    }

    onKeyDown(event) {
        super.onKeyDown(event)
        if(/^[+\-]$/.test(event.key)) {
            event.preventDefault()
        }
        if(/(ArrowUp|ArrowDown)/.test(event.key)) {
            event.preventDefault()
        }
        if(/^\d$/.test(event.key) && this.value.length === CODE_LENGTH) {
            event.preventDefault()
        }
    }

    onInput(event) {
        super.onInput(event)
        if(RE.test(this.value)) {
            this.emit('submit', { bubbles : true, cancelable : true })
        }
    }

    set invalid(invalid) {
        super.invalid = invalid
        const label = this.labelledBy[0]
        if(label) {
            label.textContent = invalid? 'Invalid Code' : 'Code'
        }
    }

    get invalid() {
        return super.invalid
    }
}
