import { Role } from './lib'
import { RoleRoleType } from './lib'
import { HTMLDiv } from './lib/HTMLDiv'

const ROLE_CLASS_PREFIX_RE = /^Role/

/**
 * @mixin
 */
export class HTMLRole extends Role {
    /**
     * @param {{}} init
     */
    create(init) {
        super.create(init)
        this.classList = this.constructor.classList
    }

    /**
     * Blur the owner element
     */
    blur() {
        this.ownerElement.blur()
    }

    /**
     * Click the owner element
     */
    click() {
        this.ownerElement.click()
    }

    /**
     * Focus the owner element
     */
    focus() {
        this.ownerElement.focus()
    }

    /**
     * @param {string} name
     * @param {string} value
     */
    setPropertyFallback(name, value) {
        const { ownerElement, node } = this
        if(name in ownerElement) {
            ownerElement.setProperty(name, value)
        }
        else if(name in node) {
            node[name] = value
        }
        else this.setPropertyMismatch(name, value)
    }

    /**
     * @param {*} dataset
     */
    set dataset(dataset) {
        this.ownerElement.dataset = dataset
    }

    /**
     * @returns {DOMStringMap}
     */
    get dataset() {
        return this.ownerElement.dataset
    }

    /**
     * @param {string} innerHTML
     */
    set innerHTML(innerHTML) {
        this.ownerElement.innerHTML = innerHTML
    }

    /**
     * @returns {string}
     */
    get innerHTML() {
        return this.ownerElement.innerHTML
    }

    /**
     * @param {*} style
     */
    set style(style) {
        this.ownerElement.style = style
    }

    /**
     * @returns {CSSStyleDeclaration}
     */
    get style() {
        return this.ownerElement.style
    }

    /**
     * @param {number|null} tabIndex
     */
    set tabIndex(tabIndex) {
        this.ownerElement.tabIndex = tabIndex
    }

    /**
     * @returns {number|null}
     */
    get tabIndex() {
        return this.ownerElement.tabIndex
    }
    
    /**
     * @param {Object|*} object
     * @returns {boolean}
     */
    static isPrototypeOf(object) {
        let proto
        const thisChain = this.getPrototypeChainOf(this)
        const objectChain = this.getPrototypeChainOf(object)
        const thisNames = thisChain.map(({ name }) => name)
        const objectNames = objectChain.map(item => {
            if(item.name === this.name) {
                proto = item
            }
            return item.name
        })
        if(proto && objectNames.join().endsWith(thisNames.join())) {
            const thisProps = Object.getOwnPropertyNames(this)
            const protoProps = Object.getOwnPropertyNames(proto)
            return thisProps.sort().join() === protoProps.sort().join()
        }
        return false
    }

    /**
     * @param {Object|*} object
     * @returns {Array}
     */
    static getPrototypeChainOf(object) {
        const chain = []
        for(let proto = object; proto; proto = Object.getPrototypeOf(proto)) {
            chain.push(proto)
        }
        return chain
    }

    /**
     * @param {class[]} assemblers
     */
    static setSuperClassOf(...assemblers) {
        assemblers.forEach(assembler => {
            Object.setPrototypeOf(assembler, this)
            Object.setPrototypeOf(assembler.prototype, this.prototype)
        })
    }

    /**
     * @returns {string[]}
     */
    static get classList() {
        const list = []
        let object = this
        do if(object.abstract === false) {
            const item = object.classToken
            list.includes(item) || list.push(item)
        }
        while((object = Object.getPrototypeOf(object)) && 'classToken' in object)
        return list
    }

    /**
     * @returns {string}
     */
    static get classToken() {
        return this.name.replace(ROLE_CLASS_PREFIX_RE, '')
    }

    /**
     * @returns {HTMLDiv}
     */
    static get elementAssembler() {
        return HTMLDiv
    }
}

// HTMLRole.applyMixin.call(Role, HTMLRole)

HTMLRole.setSuperClassOf(RoleRoleType)
