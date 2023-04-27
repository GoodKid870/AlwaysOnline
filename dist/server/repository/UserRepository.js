import md5 from "md5";
import database from "./Database.js";
import Database from "./Database.js";
import FriendsRepository from "./FriendsRepository.js";
import NewsRepository from "./NewsRepository.js";
class UserRepository {
    static GetUserFromEmail(email) {
        return Database.GetDatabaseObject("users", email);
    }
    static CreateUser(email, login, password) {
        Database.SetDatabaseObject("users", email, {
            "userInfo": {
                "userMail": email,
                "userLogin": login,
                "userPassword": password,
                "userId": Date.now(),
            },
            "avatar": null
        });
    }
    static CreateUserSession(email) {
        const sessionObject = {
            "email": email,
            "createAt": Date.now()
        };
        const sessionId = md5(String(Date.now()));
        Database.SetDatabaseObject("sessions", sessionId, sessionObject);
        return sessionId;
    }
    static GetUserFromSession(id) {
        const sessionObject = database.GetDatabaseObject("sessions", id);
        if (sessionObject != undefined) {
            const user = UserRepository.GetUserFromEmail(sessionObject.email);
            return user;
        }
        return undefined;
    }
    static GetUserAvatar(usermail, destination, filename) {
        try {
            const user = UserRepository.GetUserFromEmail(usermail);
            user.avatar = `${destination}` + `/` + `${filename}`;
            Database.SetDatabaseObject("users", usermail, user);
        }
        catch (e) {
            console.log(e);
        }
    }
    static UserStatisticCounter(email) {
        try {
            const post = NewsRepository.GetDatabaseNewsListFromUser(email);
            const friends = FriendsRepository.GetDatabasefriendsListFromUser(email);
            let postUser = post == undefined ? 0 : post.length;
            let friendCount = friends == undefined ? 0 : friends.length;
            return { "postUser": postUser, "friendCount": friendCount };
        }
        catch (e) {
        }
    }
    static ChangeUserData(usermail, userMail, userLogin, userPassword) {
        const user = UserRepository.GetUserFromEmail(usermail);
        if (userMail) {
            user.userInfo.userMail = userMail;
        }
        if (userLogin) {
            user.userInfo.userLogin = userLogin;
        }
        if (userPassword) {
            user.userInfo.userPassword = userPassword;
        }
        Database.SetDatabaseObject("users", userMail || usermail, user);
    }
}
export default UserRepository;
