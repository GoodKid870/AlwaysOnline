//импортируем репозитории
import {userRepository} from "../repository/userRepository.js";
import {friendsRepository} from "../repository/friendsRepository.js";

//добавление друзей
let addFriend = async (req, res) => {
    const {username, email, userId, avatar} = req.body
    try {
        try {
            //проверяем сессию
            const user = userRepository.getUserFromSession(req.session.usertoken)
            if (user == undefined) {
                return res.json({
                    status: "sessionFail",
                    message: "Повторная авторизация"
                })
            }
            //проверяем, не является ли пользователь уже другом
            if (friendsRepository.hasFriend(user.userInfo.userMail, userId)) {
                return res.json({
                    status: "fail",
                    message: "У тебя уже есть он в друзьях"
                })
            }
            //если все гуд добавляем друга
            friendsRepository.addSomeFriend(user.userInfo.userMail, username, email, userId, avatar)
            res.json({
                status: "success",
                message: "Друг добавлен"
            })
        } catch (e) {
            console.log(e)
        }
    } catch (e) {
        console.log(e)
    }
}


export default addFriend