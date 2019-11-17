import { A, Data } from 'htmlmodule/lib'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'
import { TdFile } from './TdFile'

export class MessageDocument extends MessageContent
{
    async build({ content }) {
        const { file_name, document } = content.document
        return new Bubble(new FormattedText([
            new A({
                href : await TdFile.getFileUrl(document),
                target : '_blank',
                children : file_name
            }),
            new FileSizeInfo(TdFile.humanizeFileSize(document.size))
        ]))
    }
}

class FileSizeInfo extends Data
{
}
