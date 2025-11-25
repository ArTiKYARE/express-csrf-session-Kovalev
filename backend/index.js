const cookieParser = require("cookie-parser")
const db = require("./db")
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const session = require("express-session")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"]
}))

app.use(session({
    secret: "wqwq",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: true
    }
}))

app.post("/signup", (req, res) => {
    try {
        const hashed = bcrypt.hashSync(req.body.password, 10)
        const newUser = db
            .prepare(`INSERT INTO user (email, password) VALUES (?,?)`)
            .run(req.body.email, hashed)
        const createdUser = db
            .prepare(`SELECT * FROM user WHERE id = ?`)
            .get(newUser.lastInsertRowid)
        res.status(201).json(createdUser)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

app.listen("3000", () => {
    console.log("Port: 3000")
})