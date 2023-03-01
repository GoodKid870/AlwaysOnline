//импортируем репозитории
import {userRepository} from "../repository/userRepository.js";
import {newsRepository} from "../repository/newsRepository.js";
//показываем новости
let showNews = async (req, res) => {
    try {
        //да-да опять сессия
        const user = userRepository.getUserFromSession(req.session.usertoken)
        if (user == undefined){
            return res.json({
                status: "sessionFail",
                message: "Нужна повторная авторизация"
            })
        }
        //рендерим страницу с постами
        const posts = newsRepository.getDatabaseNewsListFromUser(user.userInfo.userMail)
        res.render("pages/Posts", { news: posts, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar});
    } catch (e) {
        console.log(e)
    }


};

export default showNews
