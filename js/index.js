//selectors
const taskModalBtn = document.querySelector(".modal-button");
const taskModal = document.querySelector(".task-modal");
const closeModalBtn = document.querySelector(".close-modal");
const taskNameInput = document.querySelector(".task-name");
const addTaskBtn = document.querySelector(".add-task");
const todoListDiv = document.querySelector(".todo-list");
const describeInput = document.querySelector(".describe-Input");
const startTimeInput = document.querySelector(".start-time");
const endTimeInput = document.querySelector(".end-time");
const completedTodo = document.querySelector(".done-task");
const filterOption = document.querySelector(".filter-option");
const completedNumDiv = document.querySelector(".completed-num");
const todosNumDiv = document.querySelector(".todos-num");
const categoryInput = document.querySelector(".category-input");
const categorySelectTag = document.querySelector(".categories");
const todosRangeLineDiv = document.querySelector(".range");
const categoryModalBtn = document.querySelector(".categorymodal-button");
const closeCategoryBtn = document.querySelector(".close-category-modal");
const categoryModal = document.querySelector(".category-modal");
const categoryInputName = document.querySelector(".catrgory-name");
const categoryInputcolor = document.querySelector(".category-color");
const addCategoryBtn = document.querySelector(".add-category");

//Event listeners
document.addEventListener("DOMContentLoaded", getLocalTodos);
document.addEventListener("DOMContentLoaded", getCheckedLocalTodos);
document.addEventListener("DOMContentLoaded", setRangeTodo);
document.addEventListener("DOMContentLoaded", getLocalCategories);
taskModalBtn.addEventListener("click", () => activeModal(taskModal));
addTaskBtn.addEventListener("click", addTodoFunction);
closeModalBtn.addEventListener("click", () => closeModal(taskModal));
todoListDiv.addEventListener("click", checkRemove);
filterOption.addEventListener("click", filterTodos);
categoryModalBtn.addEventListener("click", (e) => {e.preventDefault();
activeModal(categoryModal);
});
addCategoryBtn.addEventListener("click", () => closeModal(categoryModal));
closeCategoryBtn.addEventListener("click", () => closeModal(categoryModal));
addCategoryBtn.addEventListener("click", addCategoryFunction);

//Functions
function activeModal(a) {
    a.classList.add("active");
};

function closeModal(a) {
    a.classList.remove("active");
};

function addTodoFunction(e) {
    e.preventDefault();

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const innerTodo = `
    <button class="check-task"></button>
    <div class="task-options">
        <h4 class="task-title">${taskNameInput.value}</h4>
        <p class="describe">${describeInput.value}</p>
        <p class="long-time">${startTimeInput.value} - ${endTimeInput.value}</p>
    </div>
    <div class="task-manage">
        <p class="task-category">${categorySelectTag.value}</p>
        <div class="task-buttons">
            <button class="edit-task"></button>
            <button class="delete-task"></button>
        </div>
    </div>
    `;
    todoDiv.innerHTML = innerTodo;
 
    todoDiv.style.backgroundColor = `${categoryInputcolor.value}40`;
    todoDiv.children[0].style.backgroundColor = categoryInputcolor.value;



    if (categorySelectTag.value === "") {
        alert("Make and choose category!");
    } else  if (taskNameInput.value === "") {
        alert("Write task name!");
    } else {
        todoListDiv.appendChild(todoDiv);
    }

    let todo = {
        title: taskNameInput.value,
        describe: describeInput.value,
        start: startTimeInput.value,
        end: endTimeInput.value,
        category: categorySelectTag.value.split(" ").join("-"),
    }

    saveLocalTodos(todo);
    setRangeTodo();
    localTodosSetColor();

    taskNameInput.value = "";
    describeInput.value = "";
    startTimeInput.value = "";
    endTimeInput.value = "";
    // categoryInputcolor.value="#673AB7";

};

function checkRemove(e) {
    const item = e.target;
    const classList = [...item.classList];

    if (classList[0] === "delete-task") {
        const todo = item.parentElement.parentElement.parentElement;

        todo.remove();
        removeLocalTodos(todo);
        setRangeTodo();
    } else if (classList[0] === "check-task") {
        const todo = item.parentElement;

        todo.classList.toggle("checked");
        item.classList.toggle("check");
        checkedLocalTodos(todo);
        setRangeTodo();
    }
};

function filterTodos(e) {
    // console.log(e.target.value);
    // console.log(todoListDiv.childNodes);
    const todos = [...todoListDiv.childNodes];
    todos.forEach((todo) => {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains("checked")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains("checked")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }

        let savedCategories = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : [];
        
        savedCategories.forEach((cat) => {
            switch (e.target.value) {

                case cat.catName:
                    if (todo.classList.contains(cat.catName)) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
            }
        })
    });
};

function saveLocalTodos(todo) {
    let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    if (todo.title !== "" && todo.category) {
        savedTodos.push(todo);
    }
    localStorage.setItem("todos", JSON.stringify(savedTodos));
}

function getLocalTodos() {
    let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];

    savedTodos.forEach((todo) => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo", todo.category);
        const innerTodo = `
        <button class="check-task "></button>
        <div class="task-options">
            <h4 class="task-title">${todo.title}</h4>
            <p class="describe">${todo.describe}</p>
            <p class="long-time">${todo.start} - ${todo.end}</p>
        </div>
        <div class="task-manage">
            <p class="task-category">${todo.category.split("-").join(" ")}</p>
            <div class="task-buttons">
                <button class="edit-task"></button>
                <button class="delete-task"></button>
            </div>
        </div>`;
        todoDiv.innerHTML = innerTodo;
        todoDiv.style.backgroundColor = `${todo.color}40`;
        todoDiv.children[0].style.backgroundColor = todo.color;

        todoListDiv.appendChild(todoDiv);

    });
}

function removeLocalTodos(todo) {
    let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    // console.log(todo);
    const filterTodo = savedTodos.filter((t) => t.title !== todo.children[1].children[0].innerText);
    localStorage.setItem("todos", JSON.stringify(filterTodo));
}

function checkedLocalTodos(todo) {

    let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    savedTodos.forEach(sth => {

        switch (todo.classList.value.includes('checked')) {
            case false:
                if (sth.title === todo.children[1].children[0].innerText) {
                    delete sth.checkedClass;
                }
                break;


            case true:
                if (sth.title === todo.children[1].children[0].innerText) {
                    sth.checkedClass = "checked";
                }
                break;

        }

    });

    localStorage.setItem("todos", JSON.stringify(savedTodos));

}

function getCheckedLocalTodos() {

    let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    savedTodos.filter((todo) => {
        if (todo.checkedClass === "checked") {
            const topic = [...document.querySelectorAll(".task-title")];
            topic.forEach((t) => {
                if (t.innerText === todo.title) {
                    t.parentElement.parentElement.classList.add("checked");
                    t.parentElement.parentElement.children[0].classList.add("check");
                }
            });
        }
    });
}

function setRangeTodo() {
    const todos = [...todoListDiv.childNodes];
    let allTodosNum = todos.length;

    let completedTodoArray = todos.filter(todo => todo.classList.contains("checked"));
    let completedTodoNum = completedTodoArray.length

    const persentRange = Math.floor((completedTodoNum / allTodosNum) * 100);
    // console.log(persentRange);
    todosRangeLineDiv.style.width = `${persentRange}%`;

    todosNumDiv.innerHTML = allTodosNum;
    completedNumDiv.innerHTML = completedTodoNum;

}

function addCategoryFunction(e) {
    e.preventDefault();

    const catOption = document.createElement("option");
    if (categoryInputName.value !== "") {
        catOption.classList.add("category");
        catOption.value = categoryInputName.value;
        catOption.innerText = categoryInputName.value;
        categorySelectTag.appendChild(catOption);
        categorySelectTag.value = catOption.value;

        const filterOptionChild = document.createElement("option");
        filterOptionChild.value = categoryInputName.value;
        filterOptionChild.innerText = categoryInputName.value;
        filterOption.appendChild(filterOptionChild);

    } else {
        alert("Write cat name!")
    }
    let cat = {
        catName: categoryInputName.value.split(" ").join("-"),
        catColor: categoryInputcolor.value,
    }
    savedLocalCategories(cat);
    categoryInputName.value = "";
}

function savedLocalCategories(cat) {
    let savedCategories = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : [];
    
    if (cat.catName !== "") {
        savedCategories.push(cat);
    }
    localStorage.setItem("categories", JSON.stringify(savedCategories));

}

function getLocalCategories() {
    let savedCategories = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : [];
    savedCategories.forEach((cat) => {

        const catOption = document.createElement("option");
        catOption.classList.add("category");
        catOption.value = cat.catName;
        catOption.innerText = cat.catName;
        categorySelectTag.appendChild(catOption);

        const filterOptionChild = document.createElement("option");
        filterOptionChild.value = cat.catName;
        filterOptionChild.innerText = cat.catName;
        filterOption.appendChild(filterOptionChild);
        // categoryInputcolor.value = "#673AB7";


    });
}

function localTodosSetColor() {
    let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    savedTodos.forEach(sth => {

        let savedCategories = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : [];

        savedCategories.filter((c) => {
            if (sth.category === c.catName) {
                sth.color = c.catColor;
            }
        });
    });

    localStorage.setItem("todos", JSON.stringify(savedTodos));
}


const randomColorBtn = document.querySelector(".random-color");

randomColorBtn.addEventListener("click",(e)=> {
    e.preventDefault();
    setRandomColor();
});

function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function setRandomColor(){
    categoryInputcolor.value = getRandomColor();
}