import { A, Br, Div, P } from 'htmlmodule/lib'

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
        for(const entity of entities) {
            if(entity.type['@type'] === 'textEntityTypeUrl') {
                const offset = entity.offset
                const chunk = str.slice(startIndex, offset)
                children.push(...this.splitByParagraphs(chunk))
                const href = str.slice(offset, startIndex = offset + entity.length)
                children.push(new A({
                    href,
                    target : '_blank',
                    children : href
                }))
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
