import './HTMLRoleType'
import { RoleWidget } from 'ariamodule/lib/RoleWidget'
import { RoleTab } from 'ariamodule/lib/RoleTab'
import { RoleComposite } from 'ariamodule/lib/RoleComposite'
import { RoleRange } from 'ariamodule/lib/RoleRange'
import { RoleCommand } from 'ariamodule/lib/RoleCommand'
import { RoleInput } from 'ariamodule/lib/RoleInput'
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
