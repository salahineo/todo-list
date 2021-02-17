$(function () {

  /* Random Quotes */

  // Array Of Quotes
  let quotes = [
    "Hard tasks need hard ways.",
    "Finish the most important tasks and stop wasting time on irrelevant activities.",
    "Determine when you are most effective and energized, then plan your tasks within that time.",
    "Never help a child with a task at which he feels he can succeed.",
    "We live in a fantasy world, a world of illusion. The great task in life is to find reality.",
    "The secret of getting ahead is getting started",
    "The greater the effort, the greater the glory.",
    "Before committing to a task, it’s sensible to have a clear idea of our competence.",
    "Do the job and do it well.",
    "Affirm; \"It can be done\"; find a way to get it done."
  ];
  // Show Random Quote
  $(".quote span").text(quotes[Math.ceil(Math.random() * 10) - 1]);

  /* Get Add Task Elements */

  let taskAddButton = document.querySelector(".add-task-button");
  let taskInput = document.querySelector("input");

  /* Add Task Functionality */

  // Set Message Function
  let setMessage = (message, state) => {
    // Get Container Message
    let messageContainer = $(".app-message");
    // Empty Message Container
    messageContainer.empty();
    // Add State Class To Message Container
    messageContainer.attr("class", "app-message " + state);
    // Append Alert To Message Container
    messageContainer.append("<div><i class='fas fa-bell'></i>" + message + "</div>");

    // Show Message
    messageContainer.slideDown().delay(1200).slideUp();
  };

  // Add New Task Function
  let addTask = (taskTitle, taskState) => {
    // Get Tasks List Container
    let tasksListContainer = document.querySelector(".tasks-list");
    // Create Task Container
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task");
    // Create Task Content Container
    let taskContentContainer = document.createElement("div");
    taskContentContainer.setAttribute("class", "task-content");
    // Create Task Check Icon
    let taskCheckIcon = document.createElement("i");
    let taskCheckIconClass = taskState === "completed" ? "fas fa-check-square" : "far fa-square";
    taskCheckIcon.setAttribute("class", taskCheckIconClass);
    // Create Task Content
    let taskContent = document.createElement("span");
    taskContent.setAttribute("class", "task-title " + taskState);
    // Create Task Control Container
    let taskControlContainer = document.createElement("span");
    taskControlContainer.setAttribute("class", "control");
    // Create Edit Control Icon
    let taskControlEdit = document.createElement("i");
    taskControlEdit.setAttribute("class", "fa fa-edit");
    // Create Delete Control Icon
    let taskControlDelete = document.createElement("i");
    taskControlDelete.setAttribute("class", "fa fa-trash");
    // Bundle Task Container
    let taskText = document.createTextNode(taskTitle);
    taskContent.appendChild(taskText);
    taskContentContainer.appendChild(taskCheckIcon);
    taskContentContainer.appendChild(taskContent);
    taskControlContainer.appendChild(taskControlEdit);
    taskControlContainer.appendChild(taskControlDelete);
    taskContainer.appendChild(taskContentContainer);
    taskContainer.appendChild(taskControlContainer);
    tasksListContainer.appendChild(taskContainer);

    // Check Task Button Event
    taskCheckIcon.addEventListener("click", (e) => {
      // Check Current State
      if (e.target.nextSibling.classList.contains("completed")) {
        // Change Task State
        e.target.nextSibling.classList.remove("completed");
        taskCheckIcon.setAttribute("class", "far fa-square");
        // Set Success Message
        setMessage("Don't forget me", "warning");
      } else {
        // Change Task State
        e.target.nextSibling.classList.add("completed");
        taskCheckIcon.setAttribute("class", "fas fa-check-square");
        // Set Success Message
        setMessage("Good job", "success");
      }
      // Update Stats
      updateStats();
      // Save To Localstorage
      save();
    });

    // Edit Task Button Event
    taskControlEdit.addEventListener("click", async (e) => {
      // Get Current Task
      let currentTask = e.target.parentElement.previousElementSibling.children[1];
      // Trigger Edit Modal
      const {value: newTask} = await Swal.fire({
        icon: "info",
        input: "text",
        inputLabel: "Edit Task",
        inputValue: currentTask.innerText,
        confirmButtonText: "Edit",
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        inputValidator: (value) => {
          // Check If No Value In Input
          if (!value) {
            return "You need to write something!";
          }
        }
      });
      // If Edited
      if (newTask) {
        // Change Task Content
        currentTask.innerText = newTask;
        // Save To Localstorage
        save();
        // Trigger Success Message Modal
        Swal.fire(
          "Edited!",
          "Task has been edited.",
          "success"
        );
      }
    });

    // Delete Task Button Event
    taskControlDelete.addEventListener("click", (e) => {
      // Get Current Task
      let currentTask = e.target.parentElement.parentElement;
      // Trigger Delete Modal
      Swal.fire({
        title: "Are you sure to delete this?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dd3333",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete"
      }).then((result) => {
        // On Delete
        if (result.isConfirmed) {
          // Remove Task
          currentTask.remove();
          // Update Stats
          updateStats();
          // Save To Localstorage
          save();
          // Trigger Success Message Modal
          Swal.fire(
            "Deleted!",
            "Task has been deleted.",
            "success"
          );
        }
      });
    });

    // Update Stats
    updateStats();
    // Save To Localstorage
    save();
  };


  // Check Task Function
  let checkTask = () => {
    // Check Input Value
    if (taskInput.value === "") {
      // Set Error Message
      setMessage("Please insert a task to add it.", "danger");
    } else {
      // Add Task Function
      addTask(taskInput.value, "pending");
      // Set Success Message
      setMessage("Task added successfully", "success");
      // Empty Input Value
      taskInput.value = "";
    }
  };

  // Save To Localstorage Function
  let save = () => {
    // Array Of Tasks For Localstorage
    const tasksAsArray = [];
    // Single Task Object
    let obj = {};
    // Get All Tasks
    let tasks = document.getElementsByClassName("task-title");
    // Loop To All Tasks
    for (let i = 0; i < tasks.length; i++) {
      // Store Every Task As Object
      obj = {
        taskName: tasks[i].innerText,
        taskState: tasks[i].classList.contains("completed") === true ? "completed" : "pending"
      };
      // Assign Current Task To The Array
      tasksAsArray.push(obj);
    }
    // Convert Array Of Tasks To String
    let tasksAsString = JSON.stringify(tasksAsArray);
    // Save Tasks As String In Localstorage
    localStorage.setItem("simpleToDoTasks", tasksAsString);
    //console.log(tasksAsString);
  };

  // Update Tasks Stats Function
  let updateStats = () => {
    // Get Stats
    let allTasks = document.getElementsByClassName("task").length;
    let completedTasks = document.getElementsByClassName("task-title completed").length;
    let pendingTasks = allTasks - completedTasks;
    // Update All Tasks State
    $(".tasks-stats .count span").text(allTasks);
    // Update Completed Tasks State
    $(".tasks-stats .completed span").text(completedTasks);
    // Update Pending Tasks State
    $(".tasks-stats .pending span").text(pendingTasks);
  };

  // Event Listener For Add Button
  taskAddButton.addEventListener("click", checkTask);
  // Add Task On Enter Hit
  taskInput.addEventListener("keypress", (e) => {
    // Check If This Key Is 'Enter', Then Trigger Check Task Function
    (e.key === "Enter") ? checkTask() : "";
  });

  /* Retrieve Tasks From Localstorage */

  // Get Tasks From Localstorage
  let tasksAsString = localStorage.getItem("simpleToDoTasks");
  //let tasksAsArray = JSON.parse(tasksAsString);

  // Load Tasks On Window Load
  let loadTasks = (tasks) => {
    // Loop Through All Tasks
    tasks.forEach(task => {
      // Add Tasks To Tasks List Body
      addTask(task.taskName, task.taskState);
    });
    // Update Stats
    updateStats();
  };

  if (tasksAsString !== null && tasksAsString.length > 0) {
    // Load Tasks On Windows Load Event
    window.addEventListener("load", loadTasks(JSON.parse(tasksAsString)));
  } else {
    // Update Stats
    updateStats();
    // Set No Tasks Message
    setMessage("No tasks saved. Insert some now.", "warning");
  }


  /* Filter Tasks */

  // Show All Tasks Filter
  let allTasksFilter = document.querySelector(".tasks-stats .count");
  allTasksFilter.onclick = () => {
    // Show All Tasks
    $(".tasks-list .task").fadeIn();
  };

  // Show Completed Tasks Filter
  let completedTasksFilter = document.querySelector(".tasks-stats .completed");
  completedTasksFilter.onclick = () => {
    // Hide All Tasks
    $(".tasks-list .task").fadeOut();
    // Show Completed Tasks
    $(".tasks-list .task .task-content .task-title.completed").parent().parent().fadeIn();
  };

  // Show Pending Tasks Filter
  let pendingTasksFilter = document.querySelector(".tasks-stats .pending");
  pendingTasksFilter.onclick = () => {
    // Hide All Tasks
    $(".tasks-list .task").fadeOut();
    // Show Completed Tasks
    $(".tasks-list .task .task-content .task-title:not(.completed)").parent().parent().fadeIn();
  };

  // Clear All Tasks Function
  let clearAllTasks = document.querySelector(".clear-all-tasks");
  clearAllTasks.onclick = function () {
    // Trigger Delete Modal
    Swal.fire({
      title: "Are you sure to delete all tasks?",
      text: "You won't be able to revert this!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dd3333",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete"
    }).then((result) => {
      // On Delete
      if (result.isConfirmed) {
        // Remove All Tasks
        $(".tasks-list").empty();
        // Update Stats
        updateStats();
        // Save To Localstorage
        save();
        // Trigger Success Message Modal
        Swal.fire(
          "Deleted!",
          "All tasks has been deleted.",
          "success"
        );
      }
    });
  };

  /* Footer Copyright Year */

  // New Date Object
  let currentDate = new Date();
  // Get Copyright Year Span
  document.getElementById("footer-copyright-year").innerHTML = String(currentDate.getFullYear());
});
