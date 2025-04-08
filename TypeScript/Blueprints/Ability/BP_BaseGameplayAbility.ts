import * as UE from "ue";
import mixin from "../../mixin";
import {TArray} from "ue";

// 资产路径
const AssetPath = "/Game/Blueprints/Ability/BP_BaseGameplayAbility.BP_BaseGameplayAbility_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_BaseGameplayAbility extends UE.Game.Blueprints.Ability.BP_BaseGameplayAbility.BP_BaseGameplayAbility_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_BaseGameplayAbility implements BP_BaseGameplayAbility {

    // 通知UI开始进入CD
    StartUI_CD() {
        const PlayerController = UE.GameplayStatics.GetPlayerController(this, 0) as UE.Game.Blueprints.Gameplay.BP_PlayerController.BP_PlayerController_C
        if (!PlayerController) return
        
        let AbilitySlots = PlayerController.MainUI.AllAbilitySlot

        for (let i = 0; i < AbilitySlots.Num(); i++) {

            if (AbilitySlots.Get(i).AbilityClass == this.GetClass()) {
                AbilitySlots.Get(i).StartUI_CD()
            }
        }
    }
}