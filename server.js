import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["POST","GET"],
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge:1000 * 60 * 60 * 24
    }
}));

const dbConnection = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
});

app.post('/signin', (req, res) => {
    const { name, email, password } = req.body; 
    const sql = "SELECT * FROM login WHERE email = ?";
    
    dbConnection.query(sql, [email], (err, result) => {
        if (err) {
            return res.json(err);
        }

        if (result.length > 0) {
            return res.json({ message: "User already exists!" });
        }

        const insertSql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
        const values = [name, email, password || '']; // No password for Google login
        dbConnection.query(insertSql, [values], (err, result) => {
            if (err) {
                return res.json(err);
            }
            return res.json({ message: "User signed up successfully!" });
        });
    });
});


app.get('/',(req,res) => {
    if(req.session.name){
        return res.json({valid: true,name: req.session.name})
    }else{
        return res.json({valid:false})
    }
});

app.listen(8081, () => {
    console.log("Listening.....");
}) ;