//авторизация
import {userRepository} from "../repository/userRepository.js";

let authorize = async (req, res) => {
    //берем наш рек и чутка делаем его удобнее
    const {userMail, userPassword} = req.body
    try {
        //проверяем нашего юзера на момент существования
        let user = userRepository.getUserFromEmail(userMail)
        if (user == undefined){
            return res.json({
                status: "fail",
                message: "Пользоваетль не найден"
            })
        }

        //если авторизовался
        if (userPassword != user.userInfo.userPassword){
            return res.json({
                status: "fail",
                message: "Логин или пароль неправильный"
            })
        }
        //создаем сессию и пихаем туда всяко разное
        const userToken = userRepository.createUserSession(user.userInfo.userMail)
        req.session.userId = user.userInfo.userId
        req.session.authorized = true
        req.session.usertoken = userToken
        res.json({
            status: "success",
            message: "Login successfully",
            sessionUser: userToken
        });
    } catch (e) {
        console.log(e)
    }
}

export default authorize

