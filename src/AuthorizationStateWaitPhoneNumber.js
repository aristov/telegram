import { Heading } from 'ariamodule/lib'
import { Div, HTMLLabel } from 'htmlmodule/lib'
import { AuthorizationState } from './AuthorizationState'
import { CheckBox } from './CheckBox'
import { CountryBox } from './CountryBox'
import { Label } from './Label'
import { PhoneNumberBox } from './PhoneNumberBox'
import { TelegramLogo } from './TelegramLogo'

export class AuthorizationStateWaitPhoneNumber extends AuthorizationState
{
    init(init) {
        super.init(init)
        this.setProperty('children', this.build(init))
    }

    build(init) {
        return [
            new TelegramLogo,
            new Heading('Sign in to Telegram'),
            new AuthorizationMessage('Please confirm your country and enter your phone number.'),
            new CountryBox({
                label : new Label('Country')
            }),
            new PhoneNumberBox({
                label : new Label('Phone Number')
            }),
            new CheckBox({
                label : new HTMLLabel('Keep me signed in'),
                checked : true
            })
        ]
    }
}

class AuthorizationMessage extends Div
{
}
