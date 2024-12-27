const { QueryTypes } = require("sequelize");
const {Variant, sequelize} = require("../models/index")
module.exports ={

    findAllVariants(req,res){
        try{
            const variants= Variant.findAll({ attributes: ['variant', 'simple'] }).then( variantData =>{
                res.send(variantData)
            })
        }catch(error){
            return res.status(500).json(error);
        }
    },

     findVariantById(req,res){
        try{
            const idVariant= req.params.id;
            Variant.findByPk(idVariant).then( variantData =>{
                res.send(variantData)
            })
        }catch(error){
            return res.status(500).send({
                message: "Error searching variant!"
                });
        }
     },
     async findVariantByIdEntry(req,res){
        try{
            const idEntry= req.params.idEntry;
            
            const query = `
            select ve.idVariant, u.user as creator, idStatus, variant, v.grammar, ve.idEntry
            from VariantEntry  ve
            join Variant v on v.idVariant = ve.idVariant
            join User u on ve.idCreator = u.idUser
            where ve.idEntry = ?
            `
            let result = await sequelize.query(query, {
                replacements: [idEntry],
                type: QueryTypes.SELECT
            })

            res.send(result)
        }catch(error){
            return res.status(500).send({
                message: "Error searching variant!"
                });
        }
     },
     createVariant(req,res){
        if (!req.body) {
            res.status(400).send({
            message: "Content cannot be empty!"
            });
            return;
        }
        const variantNew ={
            idVariantOriginal: req.body.idVariantOriginal,
            variant: req.body.variant,
            grammar: req.body.grammar,
            simple: req.body.simple
        }     
        console.log(variantNew);
        console.log(variantNew.variant);
        console.log(variantNew.grammar);
        console.log(variantNew.simple); 
        try{            
            Variant.create(variantNew).then( variantData =>{
                res.send(variantData)
            });
        }catch(error){
            return res.status(500).send({
                message: "Error creating variant!"
                });
        }

     },
    
    updateVariant(req,res){
        const idVariant = req.params.id;
        try{

            Variant.update(req.body,{ where: {idVariant: idVariant}})
                .then(variantUpdate=>{                    
                res.send({message: "Variant updated successfull!"})                   
            });
        }
        catch(error){
            return res.status(500).send({
                message: "Error updating variant!"
                });
        }
    },    

    deleteVariantById(req,res){
        const idVariant = req.params.id;
        try{

            Variant.destroy({ where: {idVariant: idVariant}})
                .then(variantDelete=>{
                    if(variantDelete ==1){
                        res.send({message: "Variant deleted successfull!"})
                    }else{
                        res.send({message: "Variant could not be deleted!"})
                    }
            });
        }catch(error){
            return res.status(500).send({
                message: "Error deleted variant!"
                });
        }

    }  

}