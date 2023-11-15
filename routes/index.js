var express = require('express');
var router = express.Router();
const { selectCadastro, insertCadastro, updateCadastro, selectCadastros, deleteCadastro, teacherLogin, newLogin } = require('../db');

router.get('/login', (req, res) => {
  console.log(req.params)
  res.render('login.ejs', {type: 'null', action: '/teacherLogin'});
});

router.get('/login/new', (req, res) => {
  res.render('login.ejs', { type: "new", action: "/newLogin" });
});

router.get('/', async function (req, res){
  res.render('login.ejs', {type: 'null', action: '/teacherLogin'});
})

router.get('/atestados', async function (req, res){
  console.log(req.body)
  if(req.query.buscaAvancada === true){

  }else {
    try { const results = await selectCadastro();
        res.render('index', { results, nome: req.query.nome });
    }
    catch (error) {
      res.redirect('/?erro=' + error);
    }
  }
})

// Rota para criar um novo login (professor)
router.post('/newLogin', async (req, res) => {
  const { nome, usuario, senha } = req.body
  try {
    await newLogin(nome, usuario, senha);
    res.redirect(`/atestados?nome=${nome}`)
  }catch (e){
    res.redirect('/')
  }
});

// Rota para fazer login (professores)
router.post('/teacherLogin', async (req, res) => {
  const { usuario, senha } = req.body;
  try {
    const response = await teacherLogin(usuario, senha);
    if(response.length === 0){      
      res.redirect(`/`);
    }else {
      res.redirect(`/atestados?nome=${response[0].nome}`);
    }
  } catch(erro){
    res.send('algo deu errado');
  }
});

// Rota para criar novo atestado
router.get('/new', (req, res, next) => {
  res.render('new', {title: "Nova justificativa", result:{}, action: "/new"})
});

router.post('/new', async (req, res, next) => {
  const { matricula, nome, turma, data_entrega, data_afastamento, periodo, motivo, observacao, turno } = req.body;  
  try {
    await insertCadastro({matricula, nome, turma, data_entrega, data_afastamento, periodo, motivo, observacao, turno});
    res.redirect('/?new=true')
  } catch (e){
    res.redirect('/?erro= ' + e);
  }
});

// Rota para editar um atestado
router.get('/edit/:matricula', async (req, res, next) => {
  const matricula = parseInt(req.params.matricula);
  try {
    const result = await selectCadastros(matricula);  
    res.render('new', {title: 'Edição de justificativa', result, action: '/edit/' + matricula});
  } catch (e) {
    res.redirect('/?erro= ' + e)
  };
});

router.post('/edit/:matricula', async (req, res, next) => {
  const matricula = parseInt(req.params.matricula);
  const novaMatricula = req.body.matricula;
  const { nome, turma, data_entrega, data_afastamento, periodo, motivo, observacao, turno } = req.body;
  try {
    await updateCadastro(matricula, novaMatricula, { nome, turma, data_entrega, data_afastamento, periodo, motivo, observacao, turno});
    res.redirect('/?edit=true');
  } catch (e) {
    res.redirect('/?erro= ' + e)
  };
});

// Rota para deletar um atestado
router.get('/delete/:matricula', async (req, res) => {
  const matricula = parseInt(req.params.matricula);
  try {
    await deleteCadastro(matricula);
    res.redirect('/?delete= true');
  } catch(e) {
    res.redirect('/?erro=' + e);
  }
});

module.exports = router;
