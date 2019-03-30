// author: paiv https://github.com/paiv
let snakeApp = (function() {
    let el = document.querySelector('#board')
    let ctx = el.getContext('2d', {alpha: false})
    let scoreel = document.querySelector('#score')
    
    let cellWidth = 20
    let boardSize = {w: Math.floor(ctx.canvas.width / cellWidth), h: Math.floor(ctx.canvas.height / cellWidth)}
    let boardStroke = 'hsl(0 90% 1%)'
    let snakeColor = 'hsl(250 100% 50%)'
    let fruitColor = 'hsl(0 100% 50%)'
    
    class V2 {
        constructor(x, y) {
            this.x = x
            this.y = y
        }
        add(other) {
            return new V2(this.x + other.x, this.y + other.y)
        }
        eq(other) {
            return this.x === other.x && this.y === other.y
        }
        mul(c) {
            return new V2(this.x * c, this.y * c)
        }
    }
    
    function v2(x, y) {
        return new V2(x, y)
    }
    
    function randint(n) {
        return Math.floor(Math.random() * n)
    }
    function rand2d() {
        return v2(randint(boardSize.w), randint(boardSize.h))
    }

    function drawFruit(fruit) {
        ctx.save()
        ctx.fillStyle = fruitColor
        ctx.beginPath()
        ctx.rect(fruit.x * cellWidth, fruit.y * cellWidth, cellWidth, cellWidth)
        ctx.fill()
        ctx.restore()
    }
    
    function drawSnake(snake) {
        ctx.save()
        ctx.fillStyle = snakeColor
        ctx.beginPath()
        for (p of snake.body) {
            ctx.rect(p.x * cellWidth + 1, p.y * cellWidth + 1, cellWidth - 2, cellWidth - 2)
        }
        ctx.fill()
        ctx.restore()
    }
    
    var score = 0
    var snake = {
        body: [rand2d()],
        speed: v2(0, 0),
    }
    var fruit = makeFruit();
    
    function makeFruit() {
        do {
            var fruit = rand2d()
        }
        while (snake.body.find(x => fruit.eq(x)))
        return fruit
    }
    
    function crawl(snake) {
        if (snake.speed.x === 0 && snake.speed.y === 0) {
            return snake
        }
        var snake = Object.assign({}, snake, {body: snake.body.slice()})
        let head = snake.body[0].add(snake.speed)
        if (head.x < 0 || head.y < 0 || head.x >= boardSize.w || head.y >= boardSize.h) {
            return
        }

        if (fruit && head.eq(fruit)) {
            score += snake.body.length
            snake.body.unshift(head)
            fruit = makeFruit()
        }
        else {
            snake.body.pop()
            let collided = snake.body.find(x => head.eq(x))
            if (collided) return
            snake.body.unshift(head)
        }

        return snake
    }
    
    function drawScene() {
        scoreel.textContent = score
        
        if (!snake) return
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.strokeStyle = boardStroke
        ctx.strokeRect(0, 0, boardSize.w * cellWidth, boardSize.h * cellWidth)
        drawSnake(snake)
        if (fruit) {
            drawFruit(fruit)
        }
    }

    let keymap = {
        ArrowUp: v2(0, -1),
        ArrowDown: v2(0, 1),
        ArrowLeft: v2(-1, 0),
        ArrowRight: v2(1, 0),
    }
    
    var input_v2;
    
    function keyboard(event) {
        v = keymap[event.key]
        if (v) {
            if (!input_v2 && !snake.speed.eq(v.mul(-1))) {
                input_v2 = v
            }
            event.preventDefault()
        }
    }
    
    function tick() {
        if (input_v2) {
            snake.speed = input_v2
            input_v2 = undefined
        }
        
        snake = crawl(snake)
        
        drawScene()
        
        if (!snake) {
            window.clearInterval(tickTimer)
        }
    }
    
    drawScene()
    document.addEventListener('keydown', keyboard)
    var tickTimer = window.setInterval(tick, 250)
})


window.addEventListener('load', snakeApp)
