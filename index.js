const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let counterRequests = 0;

//Middlewares
server.use((req, res, next) => {
  console.log(`Total's requests: ${++counterRequests}`);
  next();
});

function checkExistsProject(req, res, next) {
  const { id } = req.params;
  const index = projects.findIndex((project) => {
    return project.id == id;
  });
  if (index < 0) {
    return res.status(404).json({ erro: 'Project not found.' });
  }
  req.index = index;
  next();
}

//List Projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Create Project
server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({
    id,
    title,
    tasks
  });
  return res.status(201).send();
});

//Edit title project
server.put('/projects/:id', checkExistsProject, (req, res) => {
  const { title } = req.body;
  projects[req.index].title = title;
  return res.send("Title updated success.");
});

//Delete project
server.delete('/projects/:id', checkExistsProject, (req, res) => {
  projects.splice(req.index, 1);
  return res.send('Project deleted success.');
});

//Create task
server.post('/projects/:id/tasks', checkExistsProject, (req, res) => {
  const { title } = req.body;
  projects[req.index].tasks.push(title);
  return res.status(201).send();
});

server.listen(3333);