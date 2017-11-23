// loading.js
// Loads acts' specific assets - gfx & sfx

import Audio from '../audio';
import Controls from '../controls';
import Globals from '../globals';
import Renderer from './renderer';

const LoadingConsts = {
  SPLASH_FADE: 1500, // ms
  LOAD_TIME: 5,
};

class Loading extends Renderer {

  constructor(game) {
    super(game);
  }

  init(nextState) {
    this.nextState = nextState;
  }

  preload() {

    this.game.load.onLoadComplete.add(this.loadComplete, this);

    // add a countdown for next state
    this.timer = this.game.time.create();
    this.timer.add(Phaser.Timer.SECOND * LoadingConsts.LOAD_TIME, this.changeState, this);

    // load audios
    if(this.nextState == 'act1')
      Audio.loadMusic(this.game, 'maintheme');
    else if(this.nextState == 'act2')
      Audio.loadMusic(this.game, 'act2');

    // add text to screen
    this.text = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, Globals.bitmapFont, '', 16);
    this.text.anchor.setTo(0.5);

    this.timer.start();
  }

  update() {
    if(this.timer.running)
      this.text.text = 'LOADING...\n\t\t\t\t\t\t' + (LoadingConsts.LOAD_TIME - Math.round(this.timer.ms / 1000));
    else
      this.text.text = 'LOADED!';

    if(this.controls.punch || this.controls.jump)
      this.changeState();
  }

  loadComplete() {
    const skipText = this.game.add.bitmapText(this.game.world.width - 16, this.game.world.height - 16, Globals.bitmapFont, 'SKIP', 12);
    skipText.anchor.setTo(1);
    skipText.alpha = 0;

    this.game.add.tween(skipText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);

    this.controls = new Controls(this.game, true);
  }

  changeState() {
    this.timer.stop();
    this.state.start(this.nextState);
  }

}

export { Loading };