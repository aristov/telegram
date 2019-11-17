import { RoleOption } from 'ariamodule/lib/RoleOption'
import { HTMLInput } from 'htmlmodule/lib/HTMLInput'
import './Option.css'

/**
 * @summary A selectable item in a select list.
 * @see https://www.w3.org/TR/wai-aria-1.1/#option
 */
export class Option extends RoleOption {
    /**
     * @param {{}} init
     */
    init(init) {
        super.init(init)
        this._input = new HTMLInput({ type : 'hidden' })
        this.on('click', this.onClick)
    }

    /**
     * @param {MouseEvent} event
     */
    onClick(event) {
        if(this.disabled) {
            event.stopImmediatePropagation()
        }
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
        super.disabled = disabled
    }

    /**
     * @returns {boolean}
     */
    get disabled() {
        const listBox = this.listBox
        return listBox && listBox.disabled || super.disabled
    }

    /**
     * @param {string} name
     */
    set name(name) {
        this._input.name = name
    }

    /**
     * @returns {string}
     */
    get name() {
        return this._input.name
    }

    /**
     * @param {boolean} selected
     */
    set selected(selected) {
        if(selected) {
            const listBox = this.listBox
            if(listBox && !listBox.multiSelectable) {
                listBox.activeDescendant = this
            }
        }
        this._input.parentNode = selected? this : null
        super.selected = selected
    }

    /**
     * @returns {boolean}
     */
    get selected() {
        return super.selected
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
        return this._input.value || this.textContent
    }
}
