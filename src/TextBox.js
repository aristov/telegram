import { RoleTextBox } from './lib'
import { Span } from 'htmlmodule/lib/HTMLSpan'
import { TextBoxEdit } from './TextBoxEdit'
import './TextBox.css'

/**
 * @summary A type of input that allows free-form text as its value.
 * @see https://www.w3.org/TR/wai-aria-1.1/#textbox
 */
export class TextBox extends RoleTextBox {
    /**
     * @param {{}} init
     */
    init(init) {
        super.init(init)
        this._placeholder = null
        this.children = this.build(init)
        this.on('focusin', this.onFocusIn)
        this.on('focusout', this.onFocusOut)
        this.on('click', this.onClick)
        this.on('input', this.onInput)
        this.on('keydown', this.onKeyDown)
    }

    build(init) {
        return this._box = new Box(this._edit = this.buildEdit(init))
    }

    buildEdit(init) {
        return new TextBoxEdit
    }

    /**
     * Focus the input
     */
    focus() {
        this._edit.focus()
    }

    /**
     * @param {FocusEvent} event
     */
    onFocusIn(event) {
        this.classList.add('focus')
    }

    /**
     * @param {FocusEvent} event
     */
    onFocusOut(event) {
        this.classList.remove('focus')
    }

    /**
     * @param {MouseEvent} event
     */
    onClick(event) {
        if(this.disabled) {
            event.stopImmediatePropagation()
            return
        }
        const items = [this._box, ...this.labelledBy]
        if(items.some(item => item.contains(event.target))) {
            this.focus()
        }
    }

    /**
     * @param {InputEvent} event
     */
    onInput(event) {
        const value = this._edit.value
        if(value) {
            this.dataset.value = value
        }
        else delete this.dataset.value
        this.invalid = false
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        if(event.key === 'Enter') {
            this.onEnterKeyDown(event)
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onEnterKeyDown(event) {
        if(this.multiLine) return
        event.preventDefault()
        if(this.reportValidity()) {
            this.emit('submit', { bubbles : true, cancelable : true })
        }
    }

    checkValidity() {
        return !this.required || !!this.value
    }

    reportValidity() {
        const result = this.checkValidity()
        if(!result) {
            this.invalid = true
        }
        return result
    }

    /**
     * @param {boolean} disabled
     */
    set disabled(disabled) {
        super.disabled = this._edit.disabled = disabled
    }

    /**
     * @returns {boolean}
     */
    get disabled() {
        return super.disabled
    }

    /**
     * @param {string} name
     */
    set name(name) {
        this.dataset.name = name
    }

    /**
     * @return {string}
     */
    get name() {
        return this.dataset.name
    }

    /**
     * @param {string} placeholder
     */
    set placeholder(placeholder) {
        super.placeholder = placeholder
        if(this._placeholder) {
            this._placeholder.textContent = placeholder
        }
        else this._edit.before(this._placeholder = new Placeholder(placeholder))
    }

    /**
     * @returns {string}
     */
    get placeholder() {
        return super.placeholder
    }

    /**
     * @param {boolean} readOnly
     */
    set readOnly(readOnly) {
        super.readOnly = this._edit.readOnly = readOnly
    }

    /**
     * @returns {boolean}
     */
    get readOnly() {
        return super.readOnly
    }

    /**
     * @param {string} value
     */
    set value(value) {
        if(this._edit.value = value) {
            this.dataset.value = value.replace(/\s/g, ' ')
        }
        else delete this.dataset.value
    }

    /**
     * @returns {string}
     */
    get value() {
        return this.dataset.value || ''
    }
}

class Box extends Span {}
class Placeholder extends Span {}
