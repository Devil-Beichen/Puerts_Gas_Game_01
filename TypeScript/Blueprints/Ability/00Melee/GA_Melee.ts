import * as UE from "ue";
import mixin from "../../../mixin";


// 资产路径
const AssetPath = "/Game/Blueprints/Ability/00Melee/GA_Melee.GA_Melee_C";

const MA_Melee = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Melee.MA_Melee") as UE.AnimMontage

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_Melee extends UE.Game.Blueprints.Ability._00Melee.GA_Melee.GA_Melee_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_Melee implements GA_Melee {

    K2_ActivateAbility() {
        UE.KismetSystemLibrary.PrintString(
            this.GetWorld(),
            `普通攻击按下`,
            true,
            true,
            UE.LinearColor.Green,
            0.2
        )
        this.K2_CommitAbilityCooldown()

        // 随机选择起始动画片段
        let StartSection = UE.KismetMathLibrary.RandomInteger(2).toString()


        // 创建播放动画任务
        let PlayeMeleeMontage = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "PlayMeleeMontage", MA_Melee, 1, StartSection);
        // 绑定事件
        PlayeMeleeMontage.OnCompleted.Add(() => this.PlayMeleeComplete())
        PlayeMeleeMontage.OnInterrupted.Add(() => this.PlayMeleeComplete())
        PlayeMeleeMontage.OnBlendOut.Add(() => this.PlayMeleeComplete())
        PlayeMeleeMontage.OnCancelled.Add(() => this.PlayMeleeComplete())
        // 激活任务
        PlayeMeleeMontage.ReadyForActivation()
        // 普攻命中Tag
        let MeleeHitTag = new UE.GameplayTag()
        MeleeHitTag.TagName = ("Ability.Melee.HitEvent")
        let GameplayEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, MeleeHitTag, null, false, true);

        GameplayEvent.EventReceived.Add((...args) => this.HitTarget(...args))
        // 激活任务
        GameplayEvent.ReadyForActivation()


    }

    // 播放动画完成
    PlayMeleeComplete() {
       
        this.K2_EndAbility()
    }

    // 命中事件
    HitTarget(Payload: UE.GameplayEventData) {
        let MeleeDamageClass = UE.Class.Load("/Game/Blueprints/Ability/00Melee/GE_Melee_Damage.GE_Melee_Damage_C")
        this.BP_ApplyGameplayEffectToTarget(UE.AbilitySystemBlueprintLibrary.AbilityTargetDataFromActor(Payload.Target), MeleeDamageClass, UE.KismetMathLibrary.RandomIntegerInRange(0, 3))
    }
}