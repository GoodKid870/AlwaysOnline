import webManager from "../repository/WebManager.js";
import { CONST_ERROR_RESPONSE_EMPTY_FILLS, CONST_ERROR_RESPONSE_INVALID_PASSWORD, CONST_ERROR_RESPONSE_USER_EXIST, CONST_ERROR_RESPONSE_USER_NOT_EXIST } from "../repository/Interfaces/ErrorResponsList.js";
import WebManager from "../repository/WebManager.js";
import UserRepository from "../repository/UserRepository.js";
class LoginAndRegistrationHandler {
    static async UserAuthorized(req, res) {
        //берем наш рек и чутка делаем его удобнее
        const { userMail, userPassword } = req.body;
        try {
            //проверяем нашего юзера на момент существования
            let user = UserRepository.GetUserFromEmail(userMail);
            if (user == undefined) {
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_USER_NOT_EXIST, res);
                return;
            }
            //если авторизовался
            if (userPassword != user.userInfo.userPassword) {
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_INVALID_PASSWORD, res);
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
        }
        catch (e) {
            console.log(e);
        }
    }
    ;
    static async UserRegistration(req, res) {
        const { userMail, userPassword, userLogin } = req.body;
        try {
            //если пользователь не заполнил одно из полей
            if ((userMail == '' || userPassword == '' || userMail == '')) {
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_EMPTY_FILLS, res);
                return;
            }
            //проверяем существует наш пользователь уже и если все гут создаем пользователя
            const user = UserRepository.GetUserFromEmail(userMail);
            if (user == undefined) {
                UserRepository.CreateUser(userMail, userLogin, userPassword);
                res.json({
                    status: "success",
                    message: "Добро пожаловать в AlwaysOnline"
                });
            }
            else {
                WebManager.SendErrorResponse(CONST_ERROR_RESPONSE_USER_EXIST, res);
                return;
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    ;
}
export default LoginAndRegistrationHandler;
