import './HTMLRoleType'
import { RoleWidget } from './lib'
import { RoleTab } from './lib'
import { RoleComposite } from './lib'
import { RoleRange } from './lib'
import { RoleCommand } from './lib'
import { RoleInput } from './lib'
import { Span } from 'htmlmodule/lib/HTMLSpan'

/**
 * @summary An interactive component of a graphical user interface (GUI).
 * @see https://www.w3.org/TR/wai-aria-1.1/#widget
 * @abstract
 */
export class HTMLWidget extends RoleWidget {
    /**
     * @returns {class}
     */
    static get elementAssembler() {
        return Span
    }
}

// RoleWidget.applyMixin(HTMLWidget)

HTMLWidget.setSuperClassOf(RoleTab, RoleComposite, RoleRange, RoleCommand, RoleInput)
