import { Span } from './lib/HTMLSpan'

class Edit extends Span
{
}

export class TextBoxEdit extends Edit
{
    init(init) {
        super.init(init)
        this._pointerFocus = false
        this.tabIndex = 0
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
