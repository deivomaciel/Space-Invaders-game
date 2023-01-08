const gameStatus = {
    gameOver: false,
    victory: false,
    poused: false,
    controller: 0,
    speed: 500,
    score: 0,
}

const shipData = {
    currentPositon: 332,
    direction: 1,
    stop: false
}

const shotData = {
    thereIsAShot: false,
    currentPositon: 0,
    lastPosition: 0,
    toNextPosition: 0
}

const enemyData = {
    currentPositon: 0,
    nextPosition: 0,
    direction: 'right',
    Borderflag: true,
    jumpFlag: true,
    leftJumpFlag: true,
    boxLimit: 304
}

function createBoxes() {
    const grid =  document.querySelector('.grid')
    const quantityOfBoxes = 361
    
    for(let i = 0; i < quantityOfBoxes; i++) {
        let box = document.createElement('div')
        grid.appendChild(box)
    }
}

function renderShip() {
    const boxes = document.querySelectorAll('.grid div')
    boxes[shipData.currentPositon].classList.add('ship')
}

function renderEnemy() {
    const boxes = document.querySelectorAll('.grid div')
    let totalEnemys = []
    let horizontalController = 3

    while(totalEnemys.length < 52) {
        if(boxes[horizontalController].offsetLeft >= boxes[16].offsetLeft) {
            horizontalController += 6
        }

        boxes[horizontalController].classList.add('enemy')
        horizontalController++
        totalEnemys = document.querySelectorAll('.enemy')
    }
}

function moveShip(direction) {
    shipData.currentPositon += direction
    shipData.currentPositon > 341 && shipData.currentPositon--
    shipData.currentPositon < 323 && shipData.currentPositon++
}

function verifyKeyPressed() {
    const shipMovementStrategy = {
        KeyE() {
            gameStatus.poused = !gameStatus.poused
        },

        KeyA() {
            shipData.direction = -1
            moveShip(shipData.direction)
        },
        
        KeyD() {
            shipData.direction = 1
            moveShip(shipData.direction)
        },
    
        Space() {
            shotData.thereIsAShot = true
            shotData.currentPositon = shipData.currentPositon
        }
    }

    function callShipFunctions() {
        const movients = shipMovementStrategy
        document.addEventListener('keypress', e => {
            shipMovementStrategy[e.code] && movients[e.code]()
        })
    }
    return {callShipFunctions}
}

function updateShipPosition() {
    const boxes = document.querySelectorAll('.grid div')
    
    if(shipData.direction == 1) {
        boxes[shipData.currentPositon - 1].classList.remove('ship')
    } else {
        boxes[shipData.currentPositon + 1].classList.remove('ship')
    }
    boxes[shipData.currentPositon].classList.add('ship')
}

function verifyHit() {
    const boxes = document.querySelectorAll('.grid div')

    if(boxes[shotData.currentPositon].classList[0] == 'enemy' || boxes[shotData.currentPositon].classList[0] == 'img2') {
        shotData.thereIsAShot = false
        boxes[shotData.currentPositon].classList.remove('shot')
        boxes[shotData.currentPositon].classList.remove('enemy')
        boxes[shotData.currentPositon].classList.remove('img2')
        gameStatus.score += 5
        console.log(gameStatus.score)
    } 
    
    else if(boxes[shotData.currentPositon].offsetTop <= boxes[0].offsetTop) {
        shotData.thereIsAShot = false
        boxes[shotData.currentPositon].classList.remove('shot')
    }
}

function updateShotPosition() {
    const boxes = document.querySelectorAll('.grid div')
    const nextPosition = 19
    shotData.currentPositon -= nextPosition

    boxes[shotData.currentPositon].classList.add('shot')
    shotData.lastPosition =  shotData.currentPositon + nextPosition
    boxes[shotData.lastPosition].classList.remove('shot')
    verifyHit()
}

function verifyGameOver() {
    const boxes = document.querySelectorAll('.grid div')

    for(let i = enemyData.boxLimit; i < 341; i++) {
        boxes[i].classList[0] == 'enemy' && (gameStatus.gameOver = true)
    }
}

function updateEnemyPosition() {
    const boxes = document.querySelectorAll('.grid div')
    const enemys = document.querySelectorAll('.enemy')
    const enemysPosition = []
    const enemysInversePosition = []

    for(let i = boxes.length - 1; i != 0; i--) {
        boxes[i].classList[0] == 'enemy' && enemysInversePosition.push(i)
    }

    for(let i = 0; i < boxes.length - 1; i++) {
        boxes[i].classList[0] == 'enemy' && enemysPosition.push(i)
    }

    enemys.forEach(enemy => {
        if(enemy.offsetLeft == boxes[18].offsetLeft) {
            enemyData.jumpFlag = false
            enemyData.direction = 'left'
        }

        if(enemy.offsetLeft == boxes[0].offsetLeft) {
            enemyData.direction = 'right'
            enemyData.leftJumpFlag = false
        }
    })

    if(enemyData.direction == 'right') {
        enemysInversePosition.forEach(position => {
            boxes[position].classList.remove('enemy')
            boxes[position + 1].classList.add('enemy')
        })

        if(enemyData.Borderflag) {
            enemyData.Borderflag = !enemyData.Borderflag
            for(let i = 0; i < boxes.length; i++) {
                if(boxes[i].classList[0] == 'enemy') {
                    boxes[i].classList.add('img2')
                }
            }
        } else if(!enemyData.Borderflag){
            enemyData.Borderflag = !enemyData.Borderflag
            for(let i = 0; i < boxes.length; i++) {
                if(boxes[i].classList[0] == 'img2') {
                    boxes[i].classList.remove('img2')
                }
            }
        }
        
    } else if(enemyData.direction == 'left') {
        enemysPosition.forEach(position => {
            boxes[position].classList.remove('enemy')
            boxes[position - 1].classList.add('enemy')
        })
        if(enemyData.Borderflag) {
            enemyData.Borderflag = !enemyData.Borderflag
            for(let i = 0; i < boxes.length; i++) {
                if(boxes[i].classList[0] == 'enemy') {
                    boxes[i].classList.add('img2')
                }
            }
        } else if(!enemyData.Borderflag){
            enemyData.Borderflag = !enemyData.Borderflag
            for(let i = 0; i < boxes.length; i++) {
                if(boxes[i].classList[0] == 'img2') {
                    boxes[i].classList.remove('img2')
                }
            }
        }
    }
    verifyGameOver()
}

// mona-github-github-g59jpq2w5w7.github.dev

function jumpToDown() {
    const boxes = document.querySelectorAll('.grid div')
    const enemys = document.querySelectorAll('.enemy')
    const enemysPosition = []

    for(let i = 0; i < boxes.length - 1; i++) {
        boxes[i].classList[0] == 'enemy' && enemysPosition.push(i)
    }

    if(!enemyData.jumpFlag) {
        enemyData.jumpFlag = true

        enemys.forEach(enemy => {
            enemy.classList.remove('enemy')
        })

        enemysPosition.forEach(enemy => {
            boxes[enemy + 19].classList.add('enemy')
        })        
    }

    if(!enemyData.leftJumpFlag) {
        enemyData.leftJumpFlag = true

        enemys.forEach(enemy => {
            enemy.classList.remove('enemy')
        })

        enemysPosition.forEach(enemy => {
            boxes[enemy + 19].classList.add('enemy')
        })        
    }
}

function updateScore() {
    const score = document.querySelector('.score-content')
    score.innerHTML = `Score: ${gameStatus.score}`
}

function verifyVictory() {
    const totalEnemys = document.querySelectorAll('.enemy')
    totalEnemys.length == 0 ? gameStatus.victory = true : gameStatus.victory = false
}

function observer() {
    let functionList = []
    
    function addFunction(func) {
        functionList.push(func)
    }

    function callFunctions() {
        for(func in functionList) {
            functionList[func]()
        }
    }
    return {
        addFunction,
        callFunctions
    }
}

function loop() { 
    updateShipPosition()
    shotData.thereIsAShot && updateShotPosition()
    jumpToDown()
    updateScore()
    verifyVictory()
    requestAnimationFrame(loop)
}

const keypressed = verifyKeyPressed()
const notify = observer()

window.onload = () => {
    const popUp = document.querySelector('.game-over-container')
    const finalScore = document.querySelector('.final-score')
    const title = document.querySelector('.game-over-text p')

    keypressed.callShipFunctions()
    notify.addFunction(createBoxes)
    notify.addFunction(renderShip)
    notify.addFunction(renderEnemy)
    notify.callFunctions()

    document.querySelector('.play-again-btt').addEventListener('click', () => {
        location.reload()
    })

    let enemyPosition = setInterval(i => {
        !gameStatus.poused && updateEnemyPosition()

        if(gameStatus.victory || gameStatus.gameOver) {
            clearInterval(enemyPosition)
            gameStatus.victory ? title.innerHTML = 'WINNER' : title.innerHTML = 'GAME<br>OVER'
            finalScore.innerHTML = gameStatus.score
            popUp.style.display = "flex"
        }
    }, gameStatus.speed)
    loop()
}

