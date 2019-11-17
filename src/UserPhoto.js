import { api } from './api'
import { ChatPhoto } from './ChatPhoto'
import { TdFile } from './TdFile'

export class UserPhoto extends ChatPhoto // fixme
{
    async build({ user_id }) {
        const user = await api.send('getUser', { user_id })
        const photo = user.profile_photo
        this.textContent = user.first_name.charAt(0)
        if(photo) {
            TdFile.getFileUrl(photo.small).then(src => this.src = src)
        }
    }
}
