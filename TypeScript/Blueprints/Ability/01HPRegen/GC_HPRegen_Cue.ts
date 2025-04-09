import * as UE from "ue";
import mixin from "../../../mixin";
import {$Nullable} from "puerts";


// 资产路径
const AssetPath = "/Game/Blueprints/Ability/01HPRegen/GC_HPRegen_Cue.GC_HPRegen_Cue_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GC_HPRegen_Cue extends UE.Game.Blueprints.Ability._01HPRegen.GC_HPRegen_Cue.GC_HPRegen_Cue_C {
    WhileActive(MyTarget: $Nullable<UE.Actor>, Parameters: UE.GameplayCueParameters): boolean;
}


// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GC_HPRegen_Cue implements GC_HPRegen_Cue {

    WhileActive(MyTarget: $Nullable<UE.Actor>, Parameters: UE.GameplayCueParameters): boolean {
      
        if (this.HPRegen_FX) {
            UE.GameplayStatics.SpawnEmitterAtLocation(
                this.GetWorld(),
                this.HPRegen_FX, MyTarget.K2_GetActorLocation(),
                new UE.Rotator(),
                new UE.Vector(1, 1, 1),
                true,
                UE.EPSCPoolMethod.ManualRelease,
                true
            )
        }

        // @ts-ignore
        // return super.WhileActive(MyTarget, Parameters);
        return true
    }
}