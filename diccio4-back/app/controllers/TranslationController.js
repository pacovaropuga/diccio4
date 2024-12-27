const { QueryTypes } = require("sequelize")
const {sequelize} = require("../models/index")

module.exports ={

    async add(req, res){
        const {idEntry, idTranslation} = req.body

        const query = `
        select en.idEntry, te.language, en.EntryVisualization
        from diccionarioProductivo.Entry en
        join diccionarioProductivo.Term te
        on en.idTerm = te.idTerm
        where en.identry = ?
        `

        let result = await sequelize.query(query, {
            replacements: [idEntry],
            type: QueryTypes.SELECT
        })

         result = result[0]

        let idEntryEn
        let idEntryEs

        if(result.language == 'es'){
            idEntryEs = idEntry
            idEntryEn = idTranslation
        }else{
            idEntryEn = idEntry
            idEntryEs = idTranslation
        }

        const insert = `
            insert into diccionarioProductivo.Translation (idEntryEn, idEntryEs, idCreator, idStatus)
            values(?,?,1,1)
        `
    console.log(insert);
        await sequelize.query(insert,{
            replacements: [idEntryEn, idEntryEs],
            type: QueryTypes.UPSERT
        })

        res.send();
    }
}