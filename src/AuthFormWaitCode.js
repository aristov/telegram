import { Heading } from 'ariamodule/lib'
import { AuthCodeBox } from './AuthCodeBox'
import { AuthForm } from './AuthForm'
import { AuthMessage } from './AuthMessage'
import { Label } from './Label'
import { SubmitButton } from './SubmitButton'
import { TelegramLogo } from './TelegramLogo'
// import { api } from './api'

export class AuthFormWaitCode extends AuthForm
{
    build(init) {
        return [
            new TelegramLogo,
            new Heading('+7 903 730 7615'), // fixme
            new AuthMessage({ innerHTML : 'We have sent you an SMS<br>with the code.' }),
            this._codeBox = new AuthCodeBox({
                label : new Label('Code')
            }),
            /*this._submitButton = new SubmitButton({
                disabled : true,
                children : 'NEXT'
            })*/
        ]
    }

    onSubmit() {
        this._codeBox.invalid = true
        return
        api.send('checkAuthenticationCode', {
            code : this._codeBox.value
        })
    }
}
