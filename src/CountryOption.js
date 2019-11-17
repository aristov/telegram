import { Span } from 'htmlmodule'
import { CountryCode } from './CountryCode'
import { Option } from './Option'
import './CountryOption.css'

export class CountryOption extends Option
{
    init(init) {
        super.init(init)
        this.children = [
            new Span(this._text = init.country.country_name),
            new CountryCode('+' + init.country.country_code)
        ]
    }

    get text() {
        return this._text
    }
}

