import './HTMLRole'
import { Role } from './lib'
import { RoleRoleType } from './lib'
import { RoleStructure } from './lib'
import { RoleWidget } from './lib'
import { RoleWindow } from './lib'
import { HTMLElementAssembler } from './lib/HTMLElementAssembler'

let undefined
const tabIndexKey = Symbol()

export class HTMLRoleType extends RoleRoleType
{
    /**
     * @param {Role|HTMLElementAssembler|*} label
     */
    setLabelInstance(label) {
        this.prepend(label)
    }

    /**
     * @param {boolean} disabled
     */
    set disabled(disabled) {
        if(super.disabled = disabled) {
            if(this.hasAttr('tabindex')) {
                this[tabIndexKey] = this.tabIndex
                this.removeAttr('tabindex')
            }
        }
        else {
            const tabIndex = this[tabIndexKey]
            if(tabIndex !== undefined) {
                this.tabIndex = tabIndex
            }
        }
    }

    /**
     * @returns {boolean}
     */
    get disabled() {
        return super.disabled
    }

    /**
     * @param {string|Role|HTMLElementAssembler|*} label
     */
    set label(label) {
        if(label instanceof Role || label instanceof HTMLElementAssembler) {
            this.setLabelInstance(this.labelledBy = label)
        }
        else super.label = label
    }

    /**
     * @returns {string}
     */
    get label() {
        return super.label
    }

}

HTMLRoleType.setSuperClassOf(RoleStructure, RoleWidget, RoleWindow)
