const canvas = document.querySelector('canvas')
const c = canvas.getContext(['2d'])
const tileSize = 16
document.body.style.overflow = 'hidden';
document.querySelector('canvas').style.cursor = 'none';


// canvas.width = 1024
// canvas.height = 

canvas.width = 1920
canvas.height = 1080    

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
}

const room1 = new Room({
    imageSrc: './img/background.png',
    floorCollisions: floorCollisions1,
    platformCollisions: platformCollisions1,
    imageHeight : 432,
})

var currentRoom = room1

const gravity = 0.25
const speed = 2
const status = {
    colliding: false,
    activeDoubleJump: true,
    touchingWall: false,
    onPlatform: false,
    dropDown: false,
}

const player = new Player({
    position: {
        x: 150,
        y: 320,
    },
    collisionBlocks: currentRoom.collisionBlocks,
    platformCollisionBlocks: currentRoom.platformCollisionBlocks,
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
          },
          Run: {
            imageSrc: './img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5,
          },
          Jump: {
            imageSrc: './img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
          },
          Fall: {
            imageSrc: './img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
          },
          FallLeft: {
            imageSrc: './img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
          },
          RunLeft: {
            imageSrc: './img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
          },
          IdleLeft: {
            imageSrc: './img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
          },
          JumpLeft: {
            imageSrc: './img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
          },
          Slide: {

          },
          SlideLeft: {

          },
    },
    status: status,
})

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    }
}

var camera = {
    position: {
        x: 0,
        y: -currentRoom.imageHeight + scaledCanvas.height,
    },
}

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
    player.update()
    // console.log(player.status)

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
    else if (player.velocity.y == 0){
        if(player.direction == 'right'){
            player.switchSprite('Idle')
        } else{
            player.switchSprite('IdleLeft')           
        }
    }

    if(player.velocity.y < 0) {
        player.shouldPanDown()
        if(player.direction == 'right'){
            player.switchSprite('Jump')
        } else{
            player.switchSprite('JumpLeft')            
        }
    }
    else if (player.velocity.y > 0) {
        player.shouldPanUp()
        if(player.direction == 'right'){
            player.switchSprite('Fall')
        } else{
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
            if(player.status.onPlatform == true){
                player.status.dropDown = true
            }            
            break

        case 'w':
        case ' ':
            if (player.status.colliding == true) {
                player.velocity.y = -6
                colliding = false
            }
            if (player.status.colliding == false && player.status.activeDoubleJump){
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
    }
})