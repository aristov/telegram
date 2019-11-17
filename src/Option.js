import { RoleOption } from './lib/RoleOption'
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
     * @param {boolean} selected
     */
    set selected(selected) {
        if(selected) {
            const listBox = this.listBox
            if(listBox && !listBox.multiSelectable) {
                listBox.activeDescendant = this
            }
        }
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
        this.dataset.value = value
    }

    /**
     * @returns {string}
     */
    get value() {
        return this.dataset.value || this.text
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.textContent
    }
}
