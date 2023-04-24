import CustomRequest from "../repository/Interfaces/CustomRequest";
import { Response } from "express";
import FriendsRepository from "../repository/FriendsRepository";
import UserRepository from "../repository/UserRepository";
import Database from "../repository/Database";

class MessageHandler {
    public static RenderAndReadMessage(req: CustomRequest, res: Response) {
        try {
            //проверяем сессию на предмет юзера
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                })
            }
            //если пользователь заходит на эту страницу все уведомления чистятся, если они есть
            const friends = FriendsRepository.GetDatabasefriendsListFromUser(user.userInfo.userMail)
            if (user.unreadMessages != undefined){
                delete user.unreadMessages
                Database.SetDatabaseObject("users", user.userInfo.userMail, user)
            }
            //далее просто заходит на вкладку сообщения
            res.render("pages/messages", { friends: friends, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar});
        } catch (e) {
            console.log(e)
        }
    }
}

export default MessageHandler