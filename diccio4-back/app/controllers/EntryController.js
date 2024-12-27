const { Entry, Term, sequelize } = require("../models/index")
const {QueryTypes} = require("sequelize")

module.exports = {

    findAllEntries(req, res) {
        try {
            const entries = Entry.findAll({ attributes: ['idTerm', 'EntryVisualization'] }).then(entryData => {
                res.send(entryData)
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    findEntryById(req, res) {
        try {
            const idEntry = req.params.id;
            Entry.findByPk(idEntry).then(entryData => {
                res.send(entryData)
            })
        } catch (error) {
            return res.status(500).send({
                message: "Error searching entry!"
            });
        }
    },
    async findEntriesByTerm(req, res) {
        
        try {
            const { idTerm } = req.query

            const queryTerms = `select distinct idTerm
            from Variant v
            join VariantEntry ve
              on v.idVariant = ve.idVariant
            join Entry e
              on e.idEntry = ve.idEntry  
            where simple = (
                    select EntryVisualization from Entry where idTerm = :idTerm
                    limit 1
            )`

            let terms = await sequelize.query(queryTerms,
                {
                    replacements: {idTerm : idTerm},
                    type: QueryTypes.SELECT
                })

            let prepareData = async (results) =>{

                let term = await Term.findByPk(idTerm)
                let filterKey = term.language == 'es' ? 'idEntryEs' : 'idEntryEn'
                
                let entries = [...new Set(results.map(r => r[filterKey]))] // spread operator
                
                let result = []
                for(let i = 0; i < entries.length; i++){
                    let entry = await Entry.findByPk(entries[i])
                    result.push({
                        idEntry: entries[i],
                        entryName: entry.EntryVisualization,
                        audioEnglish: entry.audioEnglish,
                        audioUsa: entry.audioUsa,
                        data: results.filter(r => r[filterKey] == entries[i])
                    })
                }

                result.sort((a,b)=>{
                    if(a.entryName > b.entryName) return 1
                    if(a.entryName < b.entryName) return -1
                    return 0
                })

                res.send(result)
            }

           
            
            let termsMapped = terms.map(t => t.idTerm).join(',') // [123,4545]
            const query = `select  en.idEntry, en.idTerm, en.EntryVisualization,u.user,s.title as status, t1.idEntryEn, t1.idEntryEs, en.audioEnglish, en.audioUsa
            From diccionarioProductivo.Entry en
            join (
            select 
            case when 
            idEntryEn in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped}))  then idEntryEs
            else idEntryEn end as idEntry
            from diccionarioProductivo.Translation
            where idEntryEn in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped})) or 
            idEntryEs in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped}))
            ) as entries 
            on en.idEntry = entries.idEntry
            join (
            select t.idEntryEn, t.idEntryEs from 
            diccionarioProductivo.Translation t
            where 
            t.idEntryEn in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped})) or
            t.idEntryEs in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped}))
            ) t1
            on t1.idEntryEn = en.idEntry or t1.idEntryEs = en.idEntry
            join diccionarioProductivo.User u on u.idUser = en.idCreator
            join diccionarioProductivo.Status s on s.idStatus = en.idStatus
            `

         sequelize.query(query, {
                type: QueryTypes.SELECT
            }).then(result => {
               prepareData(result)
            })


        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Error searching entry! by Term"
            });
        }
    },
    async findEntryChildrenByTerm(req, res) {
        try {
            const { idTerm } = req.query
            console.log(idTerm + '----------------------------');
            const queryTerms = `
            select distinct ec.idTerm
            from Entry e
            join RelationEntry r
            on e.idEntry = r.idEntryParent
            join Entry ec
            on ec.idEntry = r.idEntryChild  
            where e.idEntry = :idTerm 
            order by ec.EntryVisualization
            `

            let terms = await sequelize.query(queryTerms,
                {
                    replacements: {idTerm : idTerm},
                    type: QueryTypes.SELECT
                })
                console.log(terms);
            let prepareData = async (results) =>{

                let term = await Term.findByPk(idTerm)
                let filterKey = term.language == 'es' ? 'idEntryEs' : 'idEntryEn'
                
                let entries = [...new Set(results.map(r => r[filterKey]))] // spread operator
                
                let result = []
                for(let i = 0; i < entries.length; i++){
                    let entry = await Entry.findByPk(entries[i])
                    result.push({
                        idEntry: entries[i],
                        entryName: entry.EntryVisualization,
                        data: results.filter(r => r[filterKey] == entries[i])
                    })
                }

                result.sort((a,b)=>{
                    if(a.entryName > b.entryName) return 1
                    if(a.entryName < b.entryName) return -1
                    return 0
                })

                res.send(result)
            }

           
            
            let termsMapped = terms.map(t => t.idTerm).join(',') // [123,4545]
            const query = `select  en.idEntry, en.idTerm, en.EntryVisualization, t1.idEntryEn, t1.idEntryEs
            From diccionarioProductivo.Entry en
            join (
            select 
            case when 
            idEntryEn in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped}))  then idEntryEs
            else idEntryEn end as idEntry
            from diccionarioProductivo.Translation
            where idEntryEn in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped})) or 
            idEntryEs in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped}))
            ) as entries 
            on en.idEntry = entries.idEntry
            join (
            select t.idEntryEn, t.idEntryEs from 
            diccionarioProductivo.Translation t
            where 
            t.idEntryEn in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped})) or
            t.idEntryEs in (select idEntry from diccionarioProductivo.Entry where  idTerm in (${termsMapped}))
            ) t1
            on t1.idEntryEn = en.idEntry or t1.idEntryEs = en.idEntry`

         sequelize.query(query, {
                type: QueryTypes.SELECT
            }).then(result => {
               prepareData(result)
            })


        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Error searching entry! by Term"
            });
        }
    },
    async findEntryParentsByTerm(req, res) {
        try {
            const { idTerm } = req.query
            console.log(idTerm + '----------------------------');
            const queryTerms = `
            select distinct ec.idTerm, t.term, u.user as creator, s.title as status, r.idEntryParent, r.idEntryChild
            from Entry e
            join RelationEntry r
            on e.idEntry = r.idEntryChild
            join Entry ec
            on ec.idEntry = r.idEntryParent  
            join Term t on t.idTerm = ec.idTerm
            join Status s on s.idStatus = r.idStatus
            join User u on u.idUser = r.idCreator
            where e.idEntry = :idTerm 
            order by ec.EntryVisualization
            `

            let terms = await sequelize.query(queryTerms,
                {
                    replacements: {idTerm : idTerm},
                    type: QueryTypes.SELECT
                })
         
        res.send(terms)


        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Error searching entry! by Term"
            });
        }
    }
,
    async createEntry(req, res) {
        if (!req.body) {
            res.status(400).send({
                message: "Content cannot be empty!"
            });
            return;
        }
       
        let data = req.body

        let term = data.term

        const t = await sequelize.transaction();
        try{
        if(!term.idTerm){
            const query = `insert into Term(term, language) values(?,?)`
            await sequelize.query(query,{
                replacements: [term.term, term.language],
                type: QueryTypes.INSERT,
                transaction: t
            })

            term.idTerm = (
                    await sequelize.query(`select last_insert_id() as id`,
                    {
                        type: QueryTypes.SELECT,
                        transaction: t
                    }
                )
            )[0].id
        }



        let entry = data.entry
        if(!entry.idEntry){
            const query = `insert into Entry(idTerm, idCreator, idStatus, EntryVisualization) VALUES (?, '1', '1', ?)`
            await sequelize.query(query,{
                replacements: [term.idTerm, entry.entryName],
                type: QueryTypes.INSERT,
                transaction: t
            })

            entry.idEntry = (
                    await sequelize.query(`select last_insert_id() as id`,
                    {
                        type: QueryTypes.SELECT,
                        transaction: t
                    }
                )
            )[0].id

        }else{
            const query = `update Entry set EntryVisualization = :entryName where idEntry = :idEntry`
            await sequelize.query(query,{
                replacements: entry,
                type: QueryTypes.UPDATE,
                transaction: t
            })
        }



        // crear variante

        let variants = data.variants
        let adds = variants.adds
        for(let i = 0; i < adds.length; i++){
            let variant = adds[i]
            if(!variant.idVariant){
                const query = `insert into Variant(variant, grammar,simple) values(?,?,?)`
            await sequelize.query(query,{
                replacements: [variant.variant, variant.grammar, variant.variant],
                type: QueryTypes.INSERT,
                transaction: t
            })

            variant.idVariant = (
                    await sequelize.query(`select last_insert_id() as id`,
                    {
                        type: QueryTypes.SELECT,
                        transaction: t
                    }
                )
            )[0].id
            }

        const query = `insert into VariantEntry (idVariant, idEntry, idCreator, idStatus) values(?,?,?,?)`
        await sequelize.query(query,{
            replacements: [variant.idVariant,entry.idEntry, 1,1],
            type: QueryTypes.INSERT,
            transaction: t
        })
        }

        deletes = variants.deletes
        for(let i = 0; i< deletes.length; i++){
            let variant = deletes[i]
            const query = `delete from VariantEntry where idVariant = ? and idEntry = ?`
            await sequelize.query(query,{
                replacements:[variant.idVariant, entry.idEntry],
                transaction: t,
                type: QueryTypes.DELETE
            })
        }

        let updates = variants.variants
        for(let i = 0; i< updates.length; i++){
            let variant = updates[i]
            const query = `update VariantEntry set idStatus = ? where idVariant = ? and idEntry = ?`
            await sequelize.query(query,{
                replacements:[variant.idStatus, variant.idVariant, entry.idEntry],
                transaction: t,
                type: QueryTypes.UPDATE
            })
            const query2 = `update Variant set variant = ?, grammar = ? where idVariant = ?`
            await sequelize.query(query2,{
                replacements:[variant.variant, variant.grammar, variant.idVariant],
                transaction: t,
                type: QueryTypes.UPDATE
            })
        }

        // translations

        let translations = data.translations
         adds = translations.adds

        for(let i = 0; i < adds.length; i++){
            let translation = adds[i]
            // obtener idioma del entry.idEntry
            let entryLocal = await Entry.findByPk(entry.idEntry, {transaction: t})
            console.log(entryLocal);
            let termLocal = await Term.findByPk(entryLocal.idTerm ,{transaction: t})
            
            let entryEn
            let entryEs
            if(termLocal.language == 'es'){
                entryEs = entry.idEntry
                entryEn = translation.idTerm
            }else{
                entryEs = translation.idTerm
                entryEn = entry.idEntry
            }
            const query = `insert into Translation(idEntryEn, idEntryEs, idCreator, idStatus) values (?,?,?,?)`
            await sequelize.query(query,
                {
                    replacements: [entryEn, entryEs, 1, 1],
                    transaction: t
                })
        }

        deletes = translations.deletes

        for(let i = 0; i < deletes.length; i++){
            let translation = deletes[i]
            // obtener idioma del entry.idEntry
            let entryLocal = await Entry.findByPk(entry.idEntry, {transaction: t})
            let termLocal = await Term.findByPk(entryLocal.idTerm ,{transaction: t})
            
            let entryEn
            let entryEs
            if(termLocal.language == 'es'){
                entryEs = entry.idEntry
                entryEn = translation.idTerm
            }else{
                entryEs = translation.idTerm
                entryEn = entry.idEntry
            }
            const query = `delete from Translation where idEntryEn = ? and idEntryEs = ?`
            await sequelize.query(query,
                {
                    replacements: [entryEn, entryEs],
                    transaction: t
                })
        }


        // parents

        let parents = data.parents
        adds = parents.adds

        for(let i = 0; i< adds.length; i++){
            let parent = adds[i]
            const query = `insert into RelationEntry (idEntryParent, idEntryChild, idCreator, idStatus) values (?,?,?,?)`
            await sequelize.query(query, {
                type: QueryTypes.INSERT,
                transaction: t,
                replacements: [parent.idTerm, entry.idEntry, 1, 1]
            })
        }

        deletes = parents.deletes

        for(let i = 0; i< deletes.length; i++){
            let parent = deletes[i]
            const query = `delete from RelationEntry where idEntryParent = ? and idEntryChild = ?`
            await sequelize.query(query, {
                type: QueryTypes.DELETE,
                transaction: t,
                replacements: [parent.idEntryParent, entry.idEntry]
            })
        }

         // ejemplos
            // si trae traduccion se crean dos registros y se guardan los ids en lal tabla examplerelation


        


        await t.commit()
    }catch{
        t.rollback()
    }
         return res.send()
       
        

       
        
        // parents
            // atrea arreglo con idEntry que sera padre de del entry.idEntry

        

        res.send(data)

    },

    updateEntry(req, res) {
        const idEntry = req.params.id;
        try {

            Entry.update(req.body, { where: { idEntry: idEntry } })
                .then(entryUpdate => {
                    if (entryUpdate == 1) {
                        res.send({ message: "Entry updated successfull!" })
                    } else {
                        res.send({ message: "Entry could not be updated!" })
                    }
                });
        }
        catch (error) {
            return res.status(500).send({
                message: "Error updating entry!"
            });
        }
    },

    deleteEntryById(req, res) {
        const idEntry = req.params.id;

        const query =
        `
        delete from diccionarioProductivo.VariantEntry where idEntry = :idEntry;
        delete from diccionarioProductivo.Entry where idEntry = :idEntry;
        `
        sequelize.query(query, {
            replacements:{
                idEntry : +idEntry
            },
            type: QueryTypes.SELECT
        }).then(()=>{
            res.sendStatus(204)
        }, (error) => {
            console.log(error)
            res.sendStatus(500)
        })

       

    }

}