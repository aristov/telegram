import { A, Br, Div, P, Strong } from 'htmlmodule/lib'

export class FormattedText extends Div
{
    init(init) {
        super.init(init)
        console.log(this.children = this.build(init))
    }

    build({ text }) {
        return this.splitByEntities(text.text, text.entities)
    }

    splitByEntities(str, entities) {
        const children = []
        let startIndex = 0
        let entity, type, offset, chunk, textContent
        for(entity of entities) {
            type = entity.type['@type']
            if(type === 'textEntityTypeUrl' || type === 'textEntityTypeTextUrl') {
                offset = entity.offset
                chunk = str.slice(startIndex, offset)
                children.push(...this.splitByParagraphs(chunk))
                startIndex = offset + entity.length
                textContent = str.slice(offset, startIndex)
                children.push(new A({
                    href : entity.type.url || textContent,
                    target : '_blank',
                    textContent
                }))
                // children.push(`<a href="${ href }" target="_blank">${ textContent }</a>`)
            }
            else if(type === 'textEntityTypeBold') {
                offset = entity.offset
                chunk = str.slice(startIndex, offset)
                children.push(...this.splitByParagraphs(chunk))
                startIndex = offset + entity.length
                textContent = str.slice(offset, startIndex)
                children.push(new Strong(textContent))
            }
        }
        children.push(...this.splitByParagraphs(str.slice(startIndex)))
        return children
    }

    splitByParagraphs(str) {
        return str.split('\n\n').filter(Boolean).map(paragraph => {
            return new P(...this.splitByLineBreaks(paragraph))
        })
    }

    splitByLineBreaks(str) {
        return str.split('\n').map((chunk, i) => [!!i && new Br, chunk])
    }
}
