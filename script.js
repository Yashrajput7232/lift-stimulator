const floorInput = document.getElementById("floor-input");
const LiftInput = document.getElementById("lift-input");
const submitButton = document.getElementById("submit-btn");
const container = document.getElementById("container");
const liftContainer = document.createElement("div");

// Rest of your code
let floorVal = "";
let liftVal = "";
var prevFloor = 0;

let targetFloors = [];

//on Submit button add values
submitButton.addEventListener("click", () => {
  if (!LiftInput.value && !floorInput.value) {
    alert("Please Enter number to generate Floors and Lifts");
  } else if (!floorInput.value) {
    alert("Please enter number of floor ");
  } else if (!LiftInput.value) {
    alert("Please enter number of lift");
  
  } else if (LiftInput.value < 0 || floorInput.value < 0) {
    alert("No negative values are allowed");
  } else {
    container.innerHTML = " ";
    liftContainer.innerHTML = "";
    for (let i = floorInput.value; i > 0; i--) {
      // make floors
      createFloors(i, LiftInput.value);
    }

    //empty input box
    LiftInput.value = "";
    floorInput.value = "";
  }
});

// make Floors

function createFloors(floors, lifts) {
  const floorDiv = document.createElement("div");

  floorDiv.setAttribute("class", "floordiv");

  const floorContainer = document.createElement("div");
  floorContainer.setAttribute("class", "floor");

  floorContainer.dataset.floor = floors;

  const buttonContainer = document.createElement("div");

  buttonContainer.setAttribute("class", "btn-div");

  const UpButton = document.createElement("button");
  const DownButton = document.createElement("button");

  UpButton.setAttribute("class", "up-down");
  DownButton.setAttribute("class", "up-down");

  UpButton.setAttribute("id", floors);
  DownButton.setAttribute("id", floors);

  UpButton.innerText = "UP";
  DownButton.innerText = "Down";

  UpButton.dataset.floor = floors;
  DownButton.dataset.floor = floors;

  buttonContainer.append(UpButton);
  buttonContainer.append(DownButton);

  let floorNumber = document.createElement("p");

  floorNumber.setAttribute("class", "floorName");

  floorNumber.innerText = `Floor ${floors}`;

  buttonContainer.append(floorNumber);

  floorContainer.append(buttonContainer);

  floorDiv.append(floorContainer);

  container.append(floorDiv);

  //Logic to generate Lifts

  for (let j = 0; j < lifts; j++) {
    //Check all lifts should be on 1st
    if (floors === 1) {
      let Lifts = document.createElement("div");
      Lifts.setAttribute("class", "lift-div");

      Lifts.setAttribute("onfloor", 1);

      Lifts.dataset.currentLocation = prevFloor;
      console.log(prevFloor);

      leftDoor = document.createElement("div");
      RightDoor = document.createElement("div");

      leftDoor.setAttribute("class", "left-door");
      RightDoor.setAttribute("class", "right-door");

      Lifts.appendChild(leftDoor);
      Lifts.appendChild(RightDoor);

      liftContainer.appendChild(Lifts);
      liftContainer.setAttribute("class", "lift");

      floorContainer.append(liftContainer);

      floorDiv.append(floorContainer);
    }
  }
}

let x = 0;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("up-down")) {
    if (e.target.dataset.floor === x) {
      return;
    } else {
      LiftStatus(e.target.dataset.floor);
    }

    x = e.target.dataset.floor;
  }
});

function LiftStatus(clickedFloor) {
  const lifts = document.querySelectorAll(".lift-div");

  let pos;

  for (let i = 0; i < lifts.length; i++) {
    if (lifts[i].classList.contains("busy")) {
      let onFloorVal = parseInt(lifts[i].getAttribute("onfloor"));

      if (onFloorVal === clickedFloor) {
        return;
      }
    } else {
      for (let i = 0; i < lifts.length; i++) {
        let onFloorVal = parseInt(lifts[i].getAttribute("onfloor"));

        if (onFloorVal === clickedFloor) {
          MoveLift(clickedFloor, i);
          return;
        }
      }

      pos = i;
      MoveLift(clickedFloor, pos);
      break;
    }
  }

  if (pos === undefined) {
    targetFloors.push(clickedFloor);
  }
}

function MoveLift(clickedFloor, pos) {
  const elevators = document.getElementsByClassName("lift-div");

  const elevator = elevators[pos];

  let currentFloor = elevator.getAttribute("onfloor");
  let duration = Math.abs(parseInt(clickedFloor) - parseInt(currentFloor)) * 2;

  elevator.setAttribute("onfloor", clickedFloor);

  elevator.style.transition = `transform ${duration}s linear`;
  elevator.style.transform = `translateY(-${
    100 * parseInt(clickedFloor) - 100
  }px)`;
  elevator.classList.add("busy");

  setTimeout(() => {
    elevator.children[0].style.transform = "translateX(-100%)";
    elevator.children[1].style.transform = "translateX(100%)";
  }, duration * 1000 + 1000);

  setTimeout(() => {
    elevator.children[0].style.transform = "none";
    elevator.children[1].style.transform = "none";
  }, duration * 1000 + 4000);

  setTimeout(() => {
    elevator.classList.remove("busy");

    if (targetFloors.length) {
      MoveLift(targetFloors.shift(), pos);
    }
  }, duration * 1000 + 7000);
}