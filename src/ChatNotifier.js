import { Status } from 'ariamodule/lib'
import { Span } from 'htmlmodule/lib'

export class ChatNotifier extends Status
{
    static get elementAssembler() {
        return Span
    }
}
