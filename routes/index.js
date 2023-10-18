var express = require('express');
var router = express.Router();
const { selectCadastro, insertCadastro, updateCadastro, selectCadastros, deleteCadastro} = require('../db')

/* GET home page */

router.get('/', async function (req,res){
  try { const results = await selectCadastro();
      console.log(results);
      res.render('index', { results});
  }
  catch (error) {
    res.redirect('/?erro=' + error);
  }
})

/* GET new page. */

// router.get('/new', function(req, res, next){
//   res.render('new', { title:"Cadastro de aluno", action: "/new"})
// })

// /* POST new page*/

// router.post('/new', function(req, res, next){
//   res.redirect('/?new=true')
// })

// ROTAS FUNCIONAIS 

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
  const { nome, turma, data_entrega, data_afastamento, periodo, motivo, observacao, turno } = req.body;
  try {
    await updateCadastro(matricula, { nome, turma, data_entrega, data_afastamento, periodo, motivo, observacao, turno});
    res.redirect('/?edit=true');
  } catch (e) {
    res.redirect('/?erro= ' + e)
  };
});

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
/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */