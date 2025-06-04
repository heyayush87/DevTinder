const express = require("express")
const app = express()

app.use("/", (req, res) => {
  res.send("hello homepage");
});

app.use("/test", (req,res) => {
    res.send("hello hello hello test")
})

app.listen(3000, () => {
    console.log("hello from port 3000")
})