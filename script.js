//books - main div holding all the books
const books = document.querySelector(".books");
const addBook = document.querySelector(".add-book");
const modal = document.querySelector("#modal");
const span = document.querySelector(".close");
const addBookForm = document.querySelector(".add-book-form");

addBookForm.onsubmit = (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  let newBook = {};

  for (let [name, value] of data) {
    if (name === "book-read") {
      newBook["book-read"] = true;
    } else {
      newBook[name] = value || "";
    }
  }

  if (!newBook["book-read"]) {
    newBook["book-read"] = false;
  }

  if (document.querySelector(".form-title").textContent === "Edit Book") {
    let id = e.target.id;
    let editBook = myLibrary.filter((book) => book.id == id)[0];
    editBook.title = newBook["book-title"];
    editBook.author = newBook["book-author"];
    editBook.pages = newBook["book-pages"];
    editBook.read = newBook["book-read"];

    saveAndRenderBooks();
  } else {
    addBookToLibrary(
      newBook["book-title"],
      newBook["book-author"],
      newBook["book-pages"],
      newBook["book-read"]
    );
  }

  addBookForm.reset();
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};

span.onclick = () => {
  modal.style.display = "none";
};
addBook.onclick = () => {
  modal.style.display = "block";
  document.querySelector(".form-title").textContent = "Add new book";
  document.querySelector(".form-add-button").textContent = "Add";
};

//array of books
let myLibrary = [];

function Book(title, author, pages, read) {
  (this.title = title),
  (this.author = author),
  (this.pages = pages),
  (this.read = read),
  this.id = Math.floor(Math.random() * 1000);
}

function fillOutEditForm(book) {
  modal.style.display = "block";
  document.querySelector(".form-title").textContent = "Edit Book";
  document.querySelector(".form-add-button").textContent = "Save";
  document.querySelector(".add-book-form").setAttribute("id", book.id);
  document.querySelector("#book-title").value = book.title || "";
  document.querySelector("#book-author").value = book.author || "";
  document.querySelector("#book-pages").value = book.pages || "";
  document.querySelector("#book-read").value = book.read || "";
}

function addBookToLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
  saveAndRenderBooks();
}

//helpter function to create html elements with textcontent and classes
function createBookElement(el, content, className) {
  const element = document.createElement(el);
  element.textContent = content;
  element.setAttribute("class", className);

  return element;
}

//helper function to create an input checkbox of if book is read w/ event listener
function createReadElement(bookItem, book) {
  const read = document.createElement("div");
  read.setAttribute("class", "book-read");
  read.appendChild(createBookElement("h4", "Read?", "book-read-title"));
  let input = document.createElement("input");
  input.type = "checkbox";
  input.addEventListener("click", (e) => {
    if (e.target.checked) {
      bookItem.setAttribute("class", "read-checked card-book");
      book.read = true;
      saveAndRenderBooks();
    } else {
      bookItem.setAttribute("class", "read-unchecked card-book");
      book.read = false;
      saveAndRenderBooks();
    }
  });

  if (book.read) {
    input.checked = true;
    bookItem.setAttribute("class", "read-checked card-book");
  }
  read.appendChild(input);

  return read;
}

//create a function that delete the booth w/ on click called in create book item
function deleteBook(index) {
  myLibrary.splice(index, 1);
  saveAndRenderBooks();
}

function addLocalStorage() {
  //localStorage => save things in key value pairs - key = library : myLabrary
  //MDN check !!!
  // localStorage.setItem('library', JSON.stringify([
  //   {
  //     title: 'Book1',
  //     author: 'Erik',
  //     pages: 12,
  //     read: false
  //   }
  // ]))
  myLibrary = JSON.parse(localStorage.getItem("library")) || [];
  saveAndRenderBooks();
}

//create dummy icons, the don't do anything
function createIcon() {
  const div = createBookElement("div", null, "icons");
  const icon1 = document.createElement("img");
  //icon1.src = '../icons/start-plus-outline.svg';
  const icon2 = document.createElement("img");
  //icon2.src = '../icons/start-plus-outline.svg';
  const icon3 = document.createElement("img");
  //icon3.src = '../icons/start-plus-outline.svg';

  div.appendChild(icon1);
  div.appendChild(icon2);
  div.appendChild(icon3);

  return div;
}

//create edit icon w/ event listener
function createEditIcon(book) {
  const editIcon = document.createElement("img");
  editIcon.src = "";
  editIcon.setAttribute("class", "edit-icon");
  editIcon.click = (e) => {
    fillOutEditForm(book);
  };

  return editIcon;
}

//Function to create all of the book content on the book
function createBookItem(book, index) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("id", index);
  bookItem.setAttribute("key", index);
  bookItem.classList.add("card-book");
  bookItem.appendChild(
    createBookElement("h2", "Title: " + book.title, "book-title")
  );
  bookItem.appendChild(
    createBookElement("h3", "Author: " + book.author, "book-author")
  );
  bookItem.appendChild(
    createBookElement("h4", "Pages: " + book.pages, "book-pages")
  );
  bookItem.appendChild(createReadElement(bookItem, book));
  bookItem.appendChild(createBookElement("button", "X", "delete"));
  bookItem.appendChild(createBookElement("button", "edit", "edit"));
  bookItem.appendChild(createIcon());
  bookItem.appendChild(createEditIcon(book));

  bookItem.querySelector(".delete").onclick = () => deleteBook(index);
  bookItem.querySelector(".edit").onclick = () => fillOutEditForm(book);

  books.insertAdjacentElement("afterbegin", bookItem);
}

//function to render all the books
function renderBooks() {
  books.textContent = "";
  myLibrary.map((book, index) => {
    createBookItem(book, index);
  });
}

function saveAndRenderBooks() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
  renderBooks();
}

//render on page load
addLocalStorage();
