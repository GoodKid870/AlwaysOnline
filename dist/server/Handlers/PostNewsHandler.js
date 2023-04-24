import NewsRepository from "../repository/NewsRepository.js";
import UserRepository from "../repository/UserRepository.js";
class PostNewsHandler {
    static async CreateNews(req, res) {
        try {
            const { caption, url } = req.body;
            const user = UserRepository.GetUserFromSession(req.session.usertoken);
            // Проверяем на пустые поля
            if (!caption || !url) {
                return res.json({
                    status: "error",
                    message: "А поля заполнять за вас будет разраб, да? =)"
                });
            }
            if (!user) {
                return res.json({
                    status: "sessionFail",
                    message: "Нужна авторизация"
                });
            }
            //добавляем новость
            NewsRepository.CreatePostsFromUser(user.userInfo.userMail, user.userInfo.userLogin, caption, url);
            res.json({
                status: "ok",
                message: "it's fine"
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    static async ShowNews(req, res) {
        try {
            //да-да опять сессия
            const user = UserRepository.GetUserFromSession(req.session.usertoken);
            if (user == undefined) {
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                });
            }
            //рендерим страницу с постами
            const posts = NewsRepository.GetDatabaseNewsListFromUser(user.userInfo.userMail);
            res.render("pages/Posts", { news: posts, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar });
        }
        catch (e) {
            console.log(e);
        }
    }
}
export default PostNewsHandler;
