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

    const floorsInput = document.getElementById('floors').value;
    const liftsInput = document.getElementById('lifts').value;

    const floorsCount = parseInt(floorsInput, 10);
    const liftsCount = parseInt(liftsInput, 10);

    // Input validation
    if (isNaN(floorsCount) || isNaN(liftsCount) || floorsCount < 1 || liftsCount < 1 || floorsCount == 1 || !Number.isInteger(floorsCount) || !Number.isInteger(liftsCount) || floorsInput.includes('.') || liftsInput.includes('.')) {
        displayError('Please enter valid positive integer numbers greater than 1 for both floors and lifts.');
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

    const { floor, direction } = liftQueue.shift();
    const nearestLiftIndex = findNearestLift(floor);

    if (nearestLiftIndex !== -1) {
        moveLift(nearestLiftIndex, floor, direction);
    }
}

function findNearestLift(targetFloor) {
    let nearestLiftIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < liftState.length; i++) {
        if (!isLiftMoving[i]) {
            const distance = Math.abs(liftState[i] - targetFloor);
            if (distance < minDistance) {
                minDistance = distance;
                nearestLiftIndex = i;
            }
        }
    }

    return nearestLiftIndex;
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