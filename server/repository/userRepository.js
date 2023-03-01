import {database} from "./database.js";
import md5 from "md5";
import {newsRepository} from "./newsRepository.js";
import {friendsRepository} from "./friendsRepository.js";
export const userRepository = {
    getUserFromEmail(email){
        return database.getDatabaseObject("users", email)
    },
    createUser(email, login, password){
        database.setDatabaseObject("users", email, {
                "userInfo": {
                    "userMail": email,
                    "userLogin": login,
                    "userPassword": password,
                    "userId": Date.now(),
                },
                "avatar": null
            }
        )
    },
    createUserSession(email){
        const sessionObject = {
            "email":email,
            "createAt":Date.now()
        }
        const sessionId = md5(String(Date.now()))
        database.setDatabaseObject("sessions", sessionId, sessionObject)
        return sessionId
    },
    getUserFromSession(id){
        const sessionObject = database.getDatabaseObject("sessions", id)
        if (sessionObject != undefined){
            const user = userRepository.getUserFromEmail(sessionObject.email)
            return user
        }
        return undefined
    },
    getUserAvatar(usermail, destination, filename){
        try {
            const user = userRepository.getUserFromEmail(usermail)
            user.avatar = `${destination}` + `/` + `${filename}`
            database.setDatabaseObject("users", usermail, user)
        } catch (e){
            console.log(e)
        }
    },
    userStatisticCounter(email){
        try {
            const post = newsRepository.getDatabaseNewsListFromUser(email)
            const friends = friendsRepository.getDatabasefriendsListFromUser(email)
            let postUser = post == undefined ? 0 : post.length
            let friendCount = friends == undefined ? 0 : friends.length
            return {"postUser": postUser, "friendCount": friendCount}
        } catch (e) {

        }
    },
    changeUserData(usermail, userMail, userLogin, userPassword) {
        const user = userRepository.getUserFromEmail(usermail);
        if (userMail) {
            user.userInfo.userMail = userMail;
        }
        if (userLogin) {
            user.userInfo.userLogin = userLogin;
        }
        if (userPassword) {
            user.userInfo.userPassword = userPassword;
        }
        database.setDatabaseObject("users", userMail || usermail, user);
    }
}