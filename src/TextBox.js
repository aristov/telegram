import { RoleTextBox } from 'ariamodule/lib/RoleTextBox'
import { HTMLSpan } from 'htmlmodule/lib/HTMLSpan'
import './TextBox.css'

class Box extends HTMLSpan {}
class Edit extends HTMLSpan {}
class Placeholder extends HTMLSpan {}

class TextBoxEdit extends Edit
{
    init(init) {
        super.init(init)
        this._pointerFocus = false
        this.tabIndex = 0,
        this.contentEditable = 'true'
        this.on('focus', this.onFocus)
        this.on('mousedown', this.onMouseDown)
        this.on('paste', this.onPaste)
    }

    /**
     * @param {FocusEvent} event
     */
    onFocus(event) {
        if(this._pointerFocus) {
            this._pointerFocus = false
        }
        // else getSelection().selectAllChildren(this.node)
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

    set disabled(disabled) {
        this._disabled = disabled
        this.contentEditable = String(!disabled)
    }

    get disabled() {
        return this._disabled
    }

    set readOnly(readOnly) {
        this._readOnly = readOnly
        this.contentEditable = String(!readOnly)
    }

    get readOnly() {
        return this._readOnly
    }

    set value(value) {
        this.innerHTML = value.replace(/\s/g, '&nbsp;')
    }

    get value() {
        return this.textContent.replace(/\s/g, ' ')
    }
}

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
