import * as UE from "ue";
import mixin from "../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Ability/01HPRegen/GA_HPRegen.GA_HPRegen_C";

// 回血技能的回复值类
const HPRegenValueCalss = UE.Class.Load("/Game/Blueprints/Ability/01HPRegen/GE_HPRegen_Value.GE_HPRegen_Value_C")
const MA_HPRegen = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_HPRegen.MA_HPRegen") as UE.AnimMontage

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_HPRegen extends UE.Game.Blueprints.Ability._01HPRegen.GA_HPRegen.GA_HPRegen_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_HPRegen implements GA_HPRegen {
    K2_ActivateAbility() {

        this.K2_CommitAbility()
        this.BP_ApplyGameplayEffectToOwner(HPRegenValueCalss)
        this.StartUI_CD()

        let HPRegenMontage = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "HPRegenMontage", MA_HPRegen)
        HPRegenMontage.OnCompleted.Add(() => this.K2_EndAbility())
        HPRegenMontage.OnCancelled.Add(() => this.K2_EndAbility())
        HPRegenMontage.OnBlendOut.Add(() => this.K2_EndAbility())
        HPRegenMontage.OnInterrupted.Add(() => this.K2_EndAbility())
        // 激活
        HPRegenMontage.ReadyForActivation()
    }
}