import { ComboBox } from './ComboBox'
import { CountryOption } from './CountryOption'
import options from './CountryBoxData'

export class CountryBox extends ComboBox
{
    init(init) {
        super.init(init)
        this.autoComplete = 'list'
        this.options = options.map(country => new CountryOption({ country }))
    }
}
