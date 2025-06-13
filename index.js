require("dotenv").config();

const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./src/routes/auth.routes')(app);

// app.get('/', (req, res) => {
//   res.send('Hello World! 2')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
