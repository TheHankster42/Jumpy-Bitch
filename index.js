
const canvas = document.querySelector('canvas')
const c = canvas.getContext(['2d'])
const tileSize = 16
document.body.style.overflow = 'hidden';
document.querySelector('canvas').style.cursor = 'none';

canvas.width = 1920
canvas.height = 1080

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
}

const room1 = new Room({
    imageSrc: './img/backgrounds/background.png',
    floorCollisions: floorCollisions1,
    platformCollisions: platformCollisions1,
    imageHeight: 432,
})

const room2 = new Room({
    imageSrc: './img/backgrounds/background_glacial_mountains_lightened.png',
    floorCollisions: floorCollisionsFlat,
    platformCollisions: platformCollisionsNull,
    imageHeight: 216,
    scale: 2,
})

const room3 = new Room({
    imageSrc: './img/backgrounds/background2.png',
    floorCollisions: floorCollisionsFlat,
    platformCollisions: platformCollisionsNull,
    imageHeight: 432,
})

roomlist = [room1, room2, room3]
roomlistIndex = 0
var currentRoom = roomlist[roomlistIndex]

const gravity = 0.25
const speed = 2

const warrior = new Player(argsW)

var player = warrior

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
}

var camera = {
    position: {
        x: 0,
        y: -(currentRoom.imageHeight) + scaledCanvas.height,
    },
}

brick = new Brick(argsBrick)

function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.scale(4, 4)
    c.translate(camera.position.x, camera.position.y)
    currentRoom.background.update()

    // collisionBlocks.forEach(collisionBlock => {
    //     collisionBlock.update()
    // })
    // platformCollisionBlocks.forEach(platformCollisionBlocks => {
    //     platformCollisionBlocks.update()
    // })

    player.checkForHorizontalCanvasCollision()
    player.update(currentRoom)
    // console.log(player.status)
    brick.update()

    player.velocity.x = 0
    if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -speed
        player.direction = 'left'
        player.shouldPanRight()
    }
    else if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = speed
        player.direction = 'right'
        player.shouldPanLeft()
    }
    else if (player.velocity.y == 0) {
        if (player.direction == 'right') {
            player.switchSprite('Idle')
        } else {
            player.switchSprite('IdleLeft')
        }
    }

    if (player.velocity.y < 0) {
        player.shouldPanDown()
        if (player.direction == 'right') {
            player.switchSprite('Jump')
        } else {
            player.switchSprite('JumpLeft')
        }
    }
    else if (player.velocity.y > 0) {
        player.shouldPanUp()
        if (player.direction == 'right') {
            player.switchSprite('Fall')
        } else {
            player.switchSprite('FallLeft')
        }
    }

    c.restore()
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break

        case 'a':
            keys.a.pressed = true
            break

        case 's':
            if (player.status.onPlatform == true) {
                player.status.dropDown = true
            }
            break

        case 'w':
        case ' ':
            if (player.status.colliding == true) {
                player.velocity.y = -6
                colliding = false
            }
            if (player.status.colliding == false && player.status.activeDoubleJump) {
                player.velocity.y = -6
                player.status.activeDoubleJump = false
            }
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            player.status.dropDown = false
            break


        case 'w':
        case ' ':
            player.velocity.y = 0
            break
        case 'p':
            if (roomlist.length == roomlistIndex + 1) {
                roomlistIndex = 0
            } else {
                roomlistIndex++
            }
            currentRoom = roomlist[roomlistIndex]
            break
    }
})