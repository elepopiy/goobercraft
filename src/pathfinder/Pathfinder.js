const { findPathDetailed } = require("./AStar.js");


class Pathfinder {

    constructor(bot, world) {

        this.bot = bot;
        this.world = world;

        this.goal = null;

        this.path = [];

        this._moving = false;

        this.currentIndex = 0;

        this.followTimer = null;
    }



    /**
     * Mineflayer uyumlu
     * bot.pathfinder.setGoal(goal)
     */
    setGoal(goal) {

        this.goal = goal;

        this.path = [];

        this.currentIndex = 0;

        this._moving = true;


        this.computePath();

    }




    /**
     * Path hesaplama
     */
    computePath() {


        if(!this.goal)
            return;



        const start =
            this.bot.position.floored();



        const target =
            this.goal.position ??
            this.goal.goal ??
            this.goal;



        if(!target){

            console.warn(
                "[Pathfinder] hedef yok"
            );

            this.stop();

            return;
        }




        const result =
            findPathDetailed(
                this.world,
                start,
                target,
                {
                    maxNodes:5000
                }
            );




        if(!result){

            console.log(
                "[Pathfinder] yol bulunamadı"
            );

            this.stop();

            return;
        }



        this.path = result;

        this.currentIndex = 0;


        console.log(
            "[Pathfinder] Yol bulundu:",
            this.path.length
        );


        this.followPath();

    }





    /**
     * Hareket ediyor mu?
     * API uyumu için fonksiyon
     */
    isMoving(){

        return this._moving;

    }





    /**
     * Path takip
     */
    followPath(){


        if(!this._moving)
            return;




        if(
            this.currentIndex >= this.path.length
        ){

            this.stop();

            return;

        }




        const node =
            this.path[
                this.currentIndex
            ];



        const pos =
            node.position ??
            node;



        const dx =
            pos.x -
            this.bot.position.x;



        const dz =
            pos.z -
            this.bot.position.z;




        const distance =
            Math.sqrt(
                dx*dx+
                dz*dz
            );




        if(distance < 0.4){

            this.currentIndex++;

            this.followPath();

            return;

        }





        const yaw =
            Math.atan2(
                -dx,
                -dz
            );



        this.bot.look(
            yaw,
            0
        );



        this.bot.move(
            "forward",
            true
        );



        this.followTimer =
            setTimeout(
                ()=>this.followPath(),
                50
            );

    }





    /**
     * Durdur
     */
    stop(){


        this._moving=false;


        this.goal=null;


        this.path=[];


        this.currentIndex=0;



        if(this.followTimer){

            clearTimeout(
                this.followTimer
            );

            this.followTimer=null;

        }



        if(this.bot.stop){

            this.bot.stop();

        }

    }





    /**
     * Promise tabanlı gitme
     */
    goto(goal){


        return new Promise(
            (resolve)=>{


                this.setGoal(goal);



                const check =
                    setInterval(
                        ()=>{


                            if(!this._moving){

                                clearInterval(
                                    check
                                );


                                resolve();

                            }


                        },
                        100
                    );


            }
        );

    }





    getPath(){

        return this.path;

    }


}



module.exports = {
    Pathfinder
};