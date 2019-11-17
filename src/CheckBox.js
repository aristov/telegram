import { HTMLInput } from 'htmlmodule/lib/HTMLInput'
import { RoleCheckBox } from './lib'
import CheckBoxSvg from './CheckBox.svg'
import './CheckBox.css'

/**
 * @summary A checkable input that has three possible values: true, false, or mixed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#checkbox
 */
export class CheckBox extends RoleCheckBox {
    /**
     * @param {{}} init
     */
    init(init) {
        super.init(init)
        this.innerHTML = CheckBoxSvg
        this._input = new HTMLInput({
            type : 'hidden',
            value : 'on'
        })
        this.tabIndex = 0
        this.on('click', this.onClick)
        this.on('keydown', this.onKeyDown)
        this.on('mousedown', this.onMouseDown)
        this.on('blur', event => this.classList.remove('active'))
    }

    /**
     * @param {MouseEvent} event
     */
    onClick(event) {
        if(this.disabled) {
            event.stopImmediatePropagation()
        }
        else if(!event.defaultPrevented && !this.readOnly) {
            this.checked = !this.checked
            this.emit('change', { bubbles : true })
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        if(event.key === ' ') {
            event.preventDefault()
            this.classList.add('active')
            this.on('keyup', event => {
                if(event.key === ' ') {
                    this.classList.remove('active')
                    this.click()
                }
            }, { once : true })
        }
    }

    /**
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        if(!this.disabled) {
            this.classList.add('active')
            this.on('mouseup', event => this.classList.remove('active'), { once : true })
            this.on('mouseleave', event => this.classList.remove('active'), { once : true })
        }
    }

    /**
     * @param {Role|HTMLElementAssembler|*} label
     */
    setLabelInstance(label) {
        this.append(label)
    }

    /**
     * @param {boolean|string} checked
     */
    set checked(checked) {
        this._input.parentNode = (super.checked = checked)? this : null
    }

    /**
     * @returns {boolean|string}
     */
    get checked() {
        return super.checked
    }

    /**
     * @param {*} children
     */
    set children(children) {
        super.children = [children, this.find(HTMLInput)]
    }

    /**
     * @returns {array.ElementAssembler|*}
     */
    get children() {
        return super.children
    }

    /**
     * @param {boolean} disabled
     */
    set disabled(disabled) {
        super.disabled = this._input.disabled = disabled
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
     * @retrurns {string}
     */
    get name() {
        return this._input.name
    }
    
    /**
     * @param {string} value
     */
    set value(value) {
        this._input.value = value
    }

    /**
     * @returns {string}
     */
    get value() {
        return this._input.value
    }
}
