import { HTMLInput as Input } from './lib'
import { TextBox } from './TextBox'
import './InputBox.css'

export class InputBox extends TextBox
{
    buildEdit(init) {
        return new Input
    }
}
