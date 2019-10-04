
let flagCount

let cellAmount

let openedCellAmount = 0

let bombsAmount = 0

let flagsAmount = 0

let looseWin = false

const field = document.querySelector('.play-field');

const statusText = document.querySelector('.status-text')

const flagBombCount = document.querySelector('.flags-to-bombs')

const inputWrap = document.querySelector('.start-div')

const userInput = document.querySelector('.start-input')

const submitAmountBtn = document.querySelector('.start-submit-btn')

const restart = document.querySelector('.restart-btn')

//рандомайзер для растоновки бомб
const randomiz = (amount) => {
    return  randomNumb = Math.round(Math.random()* (amount - 1) );
};

//функция расставляющая бомбы по карте

const setBombs = (amount, cellsArr) => {

    let bombCount = 0;

    bombsAmount = Math.round((amount / 6))

    while (bombCount < bombsAmount) {

        const numb = randomiz(amount);
        console.log(numb);

        if (cellsArr[numb].dataset.type !== '1') {
            cellsArr[numb].dataset.type = '1';
            bombCount++;
        }
    }
}

function lookAround( numbers , rows = [parentRow, topRow, botRow]) {

        let bombsAround = 0
    
        rows.forEach((row) => {
            if(row){
                const rowChildren = row.children
    
                numbers.forEach((elem) => {
                    if(elem > 0 && elem < 9 ) {
                        if(rowChildren[elem - 1].dataset.type === "1") {
                            bombsAround++
                        }
                    }
                })
            }
        })
    
        return bombsAround

}

function checkNeighbors( numbers , rows = [parentRow, topRow, botRow]) {

        rows.forEach((row) => {
            if(row){
                const rowChildren = row.children
                numbers.forEach((elem) => {
                    if(elem > 0 && elem < 9 ) {
                        if(rowChildren[elem - 1].dataset.type !== "1") {
                            checkCell(rowChildren[elem - 1])
                        }
                    }
                })
            }
        })
}


//function to check all cells around
function checkCell(elem){
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

            console.log("opened", openedCellAmount);

            if(!enemiesQty){
                checkNeighbors(neededCellsArr, [elemParent, parentNeghT, parentNeghB])
            }  
        }   
        //  иф для нажатия на бомбу- при котором ты проигрываешь
        if (event.target.dataset.type === '1') {
                const bombs = document.querySelectorAll('[data-type="1"]');
                bombs.forEach((elem) => {
                    elem.classList.add('bomb-loose');
                    statusText.classList.add("loose-text")
                    statusText.innerText = "YOU LOOSE"
                    looseWin = true
                });
        }
}



function generateCells (qauntity) {
    
    cellAmount = qauntity * qauntity

    flagsNBombs = Math.round((cellAmount / 6))

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
                if(!looseWin){
                    
                    checkCell(event.target)
                    if(openedCellAmount === cellAmount - flagsNBombs){
                        const bombs = document.querySelectorAll('[data-type="1"]');
                        bombs.forEach((elem) => {
                            elem.classList.add('bomb-win');
                            statusText.classList.add("win-text")
                            statusText.innerText = "YOU WIN"
                            looseWin = true
                        });

                    }

                }
            })

            //Ивент для правой кнопки мыши
            everyCell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                    if(restart.className === "restart-btn"){
                        restart.className = "restart-show"
                    }
                    if(!looseWin){
                        if(event.target.dataset !== "3"){
                            if(event.target.className.includes("flag")){
                                event.target.classList.remove("flag")
                                flagsAmount = flagsAmount - 1
                            } else if(flagsAmount < bombsAmount){
                                event.target.classList.add("flag")
                                flagsAmount++
                            }
                        }
                        flagBombCount.innerText = `flags to bombs: ${flagsAmount}/${bombsAmount}`
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
    const userAmount = userInput.value
    generateCells(userAmount)
    inputWrap.className = "after-submit"
    userInput.value = ""
})

restart.addEventListener("click", () => {
    flagCount = 0

    cellAmount = 0

    openedCellAmount = 0

    bombsAmount = 0

    flagsAmount = 0

    looseWin = false

    field.innerHTML = ""

    statusText.innerText = ""

    flagBombCount.innerText = ""

    restart.className = "restart-btn"

    inputWrap.className = "start-div"
})