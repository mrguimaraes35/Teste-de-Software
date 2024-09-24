/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Carrega o conteúdo HTML
const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

describe('Teste da lista de tarefas', () => {
  let addTaskBtn;
  let taskInput;
  let taskList;

  beforeEach(() => {
    // Define o documento com o conteúdo HTML
    document.documentElement.innerHTML = html.toString();

    // Carrega o script JS (app.js) no ambiente de teste
    require('../public/app.js');

    // Pega os elementos DOM
    addTaskBtn = document.getElementById('add-task-btn');
    taskInput = document.getElementById('task-input');
    taskList = document.getElementById('task-list');
  });

  test('Deve adicionar uma tarefa à lista', () => {
    // Simula entrada de texto
    taskInput.value = 'Estudar Jest';

    // Simula clique no botão "Adicionar"
    addTaskBtn.click();

    // Verifica se a tarefa foi adicionada à lista
    expect(taskList.children.length).toBe(1);
    expect(taskList.children[0].textContent).toContain('Estudar Jest');
  });

  test('Deve remover uma tarefa da lista', () => {
    // Simula entrada de texto e adição de uma tarefa
    taskInput.value = 'Estudar Jest';
    addTaskBtn.click();

    // Verifica se a tarefa foi adicionada
    expect(taskList.children.length).toBe(1);

    // Simula clique no botão "Excluir"
    const deleteBtn = taskList.querySelector('.delete-btn');
    deleteBtn.click();

    // Verifica se a tarefa foi removida
    expect(taskList.children.length).toBe(0);
  });

  test('Não deve adicionar tarefa vazia', () => {
    // Simula um valor vazio no input
    taskInput.value = '';

    // Simula clique no botão "Adicionar"
    addTaskBtn.click();

    // Verifica se a lista de tarefas continua vazia
    expect(taskList.children.length).toBe(0);
  });

  test('Deve adicionar e concluir três tarefas', () => {
    // Adiciona três tarefas
    const tarefas = ['Tarefa 1', 'Tarefa 2', 'Tarefa 3'];

    tarefas.forEach(tarefa => {
      taskInput.value = tarefa;
      addTaskBtn.click();
    });

    // Verifica se as três tarefas foram adicionadas
    expect(taskList.children.length).toBe(3);
    expect(taskList.children[0].textContent).toContain('Tarefa 1');
    expect(taskList.children[1].textContent).toContain('Tarefa 2');
    expect(taskList.children[2].textContent).toContain('Tarefa 3');

    // Simula marcar as três tarefas como concluídas 
    const completeBtns = taskList.querySelectorAll('.complete-btn');
    completeBtns.forEach((btn, index) => {
      btn.click(); // Simula marcar como concluída
      expect(taskList.children[index].classList).toContain('completed'); // Verifica se a tarefa está marcada como concluída
    });

    // Simula a remoção das três tarefas após concluí-las
    const deleteBtns = taskList.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
      btn.click(); // Simula remover a tarefa
    });

    // Verifica se todas as tarefas foram removidas
    expect(taskList.children.length).toBe(0);
  });
});