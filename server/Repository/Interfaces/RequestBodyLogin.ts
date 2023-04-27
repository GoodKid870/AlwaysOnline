
export interface RequestBodyLogin {
    userMail: string;
    userPassword: string;
    session: {
        userId: string,
        authorized: string,
        usertoken: string
    }

}
