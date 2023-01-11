// const formLogin = document.getElementById('formLogin')
// if(formLogin){
//     formLogin.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const formData = new FormData(formLogin);
//         let data = {}
//         const login = formData.get('userLogin'); //
//         const password = formData.get('userPassword'); //
//         data = {
//             login:login,
//             password:password
//         }
//         console.log(data)
//     })
// }

// const formData = new FormData();
// const photos = document.querySelector('input[type="file"][multiple]');
//
// formData.append('title', 'Мой отпуск в Вегасе');
// for (let i = 0; i < photos.files.length; i++) {
//     formData.append('photos', photos.files[i]);
// }
//
// try {
//     const response = await fetch('http://192.168.1.100:8080/post', {
//         method: 'POST',
//         body: formData
//     });
//     const result = await response.json();
//     console.log('Успех:', JSON.stringify(result));
// } catch (error) {
//     console.error('Ошибка:', error);
// }

//
// const form = formLogin = document.getElementById('formLogin')
// fetch('/', {
//     method: 'POST',
//     body: form
// });
