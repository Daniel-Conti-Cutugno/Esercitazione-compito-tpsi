const sqlite = require("sqlite3");
const db = new sqlite.Database("compito.db");
const express = require("express");
const app = express();
const port = 3333;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/biglietti", (req,res)=>{

    let sql = "SELECT * FROM biglietto";

    db.all(sql, (err, result)=>{

        if(err){
            res.status(500).send({
                code:-1,
                data: err.message
            })
        }

        res.status(200).send({
            code: 1,
            data: result
        });

    });
    

})

app.get("/biglietto/:id", (req,res)=>{

    if(!req.params.id){

        res.status(400).send({
            code:-1,
            data: "Nessun id inserito"
        })

    }
    let sql = "SELECT * FROM biglietto WHERE id = ?";

    db.all(sql, req.params.id, (err, result)=>{

        if(err){
            res.status(500).send({
                code:-1,
                data: err.message
            })
        }

        res.status(200).send({
            code: 1,
            data: result
        });

    });
    

})

app.put("/biglietto/:id", (req, res)=>{

    let sql = "UPDATE biglietto SET uscita = ? WHERE id = ?";
    let uscita = new Date();
    db.run(sql,[uscita.getMilliseconds(), req.params.id], (err, results)=>{

        if(err){
            res.status(500).send({
                code: -1,
                data: err.message
            })
        }

        res.status(201).send({
            code: 1,
            data: results
        })

    })

})

app.post("/biglietto", (req, res)=>{



    let id = Math.random().toString().replace("0.", "");
    let dataEntrata = new Date();
    let sql = "INSERT INTO biglietto (id, entrata) VALUES (?, ?)";
    db.run(sql, [id, dataEntrata.getMilliseconds()], (err, result)=>{

        if(err){

            res.status(500).send({
                code: -1,
                data: err.message
            })

        }

        res.status(201).send({
            code: 1,
            data: result
        });

    });
   



})

app.delete("/biglietto/:id", (req, res)=>{

    let id = req.params.id;
    console.log(id);
    
    db.run("DELETE FROM biglietto WHERE id = ?", id, (err, results)=>{

        if(err){

            res.status(500).send({
                code: -1,
                data: err.message
            })

        }

        res.status(200).send({
            code:1,
            data: results
        });

    });
    
})

app.get("/pagamento/:id", (req, res)=>{

    let sql = "SELECT entrata, uscita FROM biglietto WHERE id = ?";

    db.all(sql, [req.params.id], (err, results)=>{

        if(err){

            res.status(500).send({
                code: -1,
                data: err.message
            })

        }

        if(results.length == 0){

            res.status(400).send({
                code: -1,
                error: "No valid ID"
            })
            return;


        }

        console.log(results[0].entrata);
        const costoSosta = (results[0].uscita - results[0].entrata) * 0.01;
        console.log(costoSosta);
        res.status(200).send({
            code:1,
            data: costoSosta
        });
        
        

    })

})

app.listen(port, ()=>{

    console.log(`SERVER LISTENING ON PORT ${port}`);
    

})
