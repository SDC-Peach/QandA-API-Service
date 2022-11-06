const axios = require('axios');

test('get QUESTIONS should return data in same formt as FEC API', ()=> {
  const expectedResults = {
    "product_id": "66641",
    "results": [{
      "question_id": 234321,
      "question_body": "Dignissimos veritatis dolore.",
      "question_date": "2021-03-15T04:33:40.158Z",
      "asker_name": "Emie_Ratke",
      "question_helpfulness": 1,
      "reported": false,
      "answers": {
        457334: {
          "id": 457334,
          "body": "Explicabo et hic et.",
          "date": "2020-08-02T05:02:42.431Z",
          "answerer_name": "Darius12",
          "helpfulness": 15,
          "photos": ["https://images.unsplash.com/photo-1418985991508-e47386d96a71?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"]
        }
      }
    },
      {
        "question_id": 234322,
        "question_body": "Veniam dolor exercitationem laboriosam non quam et id consectetur.",
        "question_date": "2021-03-14T04:40:17.522Z",
        "asker_name": "Cornelius.Crona65",
        "question_helpfulness": 5,
        "reported": false,
        "answers": {}
      },
      {
        "question_id": 234323,
        "question_body": "Cupiditate molestias omnis id incidunt maiores corrupti maiores sint deserunt.",
        "question_date": "2020-06-10T15:17:18.664Z",
        "asker_name": "Carter76",
        "question_helpfulness": 9,
        "reported": false,
        "answers": {
          457335: {
            "id": 457335,
            "body": "Sint voluptas et et.",
            "date": "2020-06-30T23:15:16.206Z",
            "answerer_name": "Jakayla96",
            "helpfulness": 12,
            "photos": ["https://images.unsplash.com/photo-1544376664-80b17f09d399?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1525&q=80"]
          },
          457336: {
            "id": 457336,
            "body": "Nobis non nostrum ut vero adipisci.",
            "date": "2020-12-07T20:19:33.713Z",
            "answerer_name": "Thelma81",
            "helpfulness": 2,
            "photos": []
          }
        }
      }]
  }
  return axios({
    method: 'get',
    url: 'http://localhost:3000/qa/questions',
    params: {product_id: '66641', count: 100000}
  })
  .then((res)=> {
    expect(expectedResults).toEqual(res.data);
  })
})

test('get ANSWERS should return data in same formt as FEC API', ()=> {
  const expectedAnswers = {
    question: '3518948',
    page: 1,
    count: 5,
    results: [
      {
        answer_id: 6879287,
        body: 'Quas voluptatibus nihil sed.',
        date: '2021-02-23T00:59:10.815Z',
        answerer_name: 'Ollie73',
        helpfulness: 4,
        photos: [{id: 2063756, url: 'https://images.unsplash.com/photo-1542702942-161ceb2e3d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80'}]
      },
      {
        answer_id: 6879288,
        body: 'Molestiae temporibus nesciunt laboriosam dolores harum nobis sint pariatur at.',
        date: '2021-02-06T06:43:54.102Z',
        answerer_name: 'Jeffery_Schroeder18',
        helpfulness: 4,
        photos: [{id: 2063757, url: 'https://images.unsplash.com/photo-1518894781321-630e638d0742?ixlib=rb-1.2.1&auto=format&fit=crop&w=1100&q=80'}]
      },
      {
        answer_id: 6879289,
        body: 'Cumque asperiores et.',
        date: '2020-09-10T02:21:10.821Z',
        answerer_name: 'Noelia91',
        helpfulness: 3,
        photos: []
      }
    ]
  }
  return axios({
    method: 'get',
    url: 'http://localhost:3000/qa/questions/3518948/answers'
  })
  .then((res)=> {
    expect(expectedAnswers).toEqual(res.data);
  })
})

test ('post QUESTION should result in 1 new db record matching what was posted', ()=> {

  let mockPostQuestion = {body: `BEN POST TESTING ${Math.floor(Math.random()*200)}`, name: `BB ${Math.floor(Math.random()*200)}`, email: `BB${Math.floor(Math.random()*200)}ant@gmail.com`, product_id: 66609};

  return axios({
    method: 'get',
    url: 'http://localhost:3000/qa/questions',
    params: {product_id: '66609', count: 100000}
  })
  .then((res)=> {
    let startingCount = res.data.results.length;
    return axios.post('http://localhost:3000/qa/questions', mockPostQuestion)
    .then((res)=> {
      return axios({
        method: 'get',
        url: 'http://localhost:3000/qa/questions',
        params: {product_id: '66609', count: 100000}
      })
      .then((res)=> {
        let resultz = res.data.results.sort((a , b)=> {return b.question_id - a.question_id})
        let endingCount = resultz.length;

        expect(endingCount).toBe(startingCount+1);

        let lastQuestionAdded = resultz[0]
        expect(lastQuestionAdded.question_body).toBe(mockPostQuestion.body);

        expect(lastQuestionAdded.asker_name).toBe(mockPostQuestion.name);
        expect(lastQuestionAdded.question_helpfulness).toBe(0);
        expect(lastQuestionAdded.reported).toBe(false);
        expect(typeof lastQuestionAdded.answers).toBe('object');
        expect(Object.keys(lastQuestionAdded.answers).length).toBe(0);
      })
    })
  })
})

test ('post ANSWER should result in 1 new db record matching what was posted', ()=> {
  let mockQuestion_id = 234217;
  let mockPostAnswer = {body: `BEN POST TESTING ${Math.floor(Math.random()*200)}`, name: `BB ${Math.floor(Math.random()*200)}`, email: `BB${Math.floor(Math.random()*200)}ant@gmail.com`, photos: ['http://fsfd.com', 'asdf.com','xx','http://yy.com','dd']};

  return axios({
    method: 'get',
    url: `http://localhost:3000/qa/questions/${mockQuestion_id}/answers`,
    params: {page: 1, count:100000}
  })
  .then((res)=>{
    let startingCount = res.data.results.length;
    return axios.post('http://localhost:3000/qa/questions/question_id/answers', mockPostAnswer, {params: {question_id: mockQuestion_id}})
    .then((res)=> {
      return axios({
        method: 'get',
        url: `http://localhost:3000/qa/questions/${mockQuestion_id}/answers`,
        params: {page: 1, count:100000}
      })
      .then((res)=> {
        let resultz = res.data.results.sort((a , b)=> {return b.answer_id - a.answer_id})
        let endingCount = resultz.length;
        expect(endingCount).toBe(startingCount+1);

        let lastanswerAdded = resultz[0];
        expect(lastanswerAdded.body).toBe(mockPostAnswer.body);
        expect(lastanswerAdded.answerer_name).toBe(mockPostAnswer.name);
        expect(lastanswerAdded.helpfulness).toBe(0);
        expect(typeof lastanswerAdded.date).toBe('string');
        expect(Array.isArray(lastanswerAdded.photos)).toBe(true);
        expect(lastanswerAdded.photos.length).toBe(5);
        expect(lastanswerAdded.photos.some((item)=>{return item.url==='http://yy.com'})).toBe(true);
      })
    })
  })

})
