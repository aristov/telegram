import { AuthForm } from './AuthForm'
import * as index from './AuthForm.index'
import { Page } from './Page'
import './AuthPage.css'

const types = {}

for(const key of Object.keys(index)) {
    types[key.replace(/^AuthForm/, 'authorizationState')] = index[key]
}

export class AuthPage extends Page
{
    init(init) {
        this._forms = {}
        super.init(init)
        this.on('navigate', this.onNavigate)
    }

    build(init) {
        const { authorization_state } = init
        const type = authorization_state['@type']
        const form = types[type] || AuthForm
        this.children = this._forms[type] = new form({ authorization_state })
    }

    onNavigate(event) {
        this.setProperty('children', this._forms[event.detail.type])
    }
}
