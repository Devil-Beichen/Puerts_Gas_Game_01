import * as UE from "ue";
import mixin from "../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Ability/05FireBlast/GA_FireBlast.GA_FireBlast_C";

// 动画蒙太奇
const MA_FireBlast = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_FireBlast.MA_FireBlast") as UE.AnimMontage

// 触发拉回的标签
const PullBackTag = new UE.GameplayTag("Ability.FireBlast.PullBack")
// 触发推走的标签
const PushAwayTag = new UE.GameplayTag("Ability.FireBlast.PushAway")
// 伤害类
const FireBlastDamageClass = UE.Class.Load("/Game/Blueprints/Ability/05FireBlast/GE_FireBlast_PushDamage.GE_FireBlast_PushDamage_C")


// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_FireBlast extends UE.Game.Blueprints.Ability._05FireBlast.GA_FireBlast.GA_FireBlast_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_FireBlast implements GA_FireBlast {
    // 获取目标数据
    TargetData: UE.GameplayAbilityTargetDataHandle;
    HitCharacters: UE.TArray<UE.Actor>

    K2_ActivateAbility() {
        this.K2_CommitAbility()
        this.StartUI_CD()
        this.PullBack()
        this.PushAway()
        this.PlayMontage()

    }

    // 播放动画
    PlayMontage() {
        let Montage = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(
            this,
            "",
            MA_FireBlast
        )

        Montage.OnCompleted.Add(() => this.K2_EndAbility())
        Montage.OnBlendOut.Add(() => this.K2_EndAbility())
        Montage.OnInterrupted.Add(() => this.K2_EndAbility())
        Montage.OnCancelled.Add(() => this.K2_EndAbility())
        Montage.ReadyForActivation()
    }

    // 拉取
    PullBack() {
        let WaitEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(
            this,
            PullBackTag,
            null,
            true,
            true
        )
        WaitEvent.EventReceived.Add((...args) => this.CallPullBack(...args))
        WaitEvent.ReadyForActivation()

    }

    // 回调拉取
    CallPullBack(Payload: UE.GameplayEventData) {
        this.SpawnTargetData()
    }

    // 数据有效执行拉取
    ValidData(Data: UE.GameplayAbilityTargetDataHandle) {
        this.TargetData = Data
        this.HitCharacters = UE.AbilitySystemBlueprintLibrary.GetActorsFromTargetData(Data, 0)
        for (let i = 0; i < this.HitCharacters.Num(); i++) {
            let HitCharacter = this.HitCharacters.Get(i) as UE.Game.Blueprints.Character.BP_BaseCharacter.BP_BaseCharacter_C
            if (HitCharacter) {
                HitCharacter.Stun(2)

                let Dir = new UE.Vector(
                    this.GetAvatarActorFromActorInfo().K2_GetActorLocation().X - HitCharacter.K2_GetActorLocation().X,
                    this.GetAvatarActorFromActorInfo().K2_GetActorLocation().Y - HitCharacter.K2_GetActorLocation().Y,
                    this.GetAvatarActorFromActorInfo().K2_GetActorLocation().Z - HitCharacter.K2_GetActorLocation().Z
                )
                Dir = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Dir))

                HitCharacter.PushAwaly(800, 0.5, Dir)
            }
        }
    }

    // 推走
    PushAway() {
        let WaitEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(
            this,
            PushAwayTag,
            null,
            true,
            true
        )
        WaitEvent.EventReceived.Add((...args) => this.CallPushAway(...args))
        WaitEvent.ReadyForActivation()
    }

    // 回调推走
    CallPushAway(Payload: UE.GameplayEventData) {
        this.BP_ApplyGameplayEffectToTarget(this.TargetData, FireBlastDamageClass)
        for (let i = 0; i < this.HitCharacters.Num(); i++) {
            let HitCharacter = this.HitCharacters.Get(i) as UE.Game.Blueprints.Character.BP_BaseCharacter.BP_BaseCharacter_C
            if (HitCharacter) {
                let Dir = new UE.Vector(
                    HitCharacter.K2_GetActorLocation().X - this.GetAvatarActorFromActorInfo().K2_GetActorLocation().X,
                    HitCharacter.K2_GetActorLocation().Y - this.GetAvatarActorFromActorInfo().K2_GetActorLocation().Y,
                    HitCharacter.K2_GetActorLocation().Z - this.GetAvatarActorFromActorInfo().K2_GetActorLocation().Z
                )
                Dir = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Dir))

                HitCharacter.PushAwaly(1200, 0.7, Dir)
            }
        }
    }
}