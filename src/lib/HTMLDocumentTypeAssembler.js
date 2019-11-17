import { DocumentTypeAssembler } from './DocumentTypeAssembler'
import { HTMLDocumentAssembler } from './HTMLDocumentAssembler'

export class HTMLDocumentTypeAssembler extends DocumentTypeAssembler {
    /**
     * @returns {HTMLDocumentAssembler}
     */
    static get documentAssembler() {
        return HTMLDocumentAssembler
    }
}
