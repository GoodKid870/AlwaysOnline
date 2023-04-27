//импортируем модули
import * as path from "path";
import * as fs from "fs";

//работа с базой данных

class Database {

        //мы берем какой-то обьект из базы данных с которым хотим работать
        public static GetDatabaseObject(type, id){
            try {
                const data: string = fs.readFileSync(`./server/database/${type}/${id}.json`, "utf-8")
                return JSON.parse(data)
            } catch (e) {
                return undefined
            }
        }

        //мы создаем какой-то обьект в базе данных с которым хотим работать
        public static SetDatabaseObject(type, id, object){
            try {
                fs.writeFileSync(`./server/database/${type}/${id}.json`, JSON.stringify(object, null, 2));
            } catch (e) {
                console.log(e)
            }
        }

        //мы берем всех пользователей из базы данных с которым хотим работать
        public static GetAllDatabaseUsers(currentUser) {
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
        }

        //мы берем сообщения из базы данных с которым хотим работать
        public static GetDatabaseMessageObject(type, id){
            try {
                const data = fs.readFileSync(`./server/database/${type}/${id}.json`, "utf-8")
                return JSON.parse(data)
            } catch (e) {
                return undefined
            }
        }

        //мы создаем сообщения в базе данных с которым хотим работать
        public static SetDatabaseMessageObjects(type, filename, object){
            try {
                fs.writeFileSync(`./server/database/${type}/${filename}.json`, JSON.stringify(object, null, 2));
            } catch (e) {
                console.log(e)
            }
        }

        //мы меняем пользователя в базе данных
         public static ChangeDatabaseUser(type, filename, newUserMail){
            try {
                fs.renameSync(`./server/database/${type}/${filename}.json`, `./server/database/${type}/${newUserMail}.json` )
            } catch (e) {
                console.log(e)
            }

        }
}

export default Database
