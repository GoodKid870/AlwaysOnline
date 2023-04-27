import CustomRequest from "../Repository/Interfaces/CustomRequest";
import { Response } from "express";
import FriendsRepository from "../Repository/FriendsRepository";
import UserRepository from "../Repository/UserRepository";
import Database from "../Repository/Database";
import webManager from "../Repository/WebManager";
import {CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER} from "../Repository/Interfaces/ErrorResponsList";

class MessageHandler {
    public static RenderAndReadMessage(req: CustomRequest, res: Response) {
        try {
            //проверяем сессию на предмет юзера
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
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