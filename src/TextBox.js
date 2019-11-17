import { RoleTextBox } from 'ariamodule/lib/RoleTextBox'
import { HTMLInput } from 'htmlmodule/lib/HTMLInput'
import { HTMLSpan } from 'htmlmodule/lib/HTMLSpan'
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
        this.children = [
            this._box = new Box(this._edit = new Edit({
                tabIndex : 0,
                contentEditable : true,
                onblur : event => this.onBlur(event),
                onfocus : event => this.onFocus(event),
                oninput : event => this.onInput(event),
                onkeydown : event => this.onKeyDown(event),
                onmousedown : event => this.onMouseDown(event),
                onpaste : event => this.onPaste(event)
            })),
            this._input = new HTMLInput({ type : 'hidden' })
        ]
        this._placeholder = null
        this._pointerFocus = false
        this.on('click', this.onClick)
    }

    /**
     * Focus the input
     */
    focus() {
        this._edit.focus()
    }

    /**
     * @param {MouseEvent} event
     */
    onClick(event) {
        if(this.disabled) {
            event.stopImmediatePropagation()
        }
        else if([this._box, ...this.labelledBy].some(label => label.contains(event.target))) {
            this.focus()
        }
    }

    /**
     * @param {FocusEvent} event
     */
    onBlur(event) {
        this.classList.remove('focus')
    }

    /**
     * @param {FocusEvent} event
     */
    onFocus(event) {
        if(this._pointerFocus) {
            this._pointerFocus = false
        }
        // else getSelection().selectAllChildren(this._edit.node)
        this.classList.add('focus')
    }

    /**
     * @param {InputEvent} event
     */
    onInput(event) {
        const value = this._input.value = this._edit.textContent.replace(/\s/g, ' ')
        if(value) {
            this.dataset.value = value
        }
        else delete this.dataset.value
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
        this.multiLine || event.preventDefault()
    }

    /**
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        this._pointerFocus = true
    }

    /**
     * @param {ClipboardEvent} event
     */
    onPaste(event) {
        event.preventDefault()
        if(this.readOnly) return
        const edit = this._edit
        const textContent = edit.textContent
        const selection = getSelection()
        const { anchorOffset, focusOffset } = selection
        const startOffset = Math.min(anchorOffset, focusOffset)
        const endOffset = Math.max(anchorOffset, focusOffset)
        const beforeText = textContent.substring(0, startOffset)
        const afterText = textContent.substring(endOffset, textContent.length)
        const data = event.clipboardData.getData('text')
        this.value = beforeText + data + afterText
        selection.collapse(edit.node.firstChild, beforeText.length + data.length)
        this.emit('input', { bubbles : true })
    }

    /**
     * @param {boolean} disabled
     */
    set disabled(disabled) {
        super.disabled = disabled
        this._edit.contentEditable = !disabled
        this._input.parentNode = disabled? null : this
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
        this._input.name = name
    }

    /**
     * @return {string}
     */
    get name() {
        return this._input.name
    }

    /**
     * @param {string} placeholder
     */
    set placeholder(placeholder) {
        super.placeholder = placeholder
        if(this._placeholder) {
            this._placeholder.textContent = placeholder
        }
        else {
            this._placeholder = new Placeholder({
                nextSibling : this._edit,
                textContent : placeholder
            })
        }
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
        super.readOnly = readOnly
        this._edit.contentEditable = !readOnly
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
        if(value) {
            this._edit.innerHTML = value.replace(/\s/g, '&nbsp;')
            this.dataset.value = this._input.value = value.replace(/\s/g, ' ')
        }
        else {
            this._edit.innerHTML = ''
            this._input.value = ''
            delete this.dataset.value
        }
    }

    /**
     * @returns {string}
     */
    get value() {
        return this.dataset.value || ''
    }
}

class Box extends HTMLSpan {}
class Edit extends HTMLSpan {}
class Placeholder extends HTMLSpan {}

TextBox.Box = Box
TextBox.Edit = Edit
TextBox.Placeholder = Placeholder
