var BrickBreaker = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function BrickBreaker(){

    },
    preload: function (){

    },
    create: function(){

    },
    update: function() {

    }
})

var config = {
    type: Phaser.CANVAS,
    backgroundColor: '#000',
    scale: {
        parent: 'game-container',
        width: 800,
        height: 600,
    },
    scene: [BrickBreaker],
    physics: {
        default: 'arcade',
    },
};

let game = new Phaser.Game(config);

