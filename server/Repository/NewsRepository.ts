import Database from "./Database";
import UserRepository from "./UserRepository";


class NewsRepository {
    public static GetDatabaseNews(id){
        try {
            const news = Database.GetDatabaseObject("news", id)
            return news
        } catch (e) {
            return undefined
        }
    }

    public static GetDatabaseNewsListFromUser(userMail){
        const user = UserRepository.GetUserFromEmail(userMail)
        const posts = []
        if (user != undefined && 'posts' in user){
            for (const newsId of user.posts){
                const news = NewsRepository.GetDatabaseNews(newsId.postId)
                if (news != undefined){
                    posts.push(news)
                }
            }
        }
        return posts
    }

    public static CreatePostsFromUser(usermail, username, description, postURL){
        try {
            const user = UserRepository.GetUserFromEmail(usermail)
            if (user.posts != undefined){
                const post = {"posts": {"username": username, "description": description, "postURL": postURL, "postId": Date.now()}}
                user.posts.push({"postId": Date.now()})
                Database.SetDatabaseObject("users", usermail, user)
                Database.SetDatabaseObject("news", Date.now(), post)
            } else {
                const news = {"posts": {"username": username, "description": description, "postURL": postURL, "postId": Date.now()}}
                user.posts = [{"postId": Date.now()}]
                Database.SetDatabaseObject("news", Date.now(), news)
                Database.SetDatabaseObject("users", usermail, user)
            }
        }
        catch (c) {
            console.log(c)
        }
    }

    public static ChangeNewsData(usermail, username, newusername) {
        try {
            const user = UserRepository.GetUserFromEmail(usermail);
            if (user != undefined && 'posts' in user) {
                for (const newsId of user.posts) {
                    const news = NewsRepository.GetDatabaseNews(newsId.postId);
                    if (news != undefined) {
                        if (news.posts.username == username) {
                            news.posts.username = newusername;
                        }
                        Database.SetDatabaseObject("news", newsId.postId, news);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export default NewsRepository