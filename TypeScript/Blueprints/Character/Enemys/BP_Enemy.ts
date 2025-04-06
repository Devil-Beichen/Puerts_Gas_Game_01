import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_BaseBaseCharacter} from "../BP_BaseBaseCharacter";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemys/BP_Enemy.BP_Enemy_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_Enemy extends UE.Game.Blueprints.Character.Enemys.BP_Enemy.BP_Enemy_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_Enemy extends BP_BaseBaseCharacter implements BP_Enemy {

    protected HPChangeEvent(Value: number) {
        super.HPChangeEvent(Value);
        if (this.Dead)
        {
            this.StopController()
        }
    }
    
    // 停止控制
    protected StopController(){
        let Controller =  UE.AIBlueprintHelperLibrary.GetAIController(this.GetController())
        if (Controller)
        {
            Controller.BrainComponent.StopLogic("Death!!!")
        }
    }
    
    // 恢复控制
    protected ResumeController(){
        let Controller =  UE.AIBlueprintHelperLibrary.GetAIController(this.GetController())
        if (Controller)
        {
            Controller.BrainComponent.RestartLogic()
        }
    }

}