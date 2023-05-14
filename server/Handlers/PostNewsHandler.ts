//импортируем репозитории
import CustomRequest from "../Repository/Interfaces/CustomRequest";
import {IUserNews} from "../Repository/Interfaces/IUserNews";
import { Response } from "express";
import NewsRepository from "../Repository/NewsRepository";
import UserRepository from "../Repository/UserRepository";
import WebManager from "../Repository/WebManager";
import {
    CONST_ERROR_RESPONSE_EMPTY_FILLS,
    CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER
} from "../Repository/Interfaces/ErrorResponsList";



class PostNewsHandler {
    public static async CreateNews (req: CustomRequest, res: Response)  {
        try {
            const {caption, url}: IUserNews = req.body;
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            // Проверяем на пустые поля
            if (!caption || !url) {
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_EMPTY_FILLS, res);
                return;
            }

            if (!user) {
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
            }
            //добавляем новость
            NewsRepository.CreatePostsFromUser(user.userInfo.userMail, user.userInfo.userLogin, caption, url)
            res.json({
                status:"ok",
                message:"it's fine"
            })
        } catch (e) {
            console.log(e)

        }
    }

    public static async ShowNews (req: CustomRequest, res: Response) {
        try {
            //да-да опять сессия
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
            }
            //рендерим страницу с постами
            const posts = NewsRepository.GetDatabaseNewsListFromUser(user.userInfo.userMail)
            res.render("pages/Posts", { news: posts, mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar});
        } catch (e) {
            console.log(e)
        }
    }
}

export default PostNewsHandler

