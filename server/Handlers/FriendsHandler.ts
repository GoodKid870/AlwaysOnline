import { Response } from "express";
import CustomRequest from "../repository/Interfaces/CustomRequest";
import {IAddFriend} from "../repository/Interfaces/IAddFriend";
import IDeleteFriend from "../repository/Interfaces/IDeleteFriend";
import FriendsRepository from "../repository/FriendsRepository";
import UserRepository from "../repository/UserRepository";

class FriendsHandler {
    public static async AddFriend (req: CustomRequest, res: Response) {
        const {username, email, userId, avatar}: IAddFriend = req.body;
        try {
            try {
                const user = UserRepository.GetUserFromSession(req.session.usertoken);
                if (user == undefined) {
                    return res.json({
                        status: "sessionFail",
                        message: "Повторная авторизация",
                    });
                }

                if (FriendsRepository.HasFriend(user.userInfo.userMail, userId)) {
                    return res.json({
                        status: "fail",
                        message: "У тебя уже есть он в друзьях",
                    });
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
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                })
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
                return res.json({
                    status: "sessionFail",
                    message: "Повторная авторизация"
                })
            }

            const friends = FriendsRepository.GetDatabasefriendsListFromUser(user.userInfo.userMail)
            res.render("pages/Friends", { friends: friends, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar});
        } catch (e) {
            console.log(e)
        }
    }

}

export default FriendsHandler
