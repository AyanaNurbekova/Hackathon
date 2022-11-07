const SLI = "http://localhost:8001/SLI";

document.body.style.backgroundImage =
  "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGCiMGHt2_v8ASgPvGTig3LLpgv-6nYRIgBQ&usqp=CAU)";

let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let group = document.querySelector("#group");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

let searchInput = document.querySelector("#search");
let searchValue = "";

let editName = document.querySelector("#edit-name");
let editSurName = document.querySelector("#edit-surname");
let editGroup = document.querySelector("#edit-group");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

let list = document.querySelector("#students-list");

let currentPage = 1; //текущая страница
let pageTotalCount = 1; //общая количество страниц
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

btnAdd.addEventListener("click", async function () {
  let obj = {
    name: name.value,
    surname: surname.value,
    group: group.value,
    image: image.value,
  };

  if (
    !obj.name.trim() ||
    !obj.surname.trim() ||
    !obj.group.trim() ||
    !obj.image.trim()
  ) {
    alert("Заполниет поля!");
    return;
  }

  await fetch(SLI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  name.value = "";
  surname.value = "";
  group.value = "";
  image.value = "";

  render();
});

async function render() {
  let students = await fetch(
    `${SLI}?q=${searchValue}&_page=${currentPage}&_limit=6`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  //   drawPaginationButtons();

  list.innerHTML = "";
  students.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `<div class="card m-5" style="width: 18rem;">
      <img src=${element.image} class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${element.name}</h5>
        <p class="card-text">${element.surname}</p>
        <p class="card-text">$ ${element.group}</p>
        <a href="#" id=${element.id} onclick = 'deleteStudent(${element.id})' class="btn btn-danger btn-delete">DELETE</a>
        <a href="#" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-success btn-edit">EDIT</a>
      </div>
    </div>`;

    list.append(newElem);
  });
}
render();


function drawPaginationButtons(){
    fetch(`${SLI}?q=${searchValue}`)
    .then((res) =>  res.json())
    .then((data) => {
        pageTotalCount  = Math.ceil(data.length / 9.); 


        paginationList.innerHTML = '';
        for(let i=1; i < pageTotalCount; i++){

            if(currentPage == i){
                let page1 = document.createElement('li')
                page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
                paginationList.append(page1);
            }else{
                let page1 = document.createElement('li')
                page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
                paginationList.append(page1);  
            };
        };

        //? красим кнопки
        if(currentPage == 1) {
            prev.classList.add('disabled');

        } else {
            prev.classList.remove('disabled');
        }

        if(currentPage == pageTotalCount){
            next.classList.add('disabled');
        }else{
            next.classList.remove('disabled');
        }


    }); 
};

//? кнопка переключения на следующую страницу
prev.addEventListener('click' , () => {
    if(currentPage <= 1){
        return;
    }
    currentPage--
    render();
});

next.addEventListener('click', () => {
    if(currentPage >= pageTotalCount){
        return;
    }
    currentPage++
    render();
})


document.addEventListener('click', function(e){
    if(e.target.classList.contains('page_number')){
        currentPage = e.target.innerText;
        render();
    }
})

function deleteStudent(id) {
  fetch(`${SLI}/${id}`, {
    method: "DELETE",
  }).then(() => render());
}



//! РЕДАКТИРОВАНИЕ ДАННЫХ
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${SLI}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Заполняем поля модалки данными
        editName.value = data.name;
        editSurName.value = data.surname;
        editGroup.value = data.group;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

//!  сохранение изменений данных студентов

editSaveBtn.addEventListener("click", function () {
  let id = this.id; // вытаскиваем из кнопки id и ложим его в перееменную

  let name = editName.value;
  let surname = editSurName.value;
  let group = editGroup.value;
  let image = editImage.value;

  if (!name || !surname || !group || !image) return; // проверка на заполненность полей в модальном окне

  let editedStudent = {
    name: name,
    surname: surname,
    group: group,
    image: image,
  };

  saveEdit(editedStudent, id);
});

function saveEdit(editedStudent, id) {
  fetch(`${SLI}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedStudent),
  }).then(() => {
    render();
  });


  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}

searchInput.addEventListener("input", () => {
  searchValue = searchInput.value;
  render();
});

