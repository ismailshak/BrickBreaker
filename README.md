# BrickBreaker

For my first project assignment at General Assembly, I chose to build the popular arcade game [Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game)).

## Demo

I've hosted the game on Heroku (web server hosting site) for you to try out, click [here](https://brick-break-project1.herokuapp.com/index.html). The same link is available in the description at the top of the page. Have fun!

## How To Play

The aim of the game is destroy all the bricks. They will look like this:

![Brick Example](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/limeTile.png "Brick Example")

Your only tool set is a ball and a paddle. The ball bounces around the scene and destroys bricks on contact. All bricks take one hit to break, except for the grey brick, which needs two:

![Grey Brick](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/greyTile.png "Grey Brick")

Use your paddle to keep the ball in play. If the ball falls below your paddle, you lose a life.

You start with 3 lives, if you lose them all. Game over.

### Paddle

![Paddle](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/paddle1.png "Paddle")

The paddle tracks the mouse's movements to adjust its position. At the start the game, the ball is placed on the paddle and waits for the user to click on the game scene to kick it off.

Whenever you lose a life, the ball resets on the paddle and waits for the user to click again.

##### Mobile Devices

For smart phones/tablets, I've added a feature the uses the devices orientation to move the paddle. This makes it easier on th user to move the paddle, rather than holding your finger on the game scene and moving it that way.

For the time being, it only registers the devices tilt along one axis. So make sure you hold your device up straight!

<details><summary><strong>iOS Users</strong></summary>By default, your phone has device orientation on the browser disabled. To enable it follow these steps. Make sure to turn it back off when you're done.<br>Settings > Safari > Motion & Orientation access</details>

### Power Ups

When playing you'll notice some bricks are replaced with power ups. These fall when they make contact with the ball. If you catch them with your paddle, their effect is applied.

1. +100

![+100](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/plusOneHundred1.png "+100")

This will add 100 points to your score.

2. Expand Paddle

![Expand Paddle](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/expand.png "Expand Paddle")

This makes your paddle 1.5x larger

3. Shrink Paddle

![Shrink Paddle](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/shrink.png "Shrink Paddle")

Although not a power up, so to speak, this will shrink your paddle down to just the metal edges. Be careful not to pick them up. Unless you're a thrill seeker, then this might be for you.

### Score

Events that affect your score:
1. Destroying a brick (+1 point)
3. Picking up a +100 power up (+100 points)
3. Losing a life (-5 points)

## Framework

This project is built using Phaser.js (version 3). Phaser uses both a Canvas and WebGL renderer internally and can automatically swap between them based on browser support. This allows for fast rendering across desktop and mobile. It uses the Pixi.js library for rendering.

### Docs

I'll provide a link to their [documentation](https://photonstorm.github.io/phaser3-docs/)

## Future Additions

Add more power ups that:
1. Increase & decrease ball speed.
2. Add more balls to the playing field
2. Creates an explosion on collision with a break that takes out multiple bricks.
3. +50/250/500 to your score.

Add more functionalities:
1. Timer feature, that factors in time taken to the overall score.
2. Improved mobile optimization.
3. Using all orientation axis to mobile devices so user can tilt device in a more intuitive motion.

## Take Aways

The biggest skill I've picked up while tackling this project was reading and quickly understanding a new API. The first time I heard of Phaser.js was project day 1. In 4 days I had to read, learn and apply functions and behaviors to my game objects to reach a presentable, fully functioning demo.

## Known Issues

1. Using the expanded paddle, theres an instance where the paddle's hitbox doesn't correctly register on contact with the ball (far right edge of screen) <em style="font-size: 0.5rem">Forgive all those wasted lives!</em>

## Credits

All fonts and assets credited in a `.txt` file, in their respective directory. <br><br>[Fonts](https://github.com/ismailshak/BrickBreaker/tree/master/fonts)<br>[Sprites](https://github.com/ismailshak/BrickBreaker/tree/master/img/tile-set)

