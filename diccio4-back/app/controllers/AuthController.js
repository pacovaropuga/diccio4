const {User} = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth')

module.exports = {

    // Login
    signIn(req,res){
        let { email, password } = req.body;

        // Buscar usuario
        User.findOne({
            where: {email: email}
        }).then(user => {

            if (!user) {
                res.status(404).json({ msg: "Usuario con este correo no encontrado" });
            } else {

                if (bcrypt.compareSync(password, user.password)) {
                    // Creamos el token
                    let token = jwt.sign({ user: user }, authConfig.secret, {
                        expiresIn: authConfig.expires
                    });
                    res.json({
                        user: user,
                        token: token
                    })
                } else {
                    // Unauthorized Access
                    res.status(401).json({ msg: "Contraseña incorrecta" })
                }
            }
        }).catch(err => {
            res.status(500).json(err);
        })
    },

    // Register

    signUp(req, res){
        
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));

        User.create({
            user: req.body.user,
            email: req.body.email,
            type: req.body.type,
            password: password,
            score: req.body.score
            //date_insert: req.body,date_insert,
            //date_last_insert: req.body.date_last_insert
        }).then(user =>{
            let token = jwt.sign({user: user}, authConfig.secret,{
                expiresIn: authConfig.expires
            });
            console.log(user);
            console.log(token);

            res.json({
                user: res.user,
                token: res.token
            });
        }).catch(error =>{
            res.status(500).json(error);
        });

    }

}