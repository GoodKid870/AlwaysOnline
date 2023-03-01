//импортируем репозиторий
import {userRepository} from "../repository/userRepository.js";

//регистрация
let registration = async (req, res) => {
    const {userMail, userPassword, userLogin} = req.body
    try {
        //если пользователь не заполнил одно из полей
        if ((userMail == '' || userPassword == '' || userMail == '')) {
            return res.json({
                status:"err",
                message:"Забыл форму заполнить =)"
            })
        }

        //проверяем существует наш пользователь уже и если все гут создаем пользователя
        const user = userRepository.getUserFromEmail(userMail)
        if (user == undefined){
            userRepository.createUser(userMail, userLogin, userPassword)
            res.json({
                status:"success",
                message:"Добро пожаловать в AlwaysOnline"
            })
        } else {
            return res.json({
                status:"err",
                message:"Такой пользователь уже есть =("
            })
        }
    } catch (e) {
        console.log(e)
    }

};

export default registration;

