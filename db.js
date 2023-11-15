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

async function updateCadastro(matricula, novaMatricula, cadastro){
    const conn = await connect();
    const sql = `UPDATE cadastro SET matricula = ${novaMatricula}, nome = ?, turma = ?, data_entrega = ?, data_afastamento = ?, periodo = ?, motivo = ?, observacao = ?, turno = ? WHERE matricula = ?`;    
    return await conn.query(sql, [cadastro.nome, cadastro.turma, cadastro.data_entrega, cadastro.data_afastamento, cadastro.periodo, cadastro.motivo, cadastro.observacao, cadastro.turno, matricula]);
};

async function deleteCadastro(matricula){
    const conn = await connect();
    return await conn.query('DELETE FROM cadastro WHERE matricula = ?', [matricula]);
  };
  
async function teacherLogin(usuario, senha) {
    const conn = await connect();
    const [rows] =  await conn.query('SELECT * from login_professores WHERE usuario = ? and senha = ?', [usuario, senha]);
    return rows;
};

async function newLogin(nome, usuario, senha) {
    const conn = await connect();
    const [rows] =  await conn.query('INSERT INTO login_professores(nome, usuario, senha) values(?,?,?)', [nome, usuario, senha]);    
};

module.exports = { selectCadastro,  insertCadastro, updateCadastro, selectCadastros, deleteCadastro, teacherLogin, newLogin}