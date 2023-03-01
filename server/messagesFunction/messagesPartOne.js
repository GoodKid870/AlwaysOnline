//импортируем репозитории
import {userRepository} from "../repository/userRepository.js";
import {friendsRepository} from "../repository/friendsRepository.js";
import {database} from "../repository/database.js";

//сообщения от каждого юзера
let messagesPartOne = async (req, res) => {
    try {
        //проверяем сессию на предмет юзера
        const user = userRepository.getUserFromSession(req.session.usertoken)
        if (user == undefined){
            return res.json({
                status: "sessionFail",
                message: "Нужна повторная авторизация"
            })
        }
        //если пользователь заходит на эту страницу все уведомления чистятся, если они есть
        const friends = friendsRepository.getDatabasefriendsListFromUser(user.userInfo.userMail)
        if (user.unreadMessages != undefined){
            delete user.unreadMessages
            database.setDatabaseObject("users", user.userInfo.userMail, user)
        }
        //далее просто заходит на вкладку сообщения
        res.render("pages/messages", { friends: friends, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar});
    } catch (e) {
        console.log(e)
    }
};

export default messagesPartOne