import FriendsRepository from "../repository/FriendsRepository.js";
import UserRepository from "../repository/UserRepository.js";
class FriendsHandler {
    static async AddFriend(req, res) {
        const { username, email, userId, avatar } = req.body;
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
            }
            catch (e) {
                console.log(e);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    ;
    static async DeleteFriend(req, res) {
        try {
            const { friendMail, friendId } = req.body;
            const user = UserRepository.GetUserFromSession(req.session.usertoken);
            if (user == undefined) {
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                });
            }
            FriendsRepository.DeleteSomeFriend(user.userInfo.userMail, user.userInfo.userId, friendMail, friendId);
            return res.json({
                status: "succ",
                message: "Вы удалили друга"
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    static async ShowFriends(req, res) {
        try {
            const user = UserRepository.GetUserFromSession(req.session.usertoken);
            if (user == undefined) {
                return res.json({
                    status: "sessionFail",
                    message: "Повторная авторизация"
                });
            }
            const friends = FriendsRepository.GetDatabasefriendsListFromUser(user.userInfo.userMail);
            res.render("pages/Friends", { friends: friends, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar });
        }
        catch (e) {
            console.log(e);
        }
    }
}
export default FriendsHandler;
