export class UpdateUserModel {
    constructor(public currentPassword: string, public username: string, public email: string, public password: string, public confirmPassword: string) { }
}