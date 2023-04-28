import { Response } from "express";
import CustomRequest from "../Repository/Interfaces/CustomRequest";
import {IAddFriend} from "../Repository/Interfaces/IAddFriend";
import IDeleteFriend from "../Repository/Interfaces/IDeleteFriend";
import FriendsRepository from "../Repository/FriendsRepository";
import UserRepository from "../Repository/UserRepository";
import webManager from "../Repository/WebManager";
import { CONST_ERROR_RESPONSE_ALREADY_HAVE_FRIEND, CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER } from "../Repository/Interfaces/ErrorResponsList";

class FriendsHandler {
    public static async AddFriend (req: CustomRequest, res: Response) {
        const {username, email, userId, avatar}: IAddFriend = req.body;
        try {
            try {
                const user = UserRepository.GetUserFromSession(req.session.usertoken);
                if (user == undefined) {
                    webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                }

                if (FriendsRepository.HasFriend(user.userInfo.userMail, userId)) {
                    webManager.SendErrorResponse(CONST_ERROR_RESPONSE_ALREADY_HAVE_FRIEND, res);
                }

                FriendsRepository.AddSomeFriend(user.userInfo.userMail, username, email, userId, avatar);
                res.json({
                    status: "success",
                    message: "Друг добавлен",
                });
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    };

    public static async DeleteFriend(req: CustomRequest, res: Response){
        try {
            const {friendMail, friendId}: IDeleteFriend  = req.body
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
            }
            FriendsRepository.DeleteSomeFriend(user.userInfo.userMail, user.userInfo.userId, friendMail, friendId)
            return res.json({
                status: "succ",
                message: "Вы удалили друга"
            })
        } catch (e) {
            console.log(e)
        }
    }

    public static async ShowFriends(req: CustomRequest, res: Response){
        try {
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
            }

            const friends = FriendsRepository.GetDatabasefriendsListFromUser(user.userInfo.userMail)
            res.render("pages/Friends", { friends: friends, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar});
        } catch (e) {
            console.log(e)
        }
    }

}

export default FriendsHandler
