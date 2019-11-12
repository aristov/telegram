import './HTMLRole'
import { Role } from 'ariamodule/lib/Role'
import { RoleRoleType } from 'ariamodule/lib/RoleRoleType'
import { RoleStructure } from 'ariamodule/lib/RoleStructure'
import { RoleWidget } from 'ariamodule/lib/RoleWidget'
import { RoleWindow } from 'ariamodule/lib/RoleWindow'
import { HTMLElementAssembler } from 'htmlmodule/lib/HTMLElementAssembler'

let undefined
const tabIndexKey = Symbol()

export class HTMLRoleType extends RoleRoleType {
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
     * @param {*} label {string|Role|HTMLElementAssembler|*}
     */
    set label(label) {
        if(label instanceof Role || label instanceof HTMLElementAssembler) {
            this.prepend(this.labelledBy = label)
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
