const kb = 1024
const mb = 1024 * kb

export class TdFile
{
    static humanizeFileSize(size) {
        if(size < kb) {
            return size + ' bytes'
        }
        if(size < mb) {
            return Math.round(size * 10 / kb) / 10 + ' KB'
        }
        return Math.round(size * 10 / mb) / 10 + ' KB'
    }
}
