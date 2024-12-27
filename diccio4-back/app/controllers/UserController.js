const {User} = require("../models/index")

module.exports ={

    findAllUsers(req,res){
        try{
            const users= User.findAll().then( userData =>{
                res.send(userData)
            })
        }catch(error){
            return res.status(500).json(error);
        }
    },

     findUserById(req,res){
        try{
            const idUser= req.params.id;
            User.findByPk(idUser).then( userData =>{
                res.send(userData)
            })
        }catch(error){
            return res.status(500).send({
                message: "Error searching user!"
                });
        }
     },

     createUser(req,res){
        if (!req.body) {
            res.status(400).send({
            message: "Content cannot be empty!"
            });
            return;
        }
        const userNew ={
            user: req.body.user,
            email: req.body.email,
            type: req.body.type,
            password: req.body.password,
            score: req.body.score,
            date_insert: req.body.date_insert,
            date_last_update: req.body.date_last_update
        }        
        try{            
            User.create(userNew).then( userData =>{
                res.send(userData)
            })
        }catch(error){
            return res.status(500).send({
                message: "Error creating user!"
                });
        }

     },

    updateUser(req,res){
        const idUser = req.params.id;
        try{

            User.update(req.body,{ where: {idUser: idUser}})
                .then(userUpdate=>{
                    if(userUpdate ==1){
                        res.send({message: "User updated successfull!"})
                    }else{
                        res.send({message: "User could not be updated!"})
                    }
            });
        }
        catch(error){
            return res.status(500).send({
                message: "Error updating user!"
                });
        }
    },

    deleteUserById(req,res){
        const idUser = req.params.id;
        try{

            User.destroy({ where: {idUser: idUser}})
                .then(userDelete=>{
                    if(userDelete ==1){
                        res.send({message: "User deleted successfull!"})
                    }else{
                        res.send({message: "User could not be deleted!"})
                    }
            });
        }catch(error){
            return res.status(500).send({
                message: "Error deleted user!"
                });
        }

    }  

}

