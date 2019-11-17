import { RoleButton } from './lib'
import './Button.css'

let undefined

/**
 * @summary An input that allows for user-triggered actions when clicked or pressed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#button
 */
export class Button extends RoleButton {
    /**
     * @param {{}} init
     */
    init(init) {
        super.init(init)
        this.tabIndex = 0
        this.on('blur', this.onBlur)
        this.on('click', this.onClick)
        this.on('keydown', this.onKeyDown)
        this.on('mousedown', this.onMouseDown)
    }

    /**
     * Activate an action of the button
     */
    activate() {
        const pressed = this.pressed
        const expanded = this.expanded
        if(expanded !== undefined) {
            this.expanded = !expanded
        }
        if(pressed !== undefined) {
            this.pressed = !pressed
        }
    }

    /**
     * @param {FocusEvent} event
     */
    onBlur(event) {
        this.classList.remove('active')
    }

    /**
     * @param {MouseEvent} event
     */
    onClick(event) {
        if(this.disabled) {
            event.stopImmediatePropagation()
        }
        else if(!event.defaultPrevented) {
            this.activate()
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        switch(event.key) {
            case 'Enter':
                this.onEnterKeyDown(event)
                break
            case ' ':
                this.onSpaceKeyDown(event)
                break
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onEnterKeyDown(event) {
        this.click()
    }

    /**
     * @param {KeyboardEvent} event
     */
    onSpaceKeyDown(event) {
        event.preventDefault()
        const classList = this.classList
        classList.add('active')
        this.on('keyup', event => {
            if(event.key === ' ' && classList.contains('active')) {
                classList.remove('active')
                this.click()
            }
        }, { once : true })
    }

    /**
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        if(!this.disabled) {
            const classList = this.classList
            classList.add('active')
            this.on('mouseleave', event => classList.remove('active'), { once : true })
            this.on('mouseup', event => classList.remove('active'), { once : true })
        }
    }

    /**
     * @param {boolean|undefined} expanded
     */
    set expanded(expanded) {
        if(expanded === this.expanded) return
        if(this.hasPopup) {
            this.controls.forEach(item => {
                if(item.expanded === undefined) return
                item.expanded = expanded
            })
        }
        super.expanded = expanded
    }

    /**
     * @returns {boolean|undefined}
     */
    get expanded() {
        return super.expanded
    }
}
