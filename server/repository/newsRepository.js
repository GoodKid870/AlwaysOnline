import {database} from "./database.js";
import {userRepository} from "./userRepository.js";
export const newsRepository = {
    getDatabaseNews(id){
        try {
            const news = database.getDatabaseObject("news", id)
            return news
        } catch (e) {
            return undefined
        }
    },

    getDatabaseNewsListFromUser(userMail){
        const user = userRepository.getUserFromEmail(userMail)
        const posts = []
        if (user != undefined && 'posts' in user){
            for (const newsId of user.posts){
                const news = newsRepository.getDatabaseNews(newsId.postId)
                if (news != undefined){
                    posts.push(news)
                }
            }
        }
        return posts
    },

    createPostsFromUser(usermail, username, description, postURL){
        try {
            const user = userRepository.getUserFromEmail(usermail)
            if (user.posts != undefined){
                const post = {"posts": {"username": username, "description": description, "postURL": postURL, "postId": Date.now()}}
                user.posts.push({"postId": Date.now()})
                database.setDatabaseObject("users", usermail, user)
                database.setDatabaseObject("news", Date.now(), post)
            } else {
                const news = {"posts": {"username": username, "description": description, "postURL": postURL, "postId": Date.now()}}
                user.posts = [{"postId": Date.now()}]
                database.setDatabaseObject("news", Date.now(), news)
                database.setDatabaseObject("users", usermail, user)
            }
        }
        catch (c) {
            console.log(c)
        }
    },

    changeNewsData(usermail, username, newusername) {
        try {
            const user = userRepository.getUserFromEmail(usermail);
            if (user != undefined && 'posts' in user) {
                for (const newsId of user.posts) {
                    const news = newsRepository.getDatabaseNews(newsId.postId);
                    if (news != undefined) {
                        if (news.posts.username === username) {
                            news.posts.username = newusername;
                        }
                        database.setDatabaseObject("news", newsId.postId, news);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}