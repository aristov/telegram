import { RoleListBox } from './lib/RoleListBox'
import { Selected } from './lib/ARIASelected'
import { Inner } from './Inner'
import { Option } from './Option'
import './ListBox.css'

const VALUE_SEPARATOR = ','

/**
 * @summary A widget that allows the user to select one or more items from a list of choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#listbox
 */
class ListBox extends RoleListBox {
    /**
     * @param {{}} init
     */
    init(init) {
        super.init(init)
        this._name = ''
        this._box = null
        this.tabIndex = 0
        this.on('keydown', this.onKeyDown)
        this.on('keyup', this.onKeyUp)
        this.on('mousedown', this.onMouseDown)
        this.on('touchstart', this.onMouseDown)
    }

    /**
     * @param {KeyboardEvent} event
     */
    onArrowKeyDown(event) {
        event.preventDefault()
        if(this.readOnly) return
        const options = this.options.filter(({ hidden, disabled }) => !hidden && !disabled)
        const activeDescendant = this.activeDescendant
        const index = options.indexOf(activeDescendant)
        let option
        if(event.key === 'ArrowDown') {
            option = index > -1?
                options[index + 1] :
                options[0]
        }
        if(event.key === 'ArrowUp') {
            option = index > -1?
                options[index - 1] :
                options[options.length - 1]
        }
        if(option) {
            if(this.multiSelectable) {
                if(event.shiftKey) {
                    if(!this._anchor) {
                        this._anchor = activeDescendant || option
                    }
                }
                else this._anchor = null
            }
            this.activeDescendant = option
            this.emit('change', { bubbles : true })
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        const key = event.key
        if(key === ' ') {
            this.onSpaceKeyDown(event)
        }
        if(key.startsWith('Arrow')) {
            this.onArrowKeyDown(event)
        }
        if(event.code === 'KeyA' && (event.metaKey || event.ctrlKey)) {
            this.onSelectAllKeyDown(event)
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyUp(event) {
        if(event.key === ' ') {
            this.onSpaceKeyUp(event)
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onSelectAllKeyDown(event) {
        event.preventDefault()
        if(this.readOnly || !this.multiSelectable) return
        const options = this.options
        if(this.selectedOptions.length < options.length) {
            for(const option of options) {
                option.setAttr(Selected, true)
            }
            this._anchor = options[0]
            super.activeDescendant = options[options.length - 1]
            this.emit('change', { bubbles : true })
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onSpaceKeyDown(event) {
        event.preventDefault()
        for(const option of this.selectedOptions) {
            option.classList.add('active')
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onSpaceKeyUp(event) {
        for(const option of this.selectedOptions) {
            option.classList.remove('active')
        }
    }

    /**
     * @param {MouseEvent} event
     * @param {Element} event.target
     */
    onMouseDown(event) {
        if(this.readOnly || this.disabled) return
        const option = this.getRoleOf(event.target.closest(Option.selector))
        if(option && !option.disabled) {
            const anchor = this._anchor
            if(this.multiSelectable && (!event.shiftKey || !this._anchor)) {
                event.type === 'touchstart' && event.preventDefault()
                this._anchor = option
            }
            if(this.multiSelectable || event.type === 'mousedown') {
                if(option !== this.activeDescendant || anchor !== this._anchor) {
                    this.activeDescendant = option
                    this.emit('change', { bubbles : true })
                }
            }
        }
        this.on('mouseover', this.onMouseOver)
        this.on('touchmove', this.onMouseOver)
        this.ownerDocument.on('mouseup', this.onMouseUp, this)
        this.ownerDocument.on('touchend', this.onMouseUp, this)
    }

    /**
     * @param {MouseEvent} event
     * @param {Element} event.target
     */
    onMouseOver(event) {
        let target
        if(event.type === 'touchmove') {
            const touch = event.touches[0]
            target = document.elementFromPoint(touch.clientX, touch.clientY)
        }
        else target = event.target
        const option = target && this.getRoleOf(target.closest(Option.selector))
        if(option && !option.disabled) {
            if(this.multiSelectable && !this._anchor) {
                this._anchor = option
            }
            if(this.multiSelectable || event.type === 'mouseover') {
                if(option !== this.activeDescendant) {
                    this.activeDescendant = option
                    this.emit('change', { bubbles : true })
                }
            }
        }
    }

    /**
     * @param {MouseEvent} event
     */
    onMouseUp(event) {
        this.un('mouseover', this.onMouseOver)
        this.un('touchmove', this.onMouseOver)
        this.ownerDocument.un('mouseup', this.onMouseUp, this)
        this.ownerDocument.un('touchend', this.onMouseUp, this)
    }

    /**
     * @param {Option} option
     */
    smoothScrollTo(option) {
        const optionNode = option.node
        const boxNode = optionNode.parentNode
        const offset = Math.min(optionNode.offsetHeight / 5, 5)
        const optionTop = optionNode.offsetTop - offset
        const optionBottom = optionNode.offsetTop + optionNode.offsetHeight + offset
        const boxHeight = boxNode.clientHeight
        const scrollEdge = boxNode.scrollHeight - boxNode.clientHeight
        let scrollTop = Math.round(boxNode.scrollTop)
        function scroll() {
            if(optionTop < boxNode.scrollTop) {
                if((boxNode.scrollTop = scrollTop--) > 0) {
                    setTimeout(scroll)
                }
            }
            else if(optionBottom > boxNode.scrollTop + boxHeight) {
                if((scrollEdge - (boxNode.scrollTop = scrollTop++)) > 0) {
                    setTimeout(scroll)
                }
            }
        }
        scroll()
    }

    /**
     * @param {Option} option
     */
    scrollTo(option) {
        const optionNode = option.node
        const boxNode = optionNode.parentNode
        const offset = Math.min(optionNode.offsetHeight / 5, 5)
        const optionTop = optionNode.offsetTop - offset
        const optionBottom = optionNode.offsetTop + optionNode.offsetHeight + offset
        const boxHeight = boxNode.clientHeight
        if(optionTop < boxNode.scrollTop) {
            boxNode.scrollTop = optionTop - boxHeight / 2
        }
        else if(optionBottom > boxNode.scrollTop + boxHeight) {
            boxNode.scrollTop = optionBottom - boxHeight / 2
        }
    }

    /**
     * Set up the list box
     */
    update() {
        super.activeDescendant = this.selectedOptions[0] || null
        this._anchor = this.multiSelectable?
            this.activeDescendant :
            null
    }

    /**
     * @param {*} activeDescendant
     */
    set activeDescendant(activeDescendant) {
        const anchor = this._anchor || activeDescendant
        const options = this.options
        const index1 = options.indexOf(anchor)
        const index2 = options.indexOf(activeDescendant)
        const range = options.slice(Math.min(index1, index2), Math.max(index1, index2) + 1)
        for(const option of options) {
            if(range.includes(option)) {
                option.setAttr(Selected, true)
            }
            else option.selected = false
        }
        activeDescendant && this.scrollTo(activeDescendant)
        super.activeDescendant = activeDescendant
    }

    /**
     * @returns {Role|ElementAssembler|*|null}
     */
    get activeDescendant() {
        return super.activeDescendant
    }

    /**
     * @param {*} children
     */
    set children(children) {
        super.children = children
        this.update()
    }

    /**
     * @returns {ElementAssembler[]}
     */
    get children() {
        return super.children
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
     * @param {Option[]} options
     */
    set options(options) {
        const box = this._box || (this._box = new Inner({
            parentNode : this,
            onfocus : () => this.focus() // scrollable box can receive focus in Firefox
        }))
        box.children = options
        this.update()
    }

    /**
     * @returns {Option[]}
     */
    get options() {
        return super.options
    }

    /**
     * @param {string} value
     */
    set value(value) {
        const values = value && value.split(this.constructor.valueSeparator)
        const options = []
        this.options.forEach(option => {
            if(option.selected = !!value && values.includes(option.value)) {
                options.push(option)
            }
        })
        if(options.length) {
            this._anchor = options.length > 1? options[0] : null
            this.activeDescendant = options[options.length - 1]
        }
        else this.activeDescendant = null
    }

    /**
     * @returns {string}
     */
    get value() {
        return this.selectedOptions
                   .map(({ value }) => value)
                   .join(this.constructor.valueSeparator)
    }

    static get valueSeparator() {
        return VALUE_SEPARATOR
    }
}

export { ListBox, Option }
