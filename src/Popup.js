import './lib/HTMLDocumentAssembler'
import './HTMLRoleType'
import debounce from 'lodash/debounce'
import { Expanded } from './lib/ARIAExpanded'
import { RoleMenuItem as MenuItem } from './lib/RoleMenuItem'
import { HTMLDiv } from './lib/HTMLDiv'
import { Inner } from './Inner'
import './Popup.css'

/**
 * @param {Element|*} node
 * @returns {number[]}
 * @private
 */
function getTransitionDurations(node) {
    if(!document.contains(node)) return [0]
    const style = getComputedStyle(node)
    const durations = style.transitionDuration.split(', ')
    return durations.map(duration => parseFloat(duration) * 1000)
}

/**
 * DatePicker > Box
 * ListBox > Box
 * Dialog > Inner
 * Menu => MenuBar
 * Menu => PopupMenu > Inner
 */
export class Popup extends HTMLDiv {
    /**
     * @param {{}} init
     */
    init(init) {
        super.init(init)
        this._trigger = null
        this._static = true
        this.hidden = true
        this.updateHeightDebounce = debounce(this.updateHeight.bind(this), 200)
        this.on(Expanded, this.onExpanded, { attributeOldValue : true })
    }

    install() {
        if(this.closest('body')) return
        this._static = false
        if(this._trigger) {
            this._trigger.after(this)
        }
        else this.parentNode = document.body
    }

    /**
     * Open the popup
     */
    open() {
        const durations = getTransitionDurations(this.node)
        if(durations.some(duration => duration)) {
            this.setAttr('hidden', 'true-false')
            this.updateHeight()
            this.hidden = false
        }
        else {
            this.hidden = false
            this.updateHeight()
        }
    }

    /**
     * Close the popup
     */
    close() {
        const durations = getTransitionDurations(this.node)
        if(durations.some(duration => duration)) {
            const handler = () => {
                if(!this.expanded) {
                    this.hidden = true
                }
                clearTimeout(timeoutId)
                this.un('transitionend', handler)
            }
            const durationMax = durations.sort().reverse()[0]
            const timeoutId = setTimeout(handler, durationMax)
            this.on('transitionend', handler)
            this.setAttr('hidden', 'false-true')
        }
        else this.hidden = true
    }

    /**
     * Bind the popup application events
     */
    bindEvents() {
        const doc = this.ownerDocument
        const win = doc.defaultView
        doc.on('click', this.onDocumentClick, this)
        doc.on('focusin', this.onDocumentFocusIn, this)
        doc.on('keydown', this.onDocumentKeyDown, this)
        win.on('scroll', this.onWindowScroll, { context : this, capture : true })
        win.on('resize', this.onWindowResize, this)
    }

    /**
     * Unbind the popup application events
     */
    unbindEvents() {
        const doc = this.ownerDocument
        const win = doc.defaultView
        doc.un('click', this.onDocumentClick, this)
        doc.un('focusin', this.onDocumentFocusIn, this)
        doc.un('keydown', this.onDocumentKeyDown, this)
        win.un('scroll', this.onWindowScroll, { context : this, capture : true })
        win.un('resize', this.onWindowResize, this)
    }

    updateHeight() {
        const style = this.style
        style.height = null
        if(this.node.getBoundingClientRect().height > innerHeight) {
            style.height = '100%'
        }
        this.updatePosition()
    }

    /**
     * Update the popup screen position
     */
    updatePosition() {
        const trigger = this._trigger
        if(!trigger) return
        const anchor = trigger.node.getBoundingClientRect()
        const popup = this.node.getBoundingClientRect()
        const style = this.style
        if(trigger instanceof MenuItem && trigger.parentMenu.orientation === 'vertical') {
            if(anchor.right + popup.width > innerWidth) {
                style.left = null
                style.right = innerWidth - anchor.left + 'px'
            }
            else {
                style.left = anchor.right + 'px'
                style.right = null
            }
            if(anchor.top + popup.height > innerHeight) {
                style.top = null
                style.bottom = innerHeight - anchor.bottom + 'px'
            }
            else {
                style.top = anchor.top + 'px'
                style.bottom = null
            }
        }
        else {
            const bottom = innerHeight - anchor.top
            const top = anchor.bottom
            if(bottom < 0 || top < 0) {
                this.expanded = false
                return
            }
            if(popup.height > anchor.top && popup.height > innerHeight - anchor.bottom) {
                style.left = style.top = null
                style.right = style.bottom = '0'
            }
            else {
                if(anchor.left + popup.width > innerWidth) {
                    style.left = null
                    style.right = innerWidth - anchor.right + 'px'
                }
                else {
                    style.left = anchor.left + 'px'
                    style.right = null
                }
                if(anchor.bottom + popup.height > innerHeight) {
                    style.top = null
                    style.bottom = bottom + 'px'
                }
                else {
                    style.top = top + 'px'
                    style.bottom = null
                }
            }
        }
    }

    /**
     * @param {MutationRecord} record
     */
    onExpanded(record) {
        if(record.oldValue === this.getAttr(record.attributeName)) return
        if(this.expanded) {
            this.bindEvents()
            this.install()
            this.open()
        }
        else {
            this.unbindEvents()
            this.close()
        }
    }

    /**
     * @param {Event} event
     */
    onWindowScroll(event) {
        if(!this.contains(event.target)) {
            this.updatePosition()
        }
    }

    /**
     * @param {Event} event
     */
    onWindowResize(event) {
        this.updateHeightDebounce()
    }

    /**
     * @param {MouseEvent} event
     */
    onDocumentClick(event) {
        const target = event.target
        const { inner, trigger } = this
        if(this.contains(target)) {
            if(inner && inner.contains(target)) {
                this.onInnerClick(event)
            }
            else this.onPopupClick(event)
        }
        else if(trigger && trigger.contains(target)) {
            this.onTriggerClick(event)
        }
        else this.onOutsideClick(event)
    }

    /**
     * @param {MouseEvent} event
     */
    onInnerClick(event) {}

    /**
     * @param {MouseEvent} event
     */
    onPopupClick(event) {
        const trigger = this._trigger
        trigger && trigger.focus()
        if(this.emit('cancel', { cancelable : true })) {
            this.expanded = false
        }
    }

    /**
     * @param {MouseEvent} event
     */
    onTriggerClick(event) {}

    /**
     * @param {MouseEvent} event
     */
    onOutsideClick(event) {
        if(this.emit('cancel', { cancelable : true })) {
            this.expanded = false
        }
    }

    /**
     * @param {FocusEvent} event
     */
    onDocumentFocusIn(event) {
        const target = event.target
        const { inner, trigger } = this
        if(this.contains(target)) {
            if(inner && inner.contains(target)) {
                this.onInnerFocusIn(event)
            }
            else this.onPopupFocusIn(event)
        }
        else if(trigger && trigger.contains(target)) {
            this.onTriggerFocusIn(event)
        }
        else this.onOutsideFocusIn(event)
    }

    /**
     * @param {FocusEvent} event
     */
    onInnerFocusIn(event) {}

    /**
     * @param {FocusEvent} event
     */
    onPopupFocusIn(event) {}

    /**
     * @param {FocusEvent} event
     */
    onTriggerFocusIn(event) {}

    /**
     * @param {FocusEvent} event
     */
    onOutsideFocusIn(event) {
        if(this.emit('cancel', { cancelable : true })) {
            this.expanded = false
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onDocumentKeyDown(event) {
        if(event.key === 'Escape') {
            this.onEscapeKeyDown(event)
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onEscapeKeyDown(event) {
        if(this.emit('cancel', { cancelable : true })) {
            this.expanded = false
        }
    }

    /**
     * @param {boolean|undefined} expanded
     */
    set expanded(expanded) {
        if(expanded === this.expanded) return
        const trigger = this._trigger
        this.setAttr(Expanded, expanded)
        if(trigger && 'expanded' in trigger) {
            trigger.expanded = expanded
        }
    }

    /**
     * @returns {boolean|undefined}
     */
    get expanded() {
        return this.getAttr(Expanded)
    }

    /**
     * @param {boolean} hidden
     */
    set hidden(hidden) {
        if(super.hidden = hidden) {
            this._static || this.remove()
        }
    }

    /**
     * @returns {boolean}
     */
    get hidden() {
        return super.hidden
    }

    /**
     * @returns {Inner|*}
     */
    get inner() {
        return this.find(Inner)
    }

    /**
     * @param {Role|*} trigger
     */
    set trigger(trigger) {
        this._trigger = trigger
    }

    /**
     * @returns {null|Role|*}
     */
    get trigger() {
        return this._trigger
    }
}
