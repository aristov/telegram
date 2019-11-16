export class User
{
    static getFullName({ first_name, last_name }) {
        return [first_name, last_name].filter(Boolean).join(' ') || this.emptyUserName
    }

    static get emptyUserName() {
        return 'Deleted Account'
    }
}
