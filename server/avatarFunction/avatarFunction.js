//импортируем репозиторий
import {userRepository} from "../repository/userRepository.js";
import {messageRepository} from "../repository/messageRepository.js";
import {friendsRepository} from "../repository/friendsRepository.js";

//смена аватарки
let userAvatar = async (req, res) => {
    try {
        const {destination, filename} = req.file;
        const user = userRepository.getUserFromSession(req.session.usertoken)

        if (user == undefined) {
            return res.json({
                status: "sessionFail",
                message: "Повторная авторизация"
            })
        }

        if ((user == undefined ) || (filename == '') || (destination == '') || (req.file == undefined)){
            return res.json({
                status: "error",
                message: "Isn't User"
            })
        }
        //меняем аватарку
        userRepository.getUserAvatar(user.userInfo.userMail, destination, filename)
        messageRepository.changeUserMessageAvatar(user.userInfo.userMail, user.userInfo.userLogin, `${destination}` + `/` + `${filename}`)
        friendsRepository.changeFriendAvatar(user.userInfo.userMail, user.userInfo.userLogin, `${destination}` + `/` + `${filename}`)
        res.redirect("/profile")
    }
    catch (e) {
        console.log(e)
    }
}

export default userAvatar