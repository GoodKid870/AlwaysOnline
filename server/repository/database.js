//импортируем модули
import fs from "fs"
import path from "path";

//работа с базой данных
export const database = {
    //мы берем какой-то обьект из базы данных с которым хотим работать
    getDatabaseObject(type, id){
        try {
            const data = fs.readFileSync(`./server/database/${type}/${id}.json`, "utf-8")
            return JSON.parse(data)
        } catch (e) {
            return undefined
        }
    },

    //мы создаем какой-то обьект в базе данных с которым хотим работать
    setDatabaseObject(type, id, object){
       try {
           fs.writeFileSync(`./server/database/${type}/${id}.json`, JSON.stringify(object, null, 2));
       } catch (e) {
           console.log(e)
       }
    },

    //мы берем всех пользователей из базы данных с которым хотим работать
    getAllDatabaseUsers(currentUser) {
        try {
            const files = fs.readdirSync('./server/database/users/');
            const users = files.map((file) => {
                const filePath = path.join('./server/database/users/', file);
                const data = fs.readFileSync(filePath, 'utf8');
                const { userInfo, avatar } = JSON.parse(data);
                return { userInfo, avatar };
            });
            return users.filter((user) => user.userInfo.userMail !== currentUser);
        } catch (e) {
            console.log(e);
        }
    },

    //мы берем сообщения из базы данных с которым хотим работать
    getDatabaseMessageObject(type, id){
        try {
            const data = fs.readFileSync(`./server/database/${type}/${id}.json`, "utf-8")
            return JSON.parse(data)
        } catch (e) {
            return undefined
        }
    },

    //мы создаем сообщения в базе данных с которым хотим работать
    setDatabaseMessageObjects(type, filename, object){
        try {
            fs.writeFileSync(`./server/database/${type}/${filename}.json`, JSON.stringify(object, null, 2));
        } catch (e) {
            console.log(e)
        }
    },

    //мы меняем пользователя в базе данных
    changeDatabaseUser(type, filename, newUserMail){
        try {
            fs.renameSync(`./server/database/${type}/${filename}.json`, `./server/database/${type}/${newUserMail}.json` )
        } catch (e) {
            console.log(e)
        }

    }
}