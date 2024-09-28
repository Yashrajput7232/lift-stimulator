// document.getElementById('generate').addEventListener('click', generateBuilding);

// let liftState = [];
// let pendingRequests = { up: [], down: [] };
// let liftBusy = [];
// let requestedFloors = { up: new Set(), down: new Set() };
// let liftDirections = []; // To track each lift's current direction

// function generateBuilding() {
//     const errorMessage = document.getElementById('error-message');
//     if (errorMessage) {
//         errorMessage.remove();
//     }

//     const floorsCount = parseInt(document.getElementById('floors').value);
//     const liftsCount = parseInt(document.getElementById('lifts').value);

//     // Input validation
//     if (isNaN(floorsCount) || isNaN(liftsCount) || floorsCount < 1 || liftsCount < 1 || floorsCount == 1) {
//         displayError('Please enter valid positive numbers greater than 1 for both floors and lifts.');
//         return;
//     }

//     const control = document.getElementById('control-panel');
//     control.innerHTML = '';

//     const building = document.getElementById('building');
//     building.innerHTML = '';

//     liftState = Array(liftsCount).fill(1);
//     liftBusy = Array(liftsCount).fill(false);
//     liftDirections = Array(liftsCount).fill(null); // Initialize lift directions as null
//     requestedFloors = { up: new Set(), down: new Set() };

//     // Create floors
//     for (let i = 1; i <= floorsCount; i++) {
//         const floor = document.createElement('div');
        
//         floor.className = 'floor';
//         floor.dataset.floor = i;

//         const floorInfo = document.createElement('div');
//         floorInfo.className = 'floor-info';
        
//         const floorNumber = document.createElement('div');
//         floorNumber.className = 'floor-number';
//         floorNumber.innerText = `Floor ${i}`; // Add floor name





//         const floorButtons = document.createElement('div');
//         floorButtons.className = 'floor-buttons';




//         if (i !== floorsCount) {
//             const upButton = document.createElement('button');
//             upButton.className = 'up';
//             upButton.innerText = '↑';
//             upButton.onclick = () => requestLift(i, 'up');
//             floorButtons.appendChild(upButton);
//         }

//         if (i !== 1) {
//             const downButton = document.createElement('button');
//             downButton.className = 'down';
//             downButton.innerText = '↓';
//             downButton.onclick = () => requestLift(i, 'down');
//             floorButtons.appendChild(downButton);
//         }
//         floorInfo.appendChild(floorButtons); // Append buttons first
//         floorInfo.appendChild(floorNumber); // Append floor name next
        
//         floor.appendChild(floorInfo);
       
//         building.appendChild(floor);
       
        
//     }

//     // Create lifts
//     for (let i = 0; i < liftsCount; i++) {
//         const lift = document.createElement('div');
//         lift.className = 'lift';
//         lift.dataset.lift = i;
//         lift.style.transform = `translateY(0px)`;
//         lift.style.left = `${(i * 70) + 100}px`;
//         building.firstChild.appendChild(lift);
//     }
// }

// function displayError(message) {
//     const controlPanel = document.getElementById('control-panel');
//     const errorMessage = document.createElement('div');
//     errorMessage.id = 'error-message';
//     errorMessage.style.color = 'red';
//     errorMessage.style.marginTop = '10px';
//     errorMessage.innerText = message;
//     controlPanel.appendChild(errorMessage);
// }

// function requestLift(floor, direction) {
//     const button = document.querySelector(`[data-floor="${floor}"] .${direction}`);
    
//     // Change the button color to red when pressed
//     if (button) {
//         button.style.backgroundColor = 'red';
//     }

//     if (requestedFloors[direction].has(floor)) {
//         return;
//     }

//     requestedFloors[direction].add(floor);
//     pendingRequests[direction].push(floor);
//     processNextRequest(direction);
// }

// function processNextRequest(direction) {
//     if (pendingRequests[direction].length === 0) return;

//     const floor = pendingRequests[direction].shift();
//     const lifts = document.querySelectorAll('.lift');
//     const targetY = -(floor - 1) * 112;
//     let closestLift = null;
//     let minDistance = Infinity;

//     lifts.forEach(lift => {
//         const liftIndex = parseInt(lift.dataset.lift);
//         const currentFloor = liftState[liftIndex];
//         const isBusy = liftBusy[liftIndex];
//         const currentDirection = liftDirections[liftIndex];
//         const distance = Math.abs(currentFloor - floor);

//         if (!isBusy && (currentDirection === direction || currentDirection === null)) {
//             if (distance < minDistance) {
//                 closestLift = lift;
//                 minDistance = distance;
//             }
//         }
//     });

//     if (closestLift) {
//         const liftIndex = parseInt(closestLift.dataset.lift);
//         liftBusy[liftIndex] = true;
//         liftDirections[liftIndex] = direction;
//         moveLift(closestLift, liftIndex, floor, targetY, direction);
//     } else {
//         pendingRequests[direction].push(floor);
//         setTimeout(() => processNextRequest(direction), 1000);
//     }
// }

// function moveLift(lift, liftIndex, targetFloor, targetY, direction) {
//     const currentFloor = liftState[liftIndex];
//     const floorsToMove = Math.abs(currentFloor - targetFloor);
//     const moveTime = floorsToMove * 2000;

//     setTimeout(() => {
//         lift.style.transition = `transform ${moveTime}ms ease`;
//         lift.style.transform = `translateY(${targetY}px)`;
//         liftState[liftIndex] = targetFloor;

//         setTimeout(() => {
//             openDoors(lift, liftIndex, targetFloor, direction);
//         }, moveTime);
//     }, 1000);
// }

// function openDoors(lift, liftIndex, targetFloor, direction) {
//     if (!lift.classList.contains('door-open')) {
//         lift.classList.add('door-open');

//          // Reset the button color back to normal
//          const button = document.querySelector(`[data-floor="${targetFloor}"] .${direction}`);
//          if (button) {
//              button.style.backgroundColor = ''; // Reset to default color
//          }

//         setTimeout(() => {
//             closeDoors(lift, liftIndex, direction);
//             requestedFloors[direction].delete(targetFloor);

//             // Check if there are requests in the same direction that the lift can pick up
//             if (requestedFloors[direction].size > 0) {
//                 processNextRequest(direction);
//             } else {
//                 liftDirections[liftIndex] = null; // Reset direction if no more requests in that direction
//             }

//         }, 2500);
//     }
// }

// function closeDoors(lift, liftIndex, direction) {
//     if (lift.classList.contains('door-open')) {
//         lift.classList.remove('door-open');
//     }

//     liftBusy[liftIndex] = false;
//     setTimeout(() => processNextRequest(direction), 500);
// }

document.getElementById('generate').addEventListener('click', generateBuilding);

let liftState = [];
let liftQueue = [];
let isLiftMoving = [];
let requestedFloors = { up: new Set(), down: new Set() };
let liftDirections = []; // To track each lift's current direction

function generateBuilding() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.remove();
    }

    const floorsCount = parseInt(document.getElementById('floors').value);
    const liftsCount = parseInt(document.getElementById('lifts').value);

    // Input validation
    if (isNaN(floorsCount) || isNaN(liftsCount) || floorsCount < 1 || liftsCount < 1 || floorsCount == 1) {
        displayError('Please enter valid positive numbers greater than 1 for both floors and lifts.');
        return;
    }

    const control = document.getElementById('control-panel');
    control.innerHTML = '';

    const building = document.getElementById('building');
    building.innerHTML = '';

    liftState = Array(liftsCount).fill(1);
    isLiftMoving = Array(liftsCount).fill(false);
    liftDirections = Array(liftsCount).fill(null); // Initialize lift directions as null
    requestedFloors = { up: new Set(), down: new Set() };

    // Create floors
    for (let i = 1; i <= floorsCount; i++) {
        const floor = document.createElement('div');
        
        floor.className = 'floor';
        floor.dataset.floor = i;

        const floorInfo = document.createElement('div');
        floorInfo.className = 'floor-info';
        
        const floorNumber = document.createElement('div');
        floorNumber.className = 'floor-number';
        floorNumber.innerText = `Floor ${i}`; // Add floor name

        const floorButtons = document.createElement('div');
        floorButtons.className = 'floor-buttons';

        if (i !== floorsCount) {
            const upButton = document.createElement('button');
            upButton.className = 'up';
            upButton.innerText = '↑';
            upButton.onclick = () => requestLift(i, 'up');
            floorButtons.appendChild(upButton);
        }

        if (i !== 1) {
            const downButton = document.createElement('button');
            downButton.className = 'down';
            downButton.innerText = '↓';
            downButton.onclick = () => requestLift(i, 'down');
            floorButtons.appendChild(downButton);
        }
        floorInfo.appendChild(floorButtons); // Append buttons first
        floorInfo.appendChild(floorNumber); // Append floor name next
        
        floor.appendChild(floorInfo);
        building.appendChild(floor);
    }

    // Create lifts
    for (let i = 0; i < liftsCount; i++) {
        const lift = document.createElement('div');
        lift.className = 'lift';
        lift.dataset.lift = i;
        lift.style.transform = `translateY(0px)`;
        lift.style.left = `${(i * 70) + 100}px`;
        building.firstChild.appendChild(lift);
    }
}

function displayError(message) {
    const controlPanel = document.getElementById('control-panel');
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.style.marginTop = '10px';
    errorMessage.innerText = message;
    controlPanel.appendChild(errorMessage);
}

function requestLift(floor, direction) {
    const button = document.querySelector(`[data-floor="${floor}"] .${direction}`);
    
    // Change the button color to red when pressed
    if (button) {
        button.style.backgroundColor = 'red';
    }

    if (requestedFloors[direction].has(floor)) {
        return;
    }

    requestedFloors[direction].add(floor);
    liftQueue.push({ floor, direction });
    processLiftQueue();
}

function processLiftQueue() {
    if (liftQueue.length === 0) return;

    for (let i = 0; i < isLiftMoving.length; i++) {
        if (!isLiftMoving[i]) {
            const { floor, direction } = liftQueue.shift();
            moveLift(i, floor, direction);
            break;
        }
    }
}

function moveLift(liftIndex, targetFloor, direction) {
    const lift = document.querySelector(`.lift[data-lift="${liftIndex}"]`);
    const currentFloor = liftState[liftIndex];
    const targetY = -(targetFloor - 1) * 112;
    const moveTime = Math.abs(currentFloor - targetFloor) * 2000; // Assuming 2 seconds per floor

    isLiftMoving[liftIndex] = true;
    liftDirections[liftIndex] = direction;

    lift.style.transition = `transform ${moveTime}ms ease`;
    lift.style.transform = `translateY(${targetY}px)`;
    liftState[liftIndex] = targetFloor;

    setTimeout(() => {
        openDoors(lift, liftIndex, targetFloor, direction);
    }, moveTime);
}

function openDoors(lift, liftIndex, targetFloor, direction) {
    if (!lift.classList.contains('door-open')) {
        lift.classList.add('door-open');

        // Reset the button color back to normal
        const button = document.querySelector(`[data-floor="${targetFloor}"] .${direction}`);
        if (button) {
            button.style.backgroundColor = ''; // Reset to default color
        }

        setTimeout(() => {
            closeDoors(lift, liftIndex, direction);
            requestedFloors[direction].delete(targetFloor);

            // Check if there are requests in the same direction that the lift can pick up
            if (requestedFloors[direction].size > 0) {
                processLiftQueue();
            } else {
                liftDirections[liftIndex] = null; // Reset direction if no more requests in that direction
            }

        }, 2500);
    }
}

function closeDoors(lift, liftIndex, direction) {
    if (lift.classList.contains('door-open')) {
        lift.classList.remove('door-open');
    }

    isLiftMoving[liftIndex] = false;
    setTimeout(() => processLiftQueue(), 500);
}