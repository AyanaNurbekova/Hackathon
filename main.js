let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let group = document.querySelector("#group");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

let list = document.querySelector("#students-list");

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
    `${SLI}?q=${searchVal}&_page=${currentPage}&_limit=6`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  drawPaginationButtons();

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
        <a href="#" id=${element.id} onclick = 'deleteProduct(${element.id})' class="btn btn-danger btn-delete">DELETE</a>
        <a href="#" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary btn-edit">EDIT</a>
      </div>
    </div>`;

    list.append(newElem);
  });
}
render();
