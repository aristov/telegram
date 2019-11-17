import { ComboBox, Option } from './ComboBox'
import CountryBoxJson from './CountryBoxData'

export class CountryBox extends ComboBox
{
    init(init) {
        super.init(init)
        this.options = CountryBoxJson.map(country => {
            return new Option({
                value : country.country_code,
                children : country.country_name,
            })
        })
    }
}
