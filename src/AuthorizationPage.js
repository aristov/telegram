import { AuthorizationStateWaitPhoneNumber } from './AuthorizationStateWaitPhoneNumber'
import { Page } from './Page'
import './AuthorizationPage.css'

export class AuthorizationPage extends Page
{
    build(init) {
        return new AuthorizationStateWaitPhoneNumber
    }
}
