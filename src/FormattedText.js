import { Div } from './lib/HTMLDiv'
import './FormattedText.css'

export class FormattedText extends Div
{
    init(init) {
        super.init(init)
        if(init.formattedText) {
            this.innerHTML = this.build(init)
        }
        if(init.time) {
            this.append(init.time)
        }
    }

    build({ formattedText }) {
        return this.constructor.format(formattedText)
    }

    static format(formattedText) {
        return this.formatLineBreaks(this.formatEntities(formattedText))
    }

    static formatEntities({ text, entities }) {
        if(!text) return ''
        const result = []
        let index = 0, content
        for(const entity of entities) {
            const { type, offset } = entity
            const $type = type['@type']
            result.push(text.slice(index, offset))
            index = offset + entity.length
            content = text.slice(offset, index)
            switch($type) {
                case 'textEntityTypeUrl':
                case 'textEntityTypeTextUrl':
                    const href = type.url || content
                    content = this.formatLongUrl(content)
                    result.push(`<a href="${ href }" target="_blank">${ content }</a>`)
                    break
                case 'textEntityTypeBold':
                    result.push(`<strong>${ content }</strong>`)
                    break
                case 'textEntityTypeItalic':
                    result.push(`<em>${ content }</em>`)
                    break
                default:
                    result.push(`<!--<${ $type }-->${ content }<!--${ $type }>-->`)
            }
        }
        result.push(text.slice(index))
        return result.join('')
    }

    static formatLineBreaks(text) {
        return text.replace(/\n/g, '<br>')
    }

    static formatLongUrl(text) {
        return text.replace(/([^\^])\b(\w)/g, '$1<wbr>$2')
    }
}
