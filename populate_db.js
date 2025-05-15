const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("compito.db");

const N_BIGLIETTI = 100;
db.serialize(() => {
    for(let i=0; i<N_BIGLIETTI; i++){
        const tmp_id = Math.random().toString().replace("0.", "");
        db.run(`INSERT INTO biglietto (id) VALUES (${tmp_id})`);
    }
});