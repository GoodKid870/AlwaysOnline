// тут по классике
let express = require('express');
const path = require("path");
let app = express();

// ставим движок ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//пользуемся нашей директорией
app.use('/public', express.static(path.join(__dirname, 'public')));

// индексируем нашу пэйдж
app.get('/', (req, res) => {
    res.render('pages/index');
})
// тут берем нашу пэйдж логин
app.get('/login', (req, res) => {
    res.render('pages/login')
})

// завпись наших данных с регистрации
const urlencodedParser = express.urlencoded({extended: true});
app.post("/login", urlencodedParser, async (request, response) => {
    if (!request.body) return response.sendStatus(400);
    let data = []
    data.push(request.body)
    let fsp = require('fs/promises');
    await fsp.writeFile("./server/users/users.json", JSON.stringify(data, null, 2)).then(response.redirect("/"))
});

//запуск нашего чуда
app.listen(8080);
console.log('А ты веришь в чудеса, попробуй порт 8080 =)');