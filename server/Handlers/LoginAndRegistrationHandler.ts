import CustomRequest from "../Repository/Interfaces/CustomRequest";
import {RequestBodyLogin} from "../Repository/Interfaces/RequestBodyLogin";
import { Response } from "express";
import {
    CONST_ERROR_RESPONSE_EMPTY_FILLS,
    CONST_ERROR_RESPONSE_INVALID_PASSWORD, CONST_ERROR_RESPONSE_USER_EXIST,
    CONST_ERROR_RESPONSE_USER_NOT_EXIST
} from "../Repository/Interfaces/ErrorResponsList";
import {RequestRegistrationBody} from "../Repository/Interfaces/RequestRegistrationBody";
import WebManager from "../Repository/WebManager";
import UserRepository from "../Repository/UserRepository";


class LoginAndRegistrationHandler {
    public static async UserAuthorized(req: CustomRequest, res: Response) {
        //берем наш рек и чутка делаем его удобнее
        const { userMail, userPassword }: RequestBodyLogin = req.body;
        try {

            if (userMail == undefined && userPassword == undefined){
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_EMPTY_FILLS, res);
                return;
            }

            //проверяем нашего юзера на момент существования
            let user = UserRepository.GetUserFromEmail(userMail);
            if (user == undefined) {
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_USER_NOT_EXIST, res);
                return;
            }

            //если авторизовался
            if (userPassword != user.userInfo.userPassword) {
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_INVALID_PASSWORD, res)
                return;
            }
            //создаем сессию и пихаем туда всяко разное
            const userToken = UserRepository.CreateUserSession(user.userInfo.userMail);
            req.session.userId = user.userInfo.userId;
            req.session.authorized = true;
            req.session.usertoken = userToken;
            res.json({
                status: "success",
                message: "Login successfully",
                sessionUser: userToken,
            });
        } catch (e) {
            console.log(e);
        }
    };

    public static async UserRegistration(req: CustomRequest, res: Response) {
        const {userMail, userPassword, userLogin}: RequestRegistrationBody = req.body
        try {
            //если пользователь не заполнил одно из полей
            if ((userMail == '' || userPassword == '' || userMail == '')) {
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_EMPTY_FILLS, res);
                return;
            }
            //проверяем существует наш пользователь уже и если все гут создаем пользователя
            const user = UserRepository.GetUserFromEmail(userMail)
            if (user == undefined){
                UserRepository.CreateUser(userMail, userLogin, userPassword)
                res.json({
                    status:"success",
                    message:"Добро пожаловать в AlwaysOnline"
                })
            } else {
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_USER_EXIST, res);
                return;
            }
        } catch (e) {
            console.log(e)
        }
    };
}

export default LoginAndRegistrationHandler