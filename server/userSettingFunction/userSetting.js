//импортируем репозитории
import {userRepository} from "../repository/userRepository.js";
import {database} from "../repository/database.js";
import {newsRepository} from "../repository/newsRepository.js";
import {messageRepository} from "../repository/messageRepository.js";
import {friendsRepository} from "../repository/friendsRepository.js";

//меняем пользовательские настройки
let userSetting = async (req, res) => {
    try {
        const { userMail, userLogin, userPassword } = req.body;
        const user = userRepository.getUserFromSession(req.session.usertoken);
        if (user == undefined) {
            return res.json({
                status: "sessionFail",
                message: "Повторная авторизация"
            })
        }
        if (userRepository.getUserFromEmail(userMail) == undefined){
            if ((userMail && userMail !== "") && (userPassword && userPassword !== "") && (userLogin && userLogin !== "")) {
                // Пользователь указал электронную почту, логин и пароль
                database.changeDatabaseUser("users", user.userInfo.userMail, userMail);
                userRepository.changeUserData(userMail, userMail, userLogin, userPassword);
                newsRepository.changeNewsData(userMail, user.userInfo.userLogin, userLogin);
                friendsRepository.changeFriendsData(userMail, userLogin, userMail);
                messageRepository.changeUserMessageData(userMail, user.userInfo.userLogin, userLogin);
                return res.json({
                    status:"succm",
                    message:"Вы сменили свои данные!"
                })
            } else if ((userMail && userMail !== "") && (userPassword && userPassword !== "")) {
                // Пользователь указал электронную почту и пароль
                database.changeDatabaseUser("users", user.userInfo.userMail, userMail);
                userRepository.changeUserData(userMail, userMail, user.userInfo.userLogin, userPassword);
                friendsRepository.changeFriendsData(userMail, user.userInfo.userLogin, userMail);
                return res.json({
                    status:"succm",
                    message:"Вы сменили свои данные!"
                })
            } else if ((userMail && userMail !== "") && (userLogin && userLogin !== "")) {
                // Пользователь указал электронную почту и логин
                database.changeDatabaseUser("users", user.userInfo.userMail, userMail);
                userRepository.changeUserData(userMail, userMail, userLogin, user.userInfo.userPassword);
                newsRepository.changeNewsData(userMail, user.userInfo.userLogin, userLogin);
                friendsRepository.changeFriendsData(userMail, userLogin, userMail);
                messageRepository.changeUserMessageData(userMail, user.userInfo.userLogin, userLogin);
                return res.json({
                    status:"succm",
                    message:"Вы сменили свои данные!"
                })
            } else if ((userLogin && userLogin !== "") && (userPassword && userPassword !== "")) {
                // Пользователь указал логин и пароль
                userRepository.changeUserData(user.userInfo.userMail, user.userInfo.userMail, userLogin, userPassword);
                return res.json({
                    status:"succm",
                    message:"Вы сменили свои данные!"
                })
            } else if (userMail && userMail !== "") {
                // Пользователь указал только электронную почту
                database.changeDatabaseUser("users", user.userInfo.userMail, userMail);
                userRepository.changeUserData(userMail, userMail, user.userInfo.userLogin, user.userInfo.userPassword);
                friendsRepository.changeFriendsData(userMail, user.userInfo.userLogin, userMail);
                return res.json({
                    status:"succm",
                    message:"Вы сменили свои данные!"
                })
            } else if (userLogin && userLogin !== "") {
                // Пользователь указал только логин
                userRepository.changeUserData(user.userInfo.userMail, user.userInfo.userMail, userLogin, user.userInfo.userPassword);
                newsRepository.changeNewsData(user.userInfo.userMail, user.userInfo.userLogin, userLogin);
                friendsRepository.changeFriendsData(user.userInfo.userMail, userLogin, user.userInfo.userMail);
                messageRepository.changeUserMessageData(user.userInfo.userMail, user.userInfo.userLogin, userLogin);
                return res.json({
                    status:"succ",
                    message:"Вы сменили свои данные!"
                })
            } else if (userPassword && userPassword !== "") {
                // Пользователь указал только пароль
                userRepository.changeUserData(user.userInfo.userMail, user.userInfo.userMail, user.userInfo.userLogin, userPassword);
                return res.json({
                    status:"succ",
                    message:"Вы сменили свои данные!"
                })
            } else {
                // Ни одно из полей не было заполнено
                return res.json({
                    status:"err",
                    message:"Поля будет заполнять разраб, да?"
                })
            }
        } else {
            return res.json({
                status:"err",
                message:"Такой пользователь уже есть =("
            })
        }

    } catch (e) {
        console.log(e);
    }
};
export default userSetting