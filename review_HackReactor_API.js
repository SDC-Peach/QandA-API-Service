const axios = require('axios');
const {TOKEN, URL} = require('./config.js');

let prodID = '66644'
prodID = '66642'
// axios({
//   method: 'get',
//   url: `${URL}/qa/questions/?product_id=${prodID}&page=1&count=${10000}`,
//   headers: { Authorization: TOKEN }
// })
// .then((val)=> {console.log(val.data)})
// .catch((err)=> {console.log(err)})

// axios({
//   method: 'get',
//   url: `${URL}/qa/questions/?product_id=${prodID}&page=1&count=${10000}`,
//   headers: { Authorization: TOKEN }
// })
// .then((val)=> {console.log(val.data)})
// .catch((err)=> {console.log(err)})

// axios.get('http://localhost:3000/qa/questions', {params: {product_id: prodID, count: 100}})
// .then((res)=> console.log(res.data))

// axios.get('http://localhost:3000/qa/questions/:234328/answers', {params: {page: 1, count: 100}})
// .then((res)=> console.log(res.data))

// axios.post('http://localhost:3000/qa/questions', {body: 'testing-ben! tadf', name: 'bobby Joe', email: 'bb@gmail.com', product_id: 66642})
// .then((res)=> console.log(res.data))

// axios.post('http://localhost:3000/qa/questions/:88888/answers', {body: 'testing-ben! tadf', name: 'bobby Joe',  email: 'b@gmail.com', photos: ['url1','url2','url3']})
// .then((res)=> console.log(res.data))


// axios.post('http://localhost:3000/qa/questions/:question_id/answers', {body: 'newesttestBEN', name: 'bobby', email: 'b@gmail.com', photos: []}, {params: {question_id: 234332}})
// .then((res)=> console.log(res.data))

// axios.put('http://localhost:3000/qa/questions/:question_id/helpful', {}, {params: {question_id: 234332}})
// .then((res)=> console.log(res.data))

// axios.put('http://localhost:3000/qa/questions/:question_id/report', {}, {params: {question_id: 234329}})
// .then((res)=> console.log(res.data))

axios.put('http://localhost:3000/qa/answers/:answer_id/helpful', {}, {params: {answer_id: 457350}})
.then((res)=> console.log(res.data))