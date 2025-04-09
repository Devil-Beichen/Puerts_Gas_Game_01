import * as UE from "ue";
import mixin from "../../../mixin";


// 资产路径
const AssetPath = "/Game/Blueprints/Ability/02Dash/GA_Dash.GA_Dash_C";

const MA_Dash = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Dash.MA_Dash") as UE.AnimMontage

const DashDamageClass = UE.Class.Load("/Game/Blueprints/Ability/02Dash/GE_Dash_Damage.GE_Dash_Damage_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_Dash extends UE.Game.Blueprints.Ability._02Dash.GA_Dash.GA_Dash_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_Dash implements GA_Dash {

    Character: UE.Game.Blueprints.Character.BP_BaseBaseCharacter.BP_BaseBaseCharacter_C;

    K2_ActivateAbility() {
        console.log(`${this.GetAvatarActorFromActorInfo().GetName()}->释放冲刺技能`)
        this.Character = this.GetAvatarActorFromActorInfo() as UE.Game.Blueprints.Character.BP_BaseBaseCharacter.BP_BaseBaseCharacter_C
        this.HitCall()
        this.K2_CommitAbility()
        this.StartUI_CD()
        this.SetFrictionToZero(true)
        this.DashForward()


        this.PlayMontage()

    }

    // 命中事件回调
    HitCall() {
        let GameplayEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, new UE.GameplayTag("Ability.Dash.HitEvent"), null, false, true)
        // 事件触发回调
        GameplayEvent.EventReceived.Add((...args) => this.HitEvent(...args))
        // 事件任务激活
        GameplayEvent.ReadyForActivation()

    }

    // 命中事件
    HitEvent(Payload: UE.GameplayEventData) {

        this.BP_ApplyGameplayEffectToTarget(UE.AbilitySystemBlueprintLibrary.AbilityTargetDataFromActor(Payload.Target), DashDamageClass, 1, 1)

        let HitCharacter = Payload.Target as UE.Game.Blueprints.Character.BP_BaseBaseCharacter.BP_BaseBaseCharacter_C
        if (HitCharacter) {
            HitCharacter.Stun(1)
            let StartLocation = HitCharacter.K2_GetActorLocation()
            let EndLocation = this.GetAvatarActorFromActorInfo().K2_GetActorLocation()
            let Direction = new UE.Vector(StartLocation.X - EndLocation.X, StartLocation.Y - EndLocation.Y, StartLocation.Z - EndLocation.Z)

            let Dir = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Direction))
            HitCharacter.PushAwaly(1500, 0.7, Dir)
        }
    }

    // 向前冲刺
    DashForward() {

        if (this.Character) {
            let Impulse = new UE.Vector(
                this.Character.GetActorForwardVector().X * 2000,
                this.Character.GetActorForwardVector().Y * 2000,
                this.Character.GetActorForwardVector().Z * 2000)

            this.Character.CharacterMovement.AddImpulse(Impulse, true)
        }
    }

    // 设置摩擦力为零
    SetFrictionToZero(Zero: boolean) {
        if (this.Character) {
            this.Character.SetFrictionToZero(Zero)
        }
    }

    // 结束
    K2_OnEndAbility(bWasCancelled: boolean) {
        this.SetFrictionToZero(false)
    }

    // 播放蒙太奇
    PlayMontage() {
        let Montage = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Dash)
        Montage.OnCompleted.Add(() => this.K2_EndAbility())
        Montage.OnBlendOut.Add(() => this.K2_EndAbility())
        Montage.OnInterrupted.Add(() => this.K2_EndAbility())
        Montage.OnCancelled.Add(() => this.K2_EndAbility())
        Montage.ReadyForActivation()
    }

}