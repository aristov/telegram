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
    build(init) {
        const state = init.authorization_state
        const type = types[state['@type']] || AuthForm
        this.children = new type
    }
}
