import { AuthFormWaitCode } from './AuthFormWaitCode'
import { AuthFormWaitPhoneNumber } from './AuthFormWaitPhoneNumber'
import { Page } from './Page'
import './AuthPage.css'

export class AuthPage extends Page
{
    build(init) {
        // return new AuthFormWaitPhoneNumber
        return new AuthFormWaitCode
    }
}
