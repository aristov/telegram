import { Heading } from './lib'
import { Span } from './lib'
import { AuthCodeBox } from './AuthCodeBox'
import { AuthForm } from './AuthForm'
import { AuthMessage } from './AuthMessage'
import { Button } from './Button'
import { Label } from './Label'
import { TelegramLogo } from './TelegramLogo'
import { api } from './api'

class EditPhoneNumber extends Button
{
    activate() {
        this.emit('navigate', {
            bubbles : true,
            detail : { type : 'authorizationStateWaitPhoneNumber' }
        })
    }
}

export class AuthFormWaitCode extends AuthForm
{
    build({ authorization_state }) {
        const { phone_number, type } = authorization_state.code_info
        return [
            new TelegramLogo,
            new Heading([
                new Span(phone_number),
                // new EditPhoneNumber({ title : 'Ввести другой номер' }),
            ]),
            new AuthMessage({ innerHTML : 'We have sent you an SMS<br>with the code.' }),
            this._codeBox = new AuthCodeBox({
                label : new Label('Code'),
                codeLength : type.length,
                required : true
            })
        ]
    }

    onSubmit() {
        api.send('checkAuthenticationCode', {
            code : this._codeBox.value
        }).catch(error => this.onError(error))
    }

    onError(error) {
        super.onError(error)
        this._codeBox.invalid = true
    }
}
