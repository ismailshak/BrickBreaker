# BrickBreaker

For my first project assignment at General Assembly, I chose to build the popular arcade game [Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game).

## Motivation

## Demo

I've hosted the game on Heroku for you to try out, click [here](https://brick-break-project1.herokuapp.com/index.html). The same link is available in the description at the top of the page. Have fun!

## Rules/How To Play

The aim of the game is destroy all the bricks, that look like this:
![Brick Example](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/blueTile.png "Brick Example")

Your only weapon is a ball and paddle. The ball bounces around the scene and destroys bricks on contact. All bricks take one hit to break, except for the grey brick, which needs two: 
![Grey Brick](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/greyTile.png "Grey Brick")

Use your paddle to keep the ball in play. If the ball falls below your paddle, you lose a life and get 5 points taken off your score.

### Paddle

![Paddle](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/paddle1.png "Paddle")

The paddle tracks the mouse's movements to adjust its position. At the start the game, the ball is placed on the paddle and waits for the user to click on the game scene to kick it off.

Whenever you lose a life, the ball resets on the paddle and waits for the user to click again.

#### On Mobile

For mobile devices, I've added a feature the uses the devices orientation to move the paddle. This makes it easier on th user to move the paddle, rather than holding your finger on the game scene and moving it that way.

For the time being, it only registers the devices tilt along one axis. So make sure you hold your phone up straight!

**iOS Users** By default, your phone has device orientation on the browser disabled. To enable it follow these steps. Make sure to turn it back off when you're done.

Settings > Safari > Motion & Orientation access

### Power Ups

When playing you'll notice some bricks are replaced with power ups. These fall when they make contact with the ball. If you catch them with your paddle their affect is applied.

1. +100

![+100](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/plusOneHundred1.png "+100")

This will add 100 points to you score.

2. Expand Paddle

![Expand Paddle](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/paddleExpand.png "Expand Paddle")

This makes your paddle 1.5x larger

3. Shrink Paddle

![Shrink Paddle](https://github.com/ismailshak/BrickBreaker/blob/master/img/tile-set/PNG/paddleShrink.png "Shrink Paddle")

Although not a power up, so to speak, this will shrink your paddle down to just the metal edges. Be careful not pick them up. If you thrive under pressure, this might be for you.

### Score

Score is calculated by the amount of bricks you pick up.

Events that affect your score:
1. Obviously, destroying a brick (+1 point)
3. Picking up a +100 power up (+100 points)
3. Losing a life (-5 points)

## Framework

This project is built using Phaser.js (version 3). Phaser uses both a Canvas and WebGL renderer internally and can automatically swap between them based on browser support. This allows for fast rendering across desktop and mobile. It uses the Pixi.js library for rendering.

### Docs

I'll provide a link to their [documentation](https://photonstorm.github.io/phaser3-docs/)

## Credits

