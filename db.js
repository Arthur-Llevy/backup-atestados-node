// const mysql = require('mysql2');

// async function connect() {
//     if(global.connect && global.connection.state !== 'disconnected')
//     return global.connection;
//     const connection = await mysql.createConnection({
//         host: 'localhost',
//         port: 3306,
//         user: 'root2',
//         password: '',
//         database: 'atestado'
//     });
//     console.log('conectou no Mysql as meninas top');
//     global.connection = connection;
//     return global.connection;

// }
// connect()

// async function selectCadastro(){
//     const conn = await connect();
//     const [rows] = await conn.query('SELECT * FROM Cadastro;');
//     return rows;
// }

// module.exports = {selectCadastro}


const mysql = require('mysql2/promise');
async function connect(){
  if(global.connection && global.connection.state != "disconected")
    return global.connection
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'arthur',
        password: '123',
        database: 'atestados'
    });

    console.log('Conectou ao banco.');
    global.connection = connection;
    return global.connection
}; 

connect();

async function selectCadastro(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM cadastro;');
    return rows;
};

async function selectCadastros(matricula){
    const conn = await connect();
    const sql = 'SELECT * FROM cadastro WHERE matricula = ?';
    const [rows] = await conn.query(sql, [matricula]);
    return rows && rows.length > 0 ? rows[0] : {};
  };

async function insertCadastro(cadastro){
    const conn = await connect();
    const sql = 'INSERT INTO cadastro (matricula, nome, turma, data_entrega, data_afastamento, periodo, motivo, observacao, turno) values(?, ?, ?, ?, ?, ?, ?, ?, ?);';
    return await conn.query(sql, [cadastro.matricula, cadastro.nome, cadastro.turma, cadastro.data_entrega, cadastro.data_afastamento, cadastro.periodo, cadastro.motivo, cadastro.observacao, cadastro.turno]);
};

async function updateCadastro(matricula, cadastro){
    const conn = await connect();
    const sql = 'UPDATE cadastro SET matricula = ?, nome = ?, turma = ?, data_entrega = ?, data_afastamento = ?, periodo = ?, motivo = ?, observacao = ?, turno = ? WHERE matricula = ?';
    return await conn.query(sql, [matricula, cadastro.nome, cadastro.turma, cadastro.data_entrega, cadastro.data_afastamento, cadastro.periodo, cadastro.motivo, cadastro.observacao, cadastro.turno, matricula]);
};

async function deleteCadastro(matricula){
    const conn = await connect();
    return await conn.query('DELETE FROM cadastro WHERE matricula = ?', [matricula]);
  };
  

module.exports = { selectCadastro,  insertCadastro, updateCadastro, selectCadastros, deleteCadastro}