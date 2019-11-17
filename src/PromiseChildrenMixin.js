import { HTMLElementAssembler } from './lib'
import { HTMLRole } from './HTMLRole'

const proto = HTMLElementAssembler.ParentNodeAssembler.prototype
const { set, get } = Object.getOwnPropertyDescriptor(proto, 'children')

export class PromiseChildrenMixin extends HTMLElementAssembler {
    /**
     * @param {*} children
     */
    set children(children) {
        if(children instanceof Promise) {
            children
                .then(result => set.call(this, result))
                .catch(error => set.call(this, error))
        }
        else set.call(this, children)
    }

    /**
     * @returns {array.ElementAssembler|*}
     */
    get children() {
        return get.call(this)
    }
}

HTMLRole.applyMixin.call(HTMLElementAssembler, PromiseChildrenMixin)
