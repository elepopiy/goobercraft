import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { TeleportManager } from "./TeleportManager";
import { MovementManager } from "./MovementManager";
import { WorldManager } from "./WorldManager";
import { Logger } from "../utils/Logger";

const TICK_MS = 50;

const GRAVITY = -0.08;
const DRAG = 0.98;
const WALK_SPEED = 4.317 / 20;
const SPRINT_MULTIPLIER = 1.3;
const JUMP_VELOCITY = 0.42;
const TERMINAL_VELOCITY = -3.92;


export class PhysicsManager {

  private interval: NodeJS.Timeout | null = null;

  private velocity = new Vec3(0,0,0);


  constructor(
    private readonly bus: EventBus,
    private readonly protocol: ProtocolManager,
    private readonly teleport: TeleportManager,
    private readonly movement: MovementManager,
    private readonly world: WorldManager
  ){}



  start():void{

    if(this.interval)
      return;


    this.interval=setInterval(()=>{

      try{

        this.tick();

      }catch(err){

        Logger.error(
          "PhysicsManager",
          "physics tick error",
          err
        );

      }


    },TICK_MS);


  }




  stop():void{

    if(this.interval){

      clearInterval(this.interval);
      this.interval=null;

    }

  }




  private tick():void{


    const control =
      this.movement.controlState;


    const pos =
      this.teleport.position;



    const chunkX =
      Math.floor(pos.x)>>4;


    const chunkZ =
      Math.floor(pos.z)>>4;



    if(!this.world.getChunk(chunkX,chunkZ)){


      this.sendPosition(
        pos,
        this.teleport.onGround
      );


      this.bus.emit("physicsTick");

      return;

    }





    const groundBlock =
      this.world.getBlock(
        pos.offset(0,-0.001,0)
      );



    const isOnGround =
      this.isSolidBlock(groundBlock);





    let dx=0;
    let dz=0;



    const yaw =
      this.teleport.yaw *
      Math.PI / 180;



    const fx=-Math.sin(yaw);
    const fz=Math.cos(yaw);


    const rx=Math.cos(yaw);
    const rz=Math.sin(yaw);



    if(control.forward){

      dx+=fx;
      dz+=fz;

    }


    if(control.back){

      dx-=fx;
      dz-=fz;

    }


    if(control.right){

      dx+=rx;
      dz+=rz;

    }


    if(control.left){

      dx-=rx;
      dz-=rz;

    }



    const len=Math.hypot(dx,dz);


    const speed =
      WALK_SPEED *
      (control.sprint ? SPRINT_MULTIPLIER:1) *
      (control.sneak ? 0.3:1);



    if(len>0){

      dx=(dx/len)*speed;
      dz=(dz/len)*speed;

    }





    if(isOnGround){

      this.velocity.y=0;


      if(control.jump){

        this.velocity.y=JUMP_VELOCITY;

        this.movement.controlState.jump=false;

      }


    }
    else{


      this.velocity.y =
        Math.max(
          (this.velocity.y+GRAVITY)*DRAG,
          TERMINAL_VELOCITY
        );


    }






    let nextPos =
      new Vec3(
        pos.x+dx,
        pos.y+this.velocity.y,
        pos.z+dz
      );







    if(this.velocity.y<0){


      const below =
        this.world.getBlock(
          new Vec3(
            nextPos.x,
            nextPos.y-0.001,
            nextPos.z
          )
        );



      if(this.isSolidBlock(below)){


        nextPos =
          new Vec3(
            nextPos.x,
            Math.floor(nextPos.y-0.001)+1,
            nextPos.z
          );


        this.velocity.y=0;

      }


    }







    if(this.velocity.y>0){


      const above =
        this.world.getBlock(
          new Vec3(
            nextPos.x,
            nextPos.y+1.8,
            nextPos.z
          )
        );



      if(this.isSolidBlock(above)){


        nextPos =
          new Vec3(
            nextPos.x,
            Math.floor(nextPos.y+1.8)-1.8,
            nextPos.z
          );


        this.velocity.y=0;


      }


    }






    const grounded =
      this.velocity.y===0 &&
      isOnGround;



    this.teleport.position =
      nextPos;


    this.teleport.onGround =
      grounded;




    this.sendPosition(
      nextPos,
      grounded
    );



    this.bus.emit(
      "physicsTick"
    );


  }







  private sendPosition(
    pos:Vec3,
    onGround:boolean
  ){


    this.protocol.writeMovement(
      "position",
      "packet_position",
      {
        x:pos.x,
        y:pos.y,
        z:pos.z
      },
      {
        onGround,
        horizontalCollision:false
      }
    );


  }






  private isSolidBlock(block:any):boolean{


    if(!block)
      return false;


    if(typeof block.boundingBox==="string")
      return block.boundingBox==="block";


    if(typeof block.type==="number")
      return block.type!==0;


    return false;


  }


}