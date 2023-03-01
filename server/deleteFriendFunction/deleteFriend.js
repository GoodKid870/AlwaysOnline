import {userRepository} from "../repository/userRepository.js";
import {friendsRepository} from "../repository/friendsRepository.js";

let deleteFriend = async(req, res) => {
    try {
        const {friendMail, friendId} = req.body
        //сессия все дела
        const user = userRepository.getUserFromSession(req.session.usertoken)
        if (user == undefined){
            return res.json({
                status: "sessionFail",
                message: "Нужна повторная авторизация"
            })
        }
        friendsRepository.deleteSomeFriend(user.userInfo.userMail, user.userInfo.userId, friendMail, friendId)
        return res.json({
            status: "succ",
            message: "Вы удалили друга"
        })
    } catch (e) {
        console.log(e)
    }
}

export default deleteFriend