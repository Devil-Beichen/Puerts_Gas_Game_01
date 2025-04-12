import * as UE from "ue";
import mixin from "../../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemys/AI/BTS_CheckBuming.BTS_CheckBuming_C";
// 着火标签
const BuringTag = new UE.GameplayTag("Ability.FireBlast.BuringDamage")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTS_CheckBuming extends UE.Game.Blueprints.Character.Enemys.AI.BTS_CheckBuming.BTS_CheckBuming_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTS_CheckBuming implements BTS_CheckBuming {

    ReceiveSearchStartAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {
        if (UE.AbilitySystemBlueprintLibrary.GetAbilitySystemComponent(ControlledPawn).HasMatchingGameplayTag(BuringTag)) {
            UE.BTFunctionLibrary.SetBlackboardValueAsBool(this, this.BumingBuff, true)
        } else {
            UE.BTFunctionLibrary.SetBlackboardValueAsBool(this, this.BumingBuff, false)
        }
    }

}