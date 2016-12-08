/**
A dumb little anti-clicker game. This is my final project for FMS 321,
a course offered at Davidson College in Fall 2016. Messily coded in Angular 2
and messily styled with Bootstrap 4.

Alec Custer
11/7/16
**/

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  instructions: string;
  message  = '';
  start: number;
  diff: number;
  points: number;
  multiplier: number; //a mostly meaningless multiplier
  added: string; //string for showing the net change to the score
  msgColor: string; //color of the response (green = GOOD; red = BAD)
  boughtBreak: boolean; //has the player bought a break?
  insertCoin: boolean; //has the game started?
  gameOver: boolean; //did we lose yet?
  dead: boolean; //is the pet dead?
  timesReincarnated: number;
  madePact: boolean;
  clicks: number; //total number of clicks. probably a useless metric

  //Elapsed-time-between-clicks variables
  lowerBound: number;
  upperBound: number;
  sweetSpot: number;
  //Countdown timer variables
  tens: number;
  seconds: number;
  secString: string;
  tenString: string;
  Interval;

  //Elapsed timer variables
  elapsedTens: number;
  elapsedSeconds: number;
  elapsedSecString: string;
  elapsedTenString: string;
  elapsedInterval;

  //Break timer variables
  breakTens: number;
  breakSeconds: number;
  breakSecString: string;
  breakTenString: string;
  breakInterval;

  //Initialize the game's bloated set of redundant variables
  ngOnInit() {
    this.start = Date.now();
    this.insertCoin = false;

    this.diff = 0;
    this.points = 0;
    this.clicks = 0;

    this.boughtBreak = false;
    this.gameOver = false;
    this.dead = false;
    this.timesReincarnated = 0;
    this.multiplier = 0;
    this.madePact = false;
    this.added = '';
    this.msgColor = 'black';
    this.instructions = 'Click to pet your axolotl.';

    this.lowerBound = 0.5;
    this.upperBound = 1.5;
    this.sweetSpot = 0.75;

    this.secString = "15";
    this.tenString = "00";
    this.seconds = 15;
    this.tens = 100;

    this.breakSecString = "05";
    this.breakTenString = "00";
    this.breakSeconds = 5;
    this.breakTens = 100;

    this.elapsedSecString = "00";
    this.elapsedTenString = "00";
    this.elapsedSeconds = 0;
    this.elapsedTens = 0;
  }

  startTimer() {
    this.seconds--;
    clearInterval(this.Interval);
    this.Interval = setInterval(() => {
                      this.countdownTimer();
                    }, 10);
  }

  startElapsedTimer() {
    clearInterval(this.elapsedInterval);
    this.elapsedInterval = setInterval(() => {
                             this.elapsedTimer();
                           }, 10);
  }

  countdownTimer() {
    this.tens--;

    if(this.tens > 9){
      this.tenString = "" + this.tens;
    }

    if (this.tens == 0) {
      this.tens = 100;
      this.seconds--;
      this.tenString = "00";
    }

    if (this.seconds == 0) {
      this.secString = "00";
      this.tenString = "00";
      clearInterval(this.Interval);
      this.gameOver = true;
      this.dead = true;
      this.instructions = "Your pet has died."
    } else if (this.seconds > 9){
      this.secString = "" + this.seconds;
    } else {
      this.secString = "0" + this.seconds;
    }

  }

  reincarnate() {
    this.resetTimer();
    this.startTimer();
    this.resetElapsedTimer();
    this.dead = false;
    this.timesReincarnated++;
    this.insertCoin = true;
    this.gameOver = false;
    this.instructions = 'Click to pet your axolotl.';
  }

  makePact() {
    this.madePact = true;
    this.multiplier = 1000*this.timesReincarnated;
    this.reincarnate();
  }

  stopTimer() {
    clearInterval(this.Interval);
  }

  resetTimer() {
    clearInterval(this.Interval);
    this.tens = 100;
    this.tenString = "00";
    if (this.madePact) {
      this.seconds = Math.floor(15/this.timesReincarnated);
      this.secString = "" + this.seconds;
    } else {
        this.seconds = 15;
        this.secString = "15";
    }
  }

  getElapsed() {
    if(!this.boughtBreak && !this.gameOver) {
      this.diff = (Date.now() - this.start)/1000;
      this.start = Date.now();
      return this.diff;
    }
  }

  handleClick(click) {
    this.resetElapsedTimer();
    this.startElapsedTimer();
    if (!this.insertCoin) { //If the game hasn't started
      this.insertCoin = true;
      this.startTimer();
    }
    //If this isn't the first click AND we're not on break AND we're not in
    //game over, calculate points.
    if (this.clicks > 0 && !this.boughtBreak && !this.gameOver) {
      this.awardPoints(click);
      this.sendMessage(click);
    }
    this.clicks++;
  }

  purchaseBreak() {
    this.boughtBreak = true;
    this.breakSeconds--;
    this.points-=1000;
    if (!this.madePact) {
      this.multiplier = 0;
    }
    clearInterval(this.Interval);
    clearInterval(this.breakInterval);
    this.breakInterval = setInterval(() => {
                          this.startBreakTimer();
                        }, 10);
  }

  startBreakTimer() {
    this.breakTens--;

    if(this.breakTens > 9){
      this.breakTenString = "" + this.breakTens;
    }

    if (this.breakTens == 0) {
      this.breakTens = 100;
      this.breakSeconds--;
      this.breakTenString = "00";
    }

    if (this.breakSeconds == 0) {
      this.breakSecString = "00";
      this.breakTenString = "00";
      this.breakTens = 100;
      this.breakSeconds = 5;
      clearInterval(this.breakInterval);
      this.startTimer();
      this.boughtBreak = false;
    } else if (this.breakSeconds > 9){
      this.breakSecString = "" + this.breakSeconds;
    } else {
      this.breakSecString = "0" + this.breakSeconds;
    }
  }

  elapsedTimer() {
    this.elapsedTens++;

    if(this.elapsedTens < 9){
      this.elapsedTenString = "0" + this.elapsedTens;
    }

    if(this.elapsedTens > 9){
      this.elapsedTenString = "" + this.elapsedTens;
    }

    if (this.elapsedTens > 99){
      this.elapsedSeconds++;
      this.elapsedSecString = "0" + this.elapsedSeconds;
      this.elapsedTens = 0;
      this.elapsedTenString = "0" + 0;
    }

    if (this.elapsedSeconds > 9){
      this.elapsedSecString = "" + this.elapsedSeconds;
    } else {
      this.elapsedSecString = "0" + this.elapsedSeconds;
    }
  }

  resetElapsedTimer() {
    clearInterval(this.elapsedInterval);
    this.elapsedTens = 0;
    this.elapsedSeconds = 0;
    this.elapsedTenString = "00";
    this.elapsedSecString = "00";
  }

  awardPoints(elapsed) {
    let oldScore = this.points;
    let oldMult = this.multiplier;
    if (elapsed > this.lowerBound && elapsed < this.upperBound) {
      //this.points+= Math.pow(2, this.multiplier);
      if (this.madePact) {
        this.points+= Math.pow(2, this.multiplier);
        this.added = oldScore + " + 2^" + oldMult + " = ";
      } else {
        this.points+=this.multiplier;
        this.added = oldScore + " + " + oldMult + " = ";
      }

      this.multiplier++;

    } else {
        let lost;
        if (this.points <= 0) {
          this.points-= elapsed*10000;
          lost = elapsed*10000;
        } else {
            this.points = 0;
            lost = oldScore;
        }
        if(!this.madePact) {
          this.multiplier = 0;
        }
        this.added = oldScore + " - " + lost + " = ";

    }
  }

  getStyle() {
    if (this.points > 0) {
      return "green";
    } else {
      return "red";
    }
  }

  checkPactEligibility() {
    if (!this.madePact && this.points < 0 && this.timesReincarnated > 1) {
      return true;
    } else {
      return false;
    }
  }

  sendMessage(elapsed) {
    if (elapsed < this.lowerBound) {
      this.msgColor = 'red';
      this.message = "TOO FAST! Happiness decreased.";
    } else if (elapsed > this.upperBound) {
      this.msgColor = 'red';
      this.message = "YOU NEGLECTED YOUR PET FOR TOO LONG! Happiness decreased.";
    } else if (elapsed == this.sweetSpot) {
      this.message = "PERFECT? How..."
    } else {
      this.msgColor = 'green';
      this.message = "Good. Your axolotl's happiness has increased slightly."
    }
  }

}
