//импортируем репозитории
import {userRepository} from "../repository/userRepository.js";
import {newsRepository} from "../repository/newsRepository.js";

//создание новостей
let createNews = async (req, res) => {
    try {
        const {caption, url} = req.body;
        const user = userRepository.getUserFromSession(req.session.usertoken)

        // Проверяем на пустые поля
        if (!caption || !url) {
            return res.json({
                status: "error",
                message: "А поля заполнять за вас будет разраб, да? =)"
            })
        }

        if (!user) {
            return res.json({
                status: "sessionFail",
                message: "Нужна авторизация"
            })
        }

        //добавляем новость
        newsRepository.createPostsFromUser(user.userInfo.userMail, user.userInfo.userLogin, caption, url)
        res.json({
            status:"ok",
            message:"it's fine"
        })

    } catch (e) {
        console.log(e)
    }
}
export default createNews