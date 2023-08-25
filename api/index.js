import express from 'express';
import { todos } from './todos.data.js';

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-type,Accept,Authorization,Origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.listen(5000, () => {
  console.log('server is listening on port 5000');
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const createdTodo = {
    ...req.body,
    isSynced: true,
  };
  todos.push(createdTodo);
  console.log('API > CREATED', createdTodo);
  res.status(201).json(createdTodo);
});

app.put('/api/todos/:todoID', (req, res) => {
  const id = req.params.todoID;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return res.status(404).send({ error: 'Todo not found' });
  }
  const updatedTodo = {
    ...req.body,
    isSynced: true,
  };
  todos[index] = updatedTodo;
  console.log('API > UPDATED', updatedTodo);
  res.status(200).json(updatedTodo);
});

app.delete('/api/todos/:todoID', (req, res) => {
  const id = req.params.todoID;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return res.status(404).send({ error: 'Todo not found' });
  }
  todos.splice(index, 1);
  console.log('API > DELETED', req.params.todoID);
  res.status(200).json({});
});
