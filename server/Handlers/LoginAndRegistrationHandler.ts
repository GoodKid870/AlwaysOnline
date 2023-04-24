import CustomRequest from "../repository/Interfaces/CustomRequest";
import {RequestBodyLogin} from "../repository/Interfaces/RequestBodyLogin";
import { Response } from "express";
import webManager from "../repository/WebManager";
import {
    CONST_ERROR_RESPONSE_EMPTY_FILLS,
    CONST_ERROR_RESPONSE_INVALID_PASSWORD, CONST_ERROR_RESPONSE_USER_EXIST,
    CONST_ERROR_RESPONSE_USER_NOT_EXIST
} from "../repository/Interfaces/ErrorResponsList";
import {RequestRegistrationBody} from "../repository/Interfaces/RequestRegistrationBody";
import WebManager from "../repository/WebManager";
import UserRepository from "../repository/UserRepository";


class LoginAndRegistrationHandler {
    public static async UserAuthorized(req: CustomRequest, res: Response) {
        //берем наш рек и чутка делаем его удобнее
        const { userMail, userPassword }: RequestBodyLogin = req.body;
        try {
            //проверяем нашего юзера на момент существования
            let user = UserRepository.GetUserFromEmail(userMail);
            if (user == undefined) {
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_USER_NOT_EXIST, res)
                return;
            }

            //если авторизовался
            if (userPassword != user.userInfo.userPassword) {
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_INVALID_PASSWORD, res)
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