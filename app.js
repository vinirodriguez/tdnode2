const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configuração do banco de dados SQLite com Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

// Definindo o modelo de usuário
const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Inicializando o banco de dados
sequelize.sync()
  .then(() => console.log('Banco de dados pronto!'))
  .catch(err => console.log('Erro ao sincronizar o banco de dados: ', err));

// Configurando o Express para usar JSON e URL-encoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota principal com todas as funcionalidades em uma página
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Login</h2>
        <form action="/login" method="POST">
          <label for="username">Usuário: </label><br>
          <input type="text" id="username" name="username"><br><br>
          <label for="password">Senha: </label><br>
          <input type="password" id="password" name="password"><br><br>
          <button type="submit">Entrar</button>
        </form>
        <br><br>
        <h2>Cadastro de Usuário</h2>
        <form action="/add-user" method="POST">
          <label for="new-username">Novo Usuário: </label><br>
          <input type="text" id="new-username" name="new-username"><br><br>
          <label for="new-password">Nova Senha: </label><br>
          <input type="password" id="new-password" name="new-password"><br><br>
          <button type="submit">Cadastrar</button>
        </form>
        <br><br>
        <h2>Editar Usuário</h2>
        <form action="/edit-user" method="POST">
          <label for="edit-username">Usuário para Editar: </label><br>
          <input type="text" id="edit-username" name="edit-username"><br><br>
          <label for="edit-password">Nova Senha: </label><br>
          <input type="password" id="edit-password" name="edit-password"><br><br>
          <button type="submit">Editar</button>
        </form>
        <br><br>
        <h2>Excluir Usuário</h2>
        <form action="/delete-user" method="POST">
          <label for="delete-username">Usuário para Excluir: </label><br>
          <input type="text" id="delete-username" name="delete-username"><br><br>
          <button type="submit">Excluir</button>
        </form>
      </body>
    </html>
  `);
});

// Rota de Login - Validação simples
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ where: { username, password } });
  if (user) {
    res.send(`
      <h2>Bem-vindo, ${user.username}!</h2>
      <a href="/">Voltar para a Página Principal</a>
    `);
  } else {
    res.send('Usuário ou senha incorretos. Tente novamente. <a href="/">Voltar para o Login</a>');
  }
});

// Rota para adicionar um usuário
app.post('/add-user', async (req, res) => {
  const { 'new-username': username, 'new-password': password } = req.body;
  await User.create({ username, password });
  res.send('Usuário criado com sucesso! <a href="/">Voltar para a Página Principal</a>');
});

// Rota para editar um usuário
app.post('/edit-user', async (req, res) => {
  const { 'edit-username': username, 'edit-password': password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user) {
    await user.update({ password });
    res.send('Usuário atualizado com sucesso! <a href="/">Voltar para a Página Principal</a>');
  } else {
    res.send('Usuário não encontrado. <a href="/">Voltar para a Página Principal</a>');
  }
});

// Rota para excluir um usuário
app.post('/delete-user', async (req, res) => {
  const { 'delete-username': username } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user) {
    await user.destroy();
    res.send('Usuário excluído com sucesso! <a href="/">Voltar para a Página Principal</a>');
  } else {
    res.send('Usuário não encontrado. <a href="/">Voltar para a Página Principal</a>');
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
