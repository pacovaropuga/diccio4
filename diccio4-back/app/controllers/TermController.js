const {Term, sequelize} = require("../models/index")
const {Op, QueryTypes} = require('sequelize')
module.exports ={

    findAllTerms(req,res){
        try{
            const terms= Term.findAll({ attributes: ['term', 'language'] }).then( termData =>{
                res.send(termData)
            })
        }catch(error){
            return res.status(500).json(error);
        }
    },

    findTermByWord(req,res){
        try{
            const terms= Term.findAll({ attributes: ['idTerm','term', 'language'],
            where: {
                term: {
                    [Op.like] : `${req.params.word}%`
                }
            },
            order: ['term']
        }).then( termData =>{
            let language = req.query.language

                if(language && language != 'undefined'){
                    termData = termData.filter(t => t.language == (language == 'en' ? 'es' : 'en'))
                }
                res.send(termData)
            })
        }catch(error){
            return res.status(500).json(error);
        }
    },

     findTermById(req,res){
        try{
            const idTerm= req.params.id;
            Term.findByPk(idTerm).then( termData =>{
                res.send(termData)
            })
        }catch(error){
            return res.status(500).send({
                message: "Error searching term!"
                });
        }
     },

     createTerm(req,res){
        if (!req.body) {
            res.status(400).send({
            message: "Content cannot be empty!"
            });
            return;
        }
        const termNew ={
            term: req.body.term,
            language: req.body.language,
            hit: req.body.hit,
            thesaurus: req.body.thesaurus,
            audioEnglish: req.body.audioEnglish,
            audioUSA: req.body.audioUSA,
            date_insert: req.body.date_insert,
            date_last_update: req.body.date_last_update,
            date_last_hit: req.body.date_last_hit
        }        
        try{            
            Term.create(termNew).then( termData =>{
                res.send(termData)
            })
        }catch(error){
            return res.status(500).send({
                message: "Error creating term!"
                });
        }

     },

    updateTerm(req,res){
        const idTerm = req.params.id;
        try{

            Term.update(req.body,{ where: {idTerm: idTerm}})
                .then(termUpdate=>{
                    if(termUpdate ==1){
                        res.send({message: "Term updated successfull!"})
                    }else{
                        res.send({message: "Term could not be updated!"})
                    }
            });
        }
        catch(error){
            return res.status(500).send({
                message: "Error updating term!"
                });
        }
    },

    deleteTermById(req,res){
        const idTerm = req.params.id;
        try{

            Term.destroy({ where: {idTerm: idTerm}})
                .then(termDelete=>{
                    if(termDelete ==1){
                        res.send({message: "Term deleted successfull!"})
                    }else{
                        res.send({message: "Term could not be deleted!"})
                    }
            });
        }catch(error){
            return res.status(500).send({
                message: "Error deleted term!"
                });
        }

    },
    async examples(req, res){
        const {idEntry} = req.query
        const queryLanguage = `select  language 
        from Entry e
        join Term t on e.idTerm = t.idTerm
        where e.idEntry = ?`

        let language = await sequelize.query(queryLanguage,
            {
                replacements: [idEntry],
                type: QueryTypes.SELECT
            })

        const query = 
        
        language[0].language == 'en' ? 
        `
        select distinct exs.example as translation, (case when exe.idStatus = 1 then exe.example else '' end) as traduccion,exe.idExample,exe.idCreator, exe.idStatus
        from Entry e
        join Example exs
          on e.idEntry = exs.idEntry
        join ExampleRelation exr
          on exr.idExampleEn = exs.idExample
        join Example exe
          on exr.idExampleEs = exe.idExample  
         where e.idEntry = ?`
         :
         `
         select distinct exe.example as translation, (case when exs.idStatus = 1 then exs.example else '' end) as traduccion,exe.idExample,exe.idCreator, exe.idStatus
        from Entry e
        join Example exs
        on e.idEntry = exs.idEntry
        join ExampleRelation exr
        on exr.idExampleEs = exs.idExample
        join Example exe
        on exr.idExampleEn = exe.idExample  
        where e.idEntry = ?
        `

        let result = await sequelize.query(query,
            {
                replacements: [idEntry],
                type: QueryTypes.SELECT
            })
        return res.send(result)

    }

}