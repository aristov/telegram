import { api } from './api'

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

    async static getFileUrl(file) {
        const { id, local } = file
        if(local.is_downloading_completed) {
            return await this.readFile(id)
        }
        else if(!local.is_downloading_active && local.can_be_downloaded) {
            api.send('downloadFile', { file_id : id, priority : 1 })
            return new Promise(resolve => {
                const handler = ({ detail : { file } }) => {
                    if(file.id === id && file.local.is_downloading_completed) {
                        this.readFile(file.id).then(resolve)
                        api.un('updateFile', handler)
                    }
                }
                api.on('updateFile', handler)
            })
        }
    }

    async static readFile(file_id) {
        const { data } = await api.send('readFile', { file_id })
        return URL.createObjectURL(data)
    }
}
