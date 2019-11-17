import { Button } from './Button'
import './SubmitButton.css'

export class SubmitButton extends Button
{
    activate() {
        this.emit('submit', { bubbles : true, cancelable : true })
    }

    onKeyDown(event) {
        if(event.key === 'Enter') {
            event.stopPropagation()
        }
        super.onKeyDown(event)
    }
}
