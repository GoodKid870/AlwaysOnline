import NewsRepository from "../repository/NewsRepository.js";
import FriendsRepository from "../repository/FriendsRepository.js";
import UserRepository from "../repository/UserRepository.js";
import Database from "../repository/Database.js";
import MessageRepository from "../repository/MessageRepository.js";
class UserProfileHandler {
    static async ChangeUserAvatar(req, res) {
        try {
            const { destination, filename } = req.file;
            const user = UserRepository.GetUserFromSession(req.session.usertoken);
            if (user == undefined) {
                return res.json({
                    status: "sessionFail",
                    message: "Повторная авторизация"
                });
            }
            if ((user == undefined) || (filename == '') || (destination == '') || (req.file == undefined)) {
                return res.json({
                    status: "error",
                    message: "Isn't User"
                });
            }
            //меняем аватарку
            UserRepository.GetUserAvatar(user.userInfo.userMail, destination, filename);
            MessageRepository.ChangeUserMessageAvatar(user.userInfo.userMail, user.userInfo.userLogin, `${destination}` + `/` + `${filename}`);
            FriendsRepository.ChangeFriendAvatar(user.userInfo.userMail, user.userInfo.userLogin, `${destination}` + `/` + `${filename}`);
            res.redirect("/profile");
        }
        catch (e) {
            console.log(e);
        }
    }
    static async ChangeUserNameData(req, res) {
        try {
            const { userMail, userLogin, userPassword } = req.body;
            const user = UserRepository.GetUserFromSession(req.session.usertoken);
            if (user == undefined) {
                return res.json({
                    status: "sessionFail",
                    message: "Повторная авторизация"
                });
            }
            if (UserRepository.GetUserFromEmail(userMail) == undefined) {
                if ((userMail && userMail !== "") && (userPassword && userPassword !== "") && (userLogin && userLogin !== "")) {
                    // Пользователь указал электронную почту, логин и пароль
                    Database.ChangeDatabaseUser("users", user.userInfo.userMail, userMail);
                    UserRepository.ChangeUserData(userMail, userMail, userLogin, userPassword);
                    NewsRepository.ChangeNewsData(userMail, user.userInfo.userLogin, userLogin);
                    FriendsRepository.ChangeFriendsData(userMail, userLogin, userMail);
                    MessageRepository.ChangeUserMessageData(userMail, user.userInfo.userLogin, userLogin);
                    return res.json({
                        status: "succm",
                        message: "Вы сменили свои данные!"
                    });
                }
                else if ((userMail && userMail !== "") && (userPassword && userPassword !== "")) {
                    // Пользователь указал электронную почту и пароль
                    Database.ChangeDatabaseUser("users", user.userInfo.userMail, userMail);
                    UserRepository.ChangeUserData(userMail, userMail, user.userInfo.userLogin, userPassword);
                    FriendsRepository.ChangeFriendsData(userMail, user.userInfo.userLogin, userMail);
                    return res.json({
                        status: "succm",
                        message: "Вы сменили свои данные!"
                    });
                }
                else if ((userMail && userMail !== "") && (userLogin && userLogin !== "")) {
                    // Пользователь указал электронную почту и логин
                    Database.ChangeDatabaseUser("users", user.userInfo.userMail, userMail);
                    UserRepository.ChangeUserData(userMail, userMail, userLogin, user.userInfo.userPassword);
                    NewsRepository.ChangeNewsData(userMail, user.userInfo.userLogin, userLogin);
                    FriendsRepository.ChangeFriendsData(userMail, userLogin, userMail);
                    MessageRepository.ChangeUserMessageData(userMail, user.userInfo.userLogin, userLogin);
                    return res.json({
                        status: "succm",
                        message: "Вы сменили свои данные!"
                    });
                }
                else if ((userLogin && userLogin !== "") && (userPassword && userPassword !== "")) {
                    // Пользователь указал логин и пароль
                    UserRepository.ChangeUserData(user.userInfo.userMail, user.userInfo.userMail, userLogin, userPassword);
                    return res.json({
                        status: "succm",
                        message: "Вы сменили свои данные!"
                    });
                }
                else if (userMail && userMail !== "") {
                    // Пользователь указал только электронную почту
                    Database.ChangeDatabaseUser("users", user.userInfo.userMail, userMail);
                    UserRepository.ChangeUserData(userMail, userMail, user.userInfo.userLogin, user.userInfo.userPassword);
                    FriendsRepository.ChangeFriendsData(userMail, user.userInfo.userLogin, userMail);
                    return res.json({
                        status: "succm",
                        message: "Вы сменили свои данные!"
                    });
                }
                else if (userLogin && userLogin !== "") {
                    // Пользователь указал только логин
                    UserRepository.ChangeUserData(user.userInfo.userMail, user.userInfo.userMail, userLogin, user.userInfo.userPassword);
                    NewsRepository.ChangeNewsData(user.userInfo.userMail, user.userInfo.userLogin, userLogin);
                    FriendsRepository.ChangeFriendsData(user.userInfo.userMail, userLogin, user.userInfo.userMail);
                    MessageRepository.ChangeUserMessageData(user.userInfo.userMail, user.userInfo.userLogin, userLogin);
                    return res.json({
                        status: "succ",
                        message: "Вы сменили свои данные!"
                    });
                }
                else if (userPassword && userPassword !== "") {
                    // Пользователь указал только пароль
                    UserRepository.ChangeUserData(user.userInfo.userMail, user.userInfo.userMail, user.userInfo.userLogin, userPassword);
                    return res.json({
                        status: "succ",
                        message: "Вы сменили свои данные!"
                    });
                }
                else {
                    // Ни одно из полей не было заполнено
                    return res.json({
                        status: "err",
                        message: "Поля будет заполнять разраб, да?"
                    });
                }
            }
            else {
                return res.json({
                    status: "err",
                    message: "Такой пользователь уже есть =("
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}
export default UserProfileHandler;
