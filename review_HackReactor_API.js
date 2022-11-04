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

axios.post('http://localhost:3000/qa/questions', {name: 'and I am bob!'})
.then((res)=> console.log(res.data))
