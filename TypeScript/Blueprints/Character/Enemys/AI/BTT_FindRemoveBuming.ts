import * as UE from "ue";
import mixin from "../../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemys/AI/BTT_FindRemoveBuming.BTT_FindRemoveBuming_C";
// 移除buff类
const RemoveBffClass = UE.Class.Load("/Game/Blueprints/Ability/05FireBlast/BP_RemoveBurming.BP_RemoveBurming_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTT_FindRemoveBuming extends UE.Game.Blueprints.Character.Enemys.AI.BTT_FindRemoveBuming.BTT_FindRemoveBuming_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTT_FindRemoveBuming implements BTT_FindRemoveBuming {

    ReceiveExecuteAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {
      
        let Actor = UE.GameplayStatics.GetActorOfClass(this, RemoveBffClass)
        if (Actor) {
            UE.BTFunctionLibrary.SetBlackboardValueAsVector(this, this.Location, Actor.K2_GetActorLocation())
            this.FinishExecute(true)
        } else {
            this.FinishExecute(false)
        }


    }
}