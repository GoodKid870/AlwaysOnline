export interface IUserProfile {
    userInfo: {
        userMail: string,
        userLogin: string,
        userPassword: string,
        userId: string
    }
    avatar: string
}

export default IUserProfile