//импортируем репозитории
import {userRepository} from "../repository/userRepository.js";
import {friendsRepository} from "../repository/friendsRepository.js";
//показываем друзей
let showFriends = async (req, res) => {
    try {
        //сессия все дела
        const user = userRepository.getUserFromSession(req.session.usertoken)
        if (user == undefined){
            return res.json({
                status: "sessionFail",
                message: "Повторная авторизация"
            })
        }
        //рендерим страницу с друзьями
        const friends = friendsRepository.getDatabasefriendsListFromUser(user.userInfo.userMail)
        res.render("pages/Friends", { friends: friends, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar});
    } catch (e) {
        console.log(e)
    }


};

export default showFriends
