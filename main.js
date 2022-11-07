const SLI = "http://localhost:8001/SLI"

let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let group = document.querySelector("#group");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");


let searchInput = document.querySelector('#search');
let searchValue = '';


let editName = document.querySelector('#edit-name')
let editSurName = document.querySelector('#edit-surname')
let editGroup = document.querySelector('#edit-group')
let editImage = document.querySelector('#edit-image')
let editSaveBtn = document.querySelector('#btn-save-edit')
let exampleModal = document.querySelector('#exampleModal')

function deleteStudent(id) {     
    fetch(`${SLI}/${id}`,{
     method: 'DELETE',
    }).then(() => render());  
}