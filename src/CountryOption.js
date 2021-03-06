import { Span } from './lib/HTMLSpan'
import { Option } from './Option'
import './CountryOption.css'

export class CountryOption extends Option
{
    init(init) {
        super.init(init)
        this.children = [
            new CountryName(this._text = init.country.country_name),
            new CountryCode(this.value = '+' + init.country.country_code)
        ]
    }

    get text() {
        return this._text
    }
}

class CountryName extends Span
{
}
class CountryCode extends Span
{
}
