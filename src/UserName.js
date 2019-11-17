import { Div } from 'htmlmodule/lib'
import { api } from './api'
import { TdUser } from './TdUser'

export class UserName extends Div
{
    async init(init) {
        super.init(init)
        const user = await api.send('getUser', { user_id : init.user_id })
        this.children = TdUser.getFullName(user)
    }
}
