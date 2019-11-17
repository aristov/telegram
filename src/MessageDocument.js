import { A, Data } from './lib'
import { Bubble } from './Bubble'
import { FormattedText } from './FormattedText'
import { MessageContent } from './MessageContent'
import { PublicationTime } from './PublicationTime'
import { TdFile } from './TdFile'

export class MessageDocument extends MessageContent
{
    async build({ content, message }) {
        const { file_name, document } = content.document
        return new Bubble([
            new FormattedText([
                new A({
                    href : await TdFile.getFileUrl(document),
                    target : '_blank',
                    children : file_name
                }),
                new FileSizeInfo(TdFile.humanizeFileSize(document.size))
            ]),
            new PublicationTime({ message })
        ])
    }
}

class FileSizeInfo extends Data
{
}
