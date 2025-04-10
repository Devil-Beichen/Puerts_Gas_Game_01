import * as UE from "ue";
import mixin from "../../../../mixin";
import {$Nullable} from "puerts";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemys/AI/BTT_MeleeAttack.BTT_MeleeAttack_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTT_MeleeAttack extends UE.Game.Blueprints.Character.Enemys.AI.BTT_MeleeAttack.BTT_MeleeAttack_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTT_MeleeAttack implements BTT_MeleeAttack {
    ReceiveExecuteAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {
        let Character = ControlledPawn as UE.Game.Blueprints.Character.BP_BaseCharacter.BP_BaseCharacter_C
        if (Character) {
            // 获取普通攻击标签
            let MeleeTag = new UE.GameplayTag()
            MeleeTag.TagName = ("Ability.Melee")
            Character.ActivateAbility(MeleeTag)
            this.FinishExecute(true)
        }else {
            this.FinishExecute(false)
        }
    }
}