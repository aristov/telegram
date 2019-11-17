import { Heading } from 'ariamodule/lib'
import { Div, HTMLLabel } from 'htmlmodule/lib'
import { AuthForm } from './AuthForm'
import { CheckBox } from './CheckBox'
import { CountryBox } from './CountryBox'
import { Label } from './Label'
import { PhoneNumberBox } from './PhoneNumberBox'
import { SubmitButton } from './SubmitButton'
import { TelegramLogo } from './TelegramLogo'

export class AuthFormWaitPhoneNumber extends AuthForm
{
    build(init) {
        return [
            new TelegramLogo,
            new Heading('Sign in to Telegram'),
            new AuthorizationMessage('Please confirm your country and enter your phone number.'),
            this._countryBox = new CountryBox({
                label : new Label('Country'),
                onchange : event => this.onCountryBoxChange(event)
            }),
            this._phoneNumberBox = new PhoneNumberBox({
                label : new Label('Phone Number'),
                value : '+7 903 730 7615', // fixme
                onchange : event => this.onPhoneNumberChange(event)
            }),
            new CheckBox({
                label : new HTMLLabel('Keep me signed in'),
                checked : true
            }),
            this._submitButton = new SubmitButton({
                disabled : true,
                children : 'NEXT'
            })
        ]
    }

    onCountryBoxChange(event) {
        this._phoneNumberBox.value = this._countryBox.value + ' '
    }

    onPhoneNumberChange(event) {
        const { value, invalid } = this._phoneNumberBox
        this._submitButton.disabled = !value || invalid
    }
}

class AuthorizationMessage extends Div
{
}
