import { RoleComboBox } from 'ariamodule/lib/RoleComboBox'
import { ListBox } from './ListBox'
import { Option } from './Option'
import { Popup } from './Popup'
import { TextBox } from './TextBox'
import './ComboBox.css'

/**
 * @summary A composite widget containing a single-line textbox and another element,
 *  such as a listbox or grid, that can dynamically pop up to help the user
 *  set the value of the textbox.
 * @see https://www.w3.org/TR/wai-aria-1.1/#combobox
 */
class ComboBox extends RoleComboBox { 
    /**
     * @param {{}} init
     */
    init(init) {
        super.init(init)
        this.children = [
            this._textBox = new TextBox({
                onchange : event => event.stopPropagation(),
                oninput : event => this.onTextBoxInput(event),
                onkeydown : event => this.onTextBoxKeyDown(event),
                controls : this._listBox = new ListBox({
                    ownerElement : new Popup({ trigger : this }),
                    tabIndex : null,
                    expanded : false,
                    onchange : event => this.onListBoxChange(event),
                    onclick : event => this.onListBoxClick(event)
                })
            })
        ]
        this._textBox.on('click', this.onTextBoxClick, this)
    }

    update() {
        const { selectedOptions } = this._listBox
        if(selectedOptions.length) {
            this._textBox.value = selectedOptions.map(({ textContent }) => textContent).join()
            this.dataset.value = selectedOptions.map(({ value }) => value).join()
        }
    }

    reset() {
        this._listBox.activeDescendant = null
        this.options.forEach(option => {
            option.hidden = option.selected = false
        })
    }

    filter() {
        const value = this._textBox.value.toLowerCase()
        return this.options.filter(option => {
            const result = option.textContent.toLowerCase().includes(value)
            option.hidden = !result
            return result
        })
    }

    /**
     * Focus the widget
     */
    focus() {
        this._textBox.focus()
    }

    /**
     * @param {FocusEvent} event
     */
    onTextBoxClick(event) {
        this.expanded = true
    }

    /**
     * @param {Event} event
     */
    onTextBoxInput(event) {
        delete this.dataset.value
        if(this.autoComplete === 'list') {
            if(this._textBox.value) {
                const options = this.filter()
                if(options.length) {
                    options[0].selected = true
                }
                else this.reset()
                this.expanded = true
            }
            else this.reset()
        }
        this.errorMessage = null
    }

    /**
     * @param {KeyboardEvent} event
     */
    onTextBoxKeyDown(event) {
        const key = event.key
        switch(key) {
            case 'Enter':
                this.onEnterKeyDown(event)
                break
            case 'Escape':
                this.onEscapeKeyDown(event)
                break
            case 'Backspace':
                this.onBackspaceKeyDown(event)
                break
            default:
                if(['ArrowUp', 'ArrowDown'].includes(key)) {
                    this.onArrowKeyDown(event)
                }
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onArrowKeyDown(event) {
        event.preventDefault()
        if(this.options.length) {
            if(this.expanded) {
                this._listBox.onArrowKeyDown(event)
            }
            else this.expanded = true
        }
    }

    /**
     * @param {MouseEvent} event
     */
    onDocumentClick(event) {
        if(!this.ownerElement.contains(event.target)) {
            this.expanded = false
        }
    }

    /**
     * @param {FocusEvent} event
     */
    onDocumentFocusIn(event) {
        if(!this.contains(event.target)) {
            this.expanded = false
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onEnterKeyDown(event) {
        event.preventDefault()
        event.stopPropagation()
        if(this.expanded) {
            const value = this.value
            this.update()
            this.expanded = false
            this.errorMessage = null
            this.focus()
            this.value === value || this.emit('change', { bubbles : true })
        }
        else this.expanded = true
    }

    /**
     * @param {KeyboardEvent} event
     */
    onEscapeKeyDown(event) {
        if(this.expanded) {
            event.stopPropagation()
            this.expanded = false
        }
        else if(!this.value && this._textBox.value) {
            event.stopPropagation()
            this._textBox.value = ''
            this.reset()
        }
    }

    onBackspaceKeyDown(event) {
        if(this.value) {
            event.stopPropagation()
            this.value = ''
            this.reset()
            this.expanded = true
            this.errorMessage = null
            this.emit('change', { bubbles : true })
        }
    }

    /**
     * @param {Event} event
     */
    onListBoxChange(event) {
        event.stopPropagation()
        this._textBox.activeDescendant = this._listBox.activeDescendant
    }

    /**
     * @param {MouseEvent} event
     */
    onListBoxClick(event) {
        const value = this.value
        this.update()
        this.expanded = false
        this.focus()
        this.errorMessage = null
        this.value === value || this.emit('change', { bubbles : true })
    }

    /**
     * @param {string} autoComplete
     */
    set autoComplete(autoComplete) {
        this._textBox.autoComplete = autoComplete
    }

    /**
     * @returns {string}
     */
    get autoComplete() {
        return this._textBox.autoComplete
    }

    /**
     * @param {boolean} disabled
     */
    set disabled(disabled) {
        this._textBox.disabled = disabled
        this._listBox.disabled = disabled
        super.disabled = disabled
    }

    /**
     * @returns {boolean}
     */
    get disabled() {
        return super.disabled
    }

    /**
     * @param {Role|HTMLElementAssembler|*} errorMessage
     */
    set errorMessage(errorMessage) {
        const element = this.errorMessage
        element && element.remove()
        this.invalid = Boolean(super.errorMessage = errorMessage)
    }

    /**
     * @returns {Role|HTMLElementAssembler|*}
     */
    get errorMessage() {
        return super.errorMessage
    }

    /**
     * @param {boolean} expanded
     */
    set expanded(expanded) {
        if(expanded === this.expanded) return
        const listBox = this._listBox
        if(super.expanded = expanded) {
            const { activeDescendant, options } = listBox
            if(this.value) {
                options.forEach(option => option.hidden = false)
            }
            listBox.parentNode || this.append(listBox)
            listBox.expanded = true
            listBox.scrollTo(activeDescendant || options[0])
            this.ownerDocument.on('click', this.onDocumentClick, this)
            this.ownerDocument.on('focusin', this.onDocumentFocusIn, this)
        }
        else {
            listBox.expanded = false
            this._textBox.activeDescendant = null
            this.ownerDocument.un('click', this.onDocumentClick, this)
            this.ownerDocument.un('focusin', this.onDocumentFocusIn, this)
        }
    }

    /**
     * @returns {boolean}
     */
    get expanded() {
        return super.expanded || false
    }

    /**
     * @param {string} hasPopup
     */
    set hasPopup(hasPopup) {
        super.hasPopup = hasPopup
    }

    /**
     * @returns {string}
     */
    get hasPopup() {
        return super.hasPopup || 'listbox'
    }

    /**
     * @param {string} name
     */
    set name(name) {
        this._textBox.name = name
    }

    /**
     * @returns {string}
     */
    get name() {
        return this._textBox.name
    }

    /**
     * @param {*} options
     */
    set options(options) {
        this._listBox.options = options
    }

    /**
     * @returns {Option[]}
     */
    get options() {
        return this._listBox.options
    }

    set readOnly(readOnly) {
        // this._textBox.readOnly = readOnly
        this._listBox.readOnly = readOnly
        super.readOnly = readOnly
    }

    get readOnly() {
        return super.readOnly
    }

    /**
     * @param {boolean} required
     */
    set required(required) {
        this._textBox.required = required
    }

    /**
     * @returns {boolean}
     */
    get required() {
        return this._textBox.required
    }

    /**
     * @returns {Option[]}
     */
    get selectedOptions() {
        return this._listBox.selectedOptions
    }

    /**
     * @param {string} value
     */
    set value(value) {
        const options = this.options
        const filtered = options.filter(option => {
            return option.selected = option.value === value
        })
        this._textBox.value = filtered.map(({ textContent }) => textContent).join()
        if(value) {
            this.dataset.value = value
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

export { ComboBox, Option }
