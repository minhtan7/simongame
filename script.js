const result = document.getElementById("result")
const leftBtn = result.children[0].children[0]
const startBtn = result.children[0].children[1]
const rightBtn = result.children[0].children[2]
const light = result.children[0].children[3]

const topLeft = document.getElementById("top-left")
const topRight = document.getElementById("top-right")
const botLeft = document.getElementById("bot-left")
const botRight = document.getElementById("bot-right")

const SIGNAL = [topLeft, topRight, botRight, botLeft]
//signal's position represent by number from 0-3
//topLeft: 0; topRight: 1; botRight: 2; botLeft: 3
let signals = []
let userSignals = []
let lose = true
let playing = false
let idLoseTime
let losingFlash = 10
let losingFlashId
let highestScore = 0
let lastScore = 0

//1.1 Click the start button to begin
//the start light switch from red to green, the start after 3s
startBtn.addEventListener("click", () => {
    if (lose) {
        light.classList.remove("stop-light")
        light.classList.add("start-light")
        setTimeout(() => {
            gameStart()
        }, 3000);
    }
})


SIGNAL.forEach((position, index) => {
    position.addEventListener("click", () => {
        //if playing is false, nothing happen when user click the buttons
        if (playing) {
            userPlay(index)

            //flash the chosen button, start count down by 5s
            position.classList.add("flash")
            setTimeout(() => {
                position.classList.remove("flash")
            }, 500);
            checkLoseTime()

            //check if the current move is a losing move
            if (checkLose()) return losingGame()

            //check if user finish current round
            if (checkNextRound()) {
                setTimeout(() => {
                    clearTimeout(idLoseTime)
                    updateGame()
                }, 1000);
            }
        }
    })
})


//2. give signals
const updateGame = () => {
    playing = false

    //create a new copy of signals, and add a random value
    const random = Math.floor(Math.random() * SIGNAL.length)
    signals = [...signals, random]

    //reset userSignals array for new round
    userSignals = []

    //make a constant value that will increase game speed after 5th round
    let times = playSpeedTime(signals.length)

    //loop through signals array, flash the button base on the element in the array
    signals.forEach((el, index) => {
        setTimeout(() => {
            SIGNAL[el].classList.add("flash")
        }, (index + 1) * times);

        setTimeout(() => {
            SIGNAL[el].classList.remove("flash")

            //when reach the final element in signal array, start count down by 5
            //to indicate whether user play next step in 5s. If not, the user lose the game
            if (index === signals.length - 1) {
                checkLoseTime()

                //turn the value of playing to true, meaning user now can click the 
                //four buttons to play the game
            }
            playing = true

        }, (index + 1) * times + 500);

    })

}

//generate time for game speed
const playSpeedTime = (round) => {
    if (round >= 5) {
        return Math.pow(0.6, Math.floor((round - 5) / 4)) * 1000
    }
    return 1000
}
//add current move to userSignals array
const userPlay = (position) => userSignals.push(position)

//check if the current move is a losing move
const checkLose = () => userSignals[userSignals.length - 1] !== signals[userSignals.length - 1]

//check if user finish current round by compare length of signals and userSignals array
const checkNextRound = () => userSignals.length === signals.length

//count down by 5s since user click a button
const checkLoseTime = () => {
    clearTimeout(idLoseTime)
    idLoseTime = setTimeout(() => {
        losingGame()
    }, 5000)
}

//flashing all four buttons simultaneously five times
//reset game state
const losingGame = () => {

    playing = false
    clearTimeout(idLoseTime)
    SIGNAL.forEach((s) => s.classList.remove("flash"))
    losingFlashId = setInterval(() => {
        if (losingFlash % 2 === 0) {
            SIGNAL.forEach((s) => s.classList.add("flash"))
        } else {
            SIGNAL.forEach((s) => s.classList.remove("flash"))
        }
        losingFlash--
        if (losingFlash === 0) {
            light.classList.remove("start-light")
            light.classList.add("stop-light")
            highestScore = highestScore > signals.length - 1 ? highestScore : signals.length - 1
            lastScore = signals.length - 1
            leftBtn.textContent = `0${highestScore}`.slice(-2)
            rightBtn.textContent = `0${lastScore}`.slice(-2)
            signals = []
            userSignals = []
            playing = false
            losingFlash = 10
            SIGNAL.forEach((s) => s.classList.remove("flash"))
            lose = true
            clearInterval(losingFlashId)

        }
    }, 300);
}

//1.2 Click the start button to begin
//reset game state
const gameStart = () => {
    lose = false
    signals = []
    userSignals = []
    updateGame()
}