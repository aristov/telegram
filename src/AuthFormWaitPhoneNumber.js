import { Heading } from 'ariamodule/lib'
import { HTMLLabel } from 'htmlmodule/lib'
import { AuthForm } from './AuthForm'
import { AuthMessage } from './AuthMessage'
import { CheckBox } from './CheckBox'
import { CountryBox } from './CountryBox'
import { Label } from './Label'
import { PhoneNumberBox } from './PhoneNumberBox'
import { SubmitButton } from './SubmitButton'
import { TelegramLogo } from './TelegramLogo'
import { api } from './api'

export class AuthFormWaitPhoneNumber extends AuthForm
{
    build(init) {
        return [
            new TelegramLogo,
            new Heading('Sign in to Telegram'),
            new AuthMessage({
                innerHTML : 'Please confirm your country and<br>enter your phone number.'
            }),
            this._countryBox = new CountryBox({
                label : new Label('Country'),
                onchange : event => this.onCountryBoxChange(event)
            }),
            this._phoneNumberBox = new PhoneNumberBox({
                label : new Label('Phone Number'),
                required : true,
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

    onSubmit(event) {
        if(event.defaultPrevented) return
        api.send('setAuthenticationPhoneNumber', {
            phone_number : this._phoneNumberBox.value
        }).catch(error => this.onError(error))
    }

    onError(error) {
        super.onError(error)
        this._phoneNumberBox.invalid = true
    }
}
