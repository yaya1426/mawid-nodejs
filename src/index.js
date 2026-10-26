const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/contact', (req, res) => {
  res.send('About page')
})

app.listen(port, () => {
  console.log(`Mawid is running on port ${port}`)
})