const todoInput = document.getElementById('todoInput')
const todoAdd = document.getElementById('todoAdd')
const todoList = document.getElementById('todoList')

todoAdd.onclick = function(){
  if(todoInput.value == '')
    return;
  
  while(todoInput.value[0] == ' '){
    todoInput.value = todoInput.value.substring(1,todoInput.value.length)
  }
  
  while(todoInput.value[todoInput.value.length] == ' '){
    todoInput.value = todoInput.value.substring(0,todoInput.value.length - 1)
  }
  
  const li = document.createElement('li')
  li.setAttribute('class','pending')
  const checkbox = document.createElement('img')
  checkbox.setAttribute('class','unchecked')
  checkbox.src = 'images/unchecked.png'
  const span = document.createElement('span')
  span.setAttribute('class','unfinished')
  const removeBtn = document.createElement('img')
  removeBtn.setAttribute('class','removeItem')
  removeBtn.src = 'images/remove.png'
  
  span.textContent = todoInput.value
  todoInput.value = ''
  
  li.appendChild(checkbox)
  li.appendChild(span)
  li.appendChild(removeBtn)
  todoList.appendChild(li)
}

todoList.addEventListener('click',(e)=>{
  if(e.target.className == 'removeItem'){
    e.target.parentElement.remove()
    return
  }

  if(e.target.parentElement.tagName != 'LI'){return}
  
  const item = e.target.parentElement
  
  if(item.firstElementChild.className == 'checked'){
    item.setAttribute('class','unfinished')
    item.firstElementChild.src = 'images/unchecked.png'
    item.firstElementChild.setAttribute('class','unchecked')
  } else {
    item.setAttribute('class','finished')
    item.firstElementChild.src = 'images/checked.png'
    item.firstElementChild.setAttribute('class','checked')
  }
})

function save(){
    localStorage.setItem('content',document.getElementById('todoList').innerHTML)
}

function read(){
    document.getElementById('todoList').innerHTML = localStorage.getItem('content')
}

let saver = window.setInterval(save,2000)

window.onload = function(){read()}