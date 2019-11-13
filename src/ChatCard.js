import { RoleArticle } from 'ariamodule/lib'
import './ChatCard.css'
import { UserPic } from './UserPic'

export class ChatCard extends RoleArticle
{
    init(init) {
        super.init(init)
        this.children = [
            // new UserPic({ data })
        ]
    }
}
