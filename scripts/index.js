// user value from input
let userValue 
// amount of cells on current field
let cellAmount
// amount of opened cells on current field
let openedCellAmount = 0
// amount of bombs on current field
let bombsAmount = 0
// flag counter
let flagCount = 0
// game anabler
let loseWin = false
// field for cells
const field = document.querySelector('.play-field');
// text with status of your game
const statusText = document.querySelector('.status-text')
// visual counter flags to bombs
const flagBombCount = document.querySelector('.flags-to-bombs')
// case for user input
const inputWrap = document.querySelector('.start-div')
// input where user can enter amount of cells( one side duplicates other one)
const userInput = document.querySelector('.start-input')
// button to submit user's value
const submitAmountBtn = document.querySelector('.start-submit-btn')
// button to restart the hole game
const restart = document.querySelector('.restart-btn')

//randomizer for bombs
const randomiz = (amount) => {
    return  randomNumb = Math.round(Math.random()* (amount - 1) );
};

//function to set all the bombs
const setBombs = (amount, cellsArr) => {

    let bombCount = 0;

    bombsAmount = Math.floor((amount / 6))

    while (bombCount < bombsAmount) {

        const numb = randomiz(amount);

        if (cellsArr[numb].dataset.type !== '1') {
            cellsArr[numb].dataset.type = '1';
            bombCount++;
        }
    }
}

// function wich checks all cells around element
function lookAround( numbers , rows = [parentRow, topRow, botRow]) {

        let bombsAround = 0
    
        rows.forEach((row) => {
            if(row){
                const rowChildren = row.children
    
                numbers.forEach((elem) => {
                    if(elem > 0 && elem < userValue ) {
                        if(rowChildren[elem - 1].dataset.type === "1") {
                            bombsAround++
                        }
                    }
                })
            }
        })
    
        return bombsAround

}

// function wich checks all neighbors of our target element as a target elements (works only if all neighbors are not bombs)
function checkNeighbors( numbers , rows = [parentRow, topRow, botRow]) {
        rows.forEach((row) => {
            if(row){
                const rowChildren = row.children
                numbers.forEach((elem) => {
                    if(elem > 0 && elem < userValue ) {
                        if(rowChildren[elem - 1].dataset.type !== "1") {
                            checkCell(rowChildren[elem - 1])
                        }
                    }
                })
            }
        })
}


//function to check all neighbor cells around target element
function checkCell(elem){
    if(!elem.classList.contains("flag")){
        if(elem.dataset.type === "0"){
            elem.dataset.type = "3"
            elem.classList.remove("flag")
            
            const elemParent = elem.parentElement
            const parentNeghT = elemParent.previousElementSibling
            const parentNeghB = elemParent.nextElementSibling
    
            const startPoint = +elem.dataset.number
    
            const neededCellsArr = [startPoint, startPoint - 1, startPoint + 1]
    
            const enemiesQty = lookAround(neededCellsArr, [elemParent, parentNeghT, parentNeghB])
            
            elem.firstChild.innerText = enemiesQty

            openedCellAmount++

            if(!enemiesQty){
                checkNeighbors(neededCellsArr, [elemParent, parentNeghT, parentNeghB])
            }  
        }   
        //  case if target element is a bomb
        if (event.target.dataset.type === '1') {
                const bombs = document.querySelectorAll('[data-type="1"]');
                bombs.forEach((elem) => {
                    elem.classList.remove('flag');
                    elem.classList.add('bomb-lose');
                    statusText.classList.add("lose-text")
                    statusText.innerText = "YOU LOSE"
                    loseWin = true
                });
        }
        }
}



function generateCells (qauntity) {
    
    cellAmount = qauntity * qauntity

    userValue = +qauntity + 1

    flagsNBombs = Math.floor((cellAmount / 6))

    let rowsCount = 0,
        cellCount = 0

    while(rowsCount < qauntity){
        let everyRow = document.createElement("div")
        everyRow.className = "field-row"
        everyRow.setAttribute("data-number", `${rowsCount + 1}`)
        field.appendChild(everyRow)
        while(cellCount < qauntity){
            let everyCell = document.createElement("div")
            let everyCellP = document.createElement("p")
            everyCell.appendChild(everyCellP)
            everyCell.className = "field-cell"
            everyCell.setAttribute("data-number", `${cellCount + 1}`)
            everyCell.setAttribute("data-type", `0`)


            
            //Ивент для левой кнопки мыши
            everyCell.addEventListener("click", (event) => {
                if(restart.className === "restart-btn"){
                    restart.className = "restart-show"
                }
                if(!loseWin){
                    
                    checkCell(event.target)
                    if(openedCellAmount === cellAmount - flagsNBombs){
                        const bombs = document.querySelectorAll('[data-type="1"]');
                        bombs.forEach((elem) => {
                            elem.classList.add('bomb-win');
                            statusText.classList.add("win-text")
                            statusText.innerText = "YOU WIN"
                            loseWin = true
                        });

                    }

                }
            })

            //Ивент для правой кнопки мыши
            everyCell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                if(event.target.classList.contains("field-cell")){
                    if(restart.className === "restart-btn"){
                        restart.className = "restart-show"
                    }
                    if(!loseWin){
                        if(event.target.dataset.type !== "3"){
                            if(event.target.className.includes("flag")){
                                event.target.classList.remove("flag")
                                flagCount = flagCount - 1
                            } else if(flagCount < bombsAmount){
                                event.target.classList.add("flag")
                                ++flagCount
                            }
                            if(flagCount === bombsAmount){
                                const bombs = document.querySelectorAll('[data-type="1"]');
                                let bombsFlaged = 0
                                bombs.forEach((elem) => {
                                    if(elem.classList.contains("flag")){
                                        bombsFlaged++
                                    }
                                })
                                if(bombsAmount === bombsFlaged){
                                    bombs.forEach((elem) => {
                                        elem.classList.add('bomb-win');
                                        statusText.classList.add("win-text")
                                        statusText.innerText = "YOU WIN"
                                        loseWin = true
                                    });
                                }
                            }
                        }
                        flagBombCount.innerText = `flags to bombs: ${flagCount}/${bombsAmount}`
                    }
                }
            })

            field.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            })

            everyRow.appendChild(everyCell)
            cellCount++
        }
        rowsCount++
        cellCount = 0
    }

    const cells = document.querySelectorAll('.field-cell');

    setBombs(cellAmount, cells)

}

submitAmountBtn.addEventListener("click", () => {
    if(userInput.value && !isNaN(userInput.value)){
        const userAmount = userInput.value
        generateCells(userAmount)
        inputWrap.className = "after-submit"
        userInput.value = ""
    }
})

restart.addEventListener("click", () => {
    cellAmount = 0

    openedCellAmount = 0

    bombsAmount = 0

    flagCount = 0

    loseWin = false

    field.innerHTML = ""

    statusText.innerText = ""

    flagBombCount.innerText = ""

    restart.className = "restart-btn"

    inputWrap.className = "start-div"
})