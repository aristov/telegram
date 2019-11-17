import './HTMLRoleType'
import { RoleWidget } from './lib/RoleWidget'
import { RoleTab } from './lib/RoleTab'
import { RoleComposite } from './lib/RoleComposite'
import { RoleRange } from './lib/RoleRange'
import { RoleCommand } from './lib/RoleCommand'
import { RoleInput } from './lib/RoleInput'
import { Span } from './lib/HTMLSpan'

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
