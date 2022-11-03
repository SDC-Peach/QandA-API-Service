const axios = require('axios');
const {TOKEN, URL} = require('./config.js');

const prodID = '66644'
axios({
  method: 'get',
  url: `${URL}/qa/questions/?product_id=${prodID}&page=1&count=${10000}`,
  headers: { Authorization: TOKEN }
})
.then((val)=> {console.log(val.data)})
.catch((err)=> {console.log(err)})

axios({
  method: 'get',
  url: `${URL}/qa/questions/?product_id=${prodID}&page=1&count=${10000}`,
  headers: { Authorization: TOKEN }
})
.then((val)=> {console.log(val.data)})
.catch((err)=> {console.log(err)})

