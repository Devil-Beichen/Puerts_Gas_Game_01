import * as UE from "ue";
import mixin from "../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Ability/03Laser/GA_Laser.GA_Laser_C";

// 技能消耗Tag
const LaserCostTag = new UE.GameplayTag("Ability.Laser.Cost")
// 技能消耗结束Tag
const LaserCostEndTag = new UE.GameplayTag("Ability.Laser.Cost.EndEvent")
// 技能伤害Tag
const LaserDamageTag = new UE.GameplayTag("Ability.Laser.Damage")
// 激光伤害
const LaserDamageClass = UE.Class.Load("/Game/Blueprints/Ability/03Laser/GE_Laser_Damage.GE_Laser_Damage_C")
// 激光Actor
const LaserActorClass = UE.Class.Load("/Game/Blueprints/Ability/03Laser/BP_LaserActor.BP_LaserActor_C")

const MA_Laser = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Laser.MA_Laser") as UE.AnimMontage

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_Laser extends UE.Game.Blueprints.Ability._03Laser.GA_Laser.GA_Laser_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_Laser implements GA_Laser {

    Character: UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C;


    // 技能激活
    K2_ActivateAbility() {
        console.log(`${this.GetAvatarActorFromActorInfo().GetName()}->释放激光技能`)
        this.Character = this.GetAvatarActorFromActorInfo() as UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C
        if (this.Character) {
            this.Character.IsLasering = true
            this.ManualEnd()
            this.Character.LockCamera(true)

        }
        // 提交技能消耗
        this.K2_CommitAbilityCost()
        const MontageWait = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Laser)

        // 播放动画
        MontageWait.ReadyForActivation()

        UE.KismetSystemLibrary.K2_SetTimer(this, "SpawnLasetrActor", 0.3, false)

    }


    // 手动结束绑定
    ManualEnd() {

        this.ChackCost()
        UE.KismetSystemLibrary.K2_SetTimer(this, "ChackCost", 0.2, true)

        let GameplayEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, LaserCostEndTag, this.Character, false, true)
        // 事件触发回调
        GameplayEvent.EventReceived.Add((...args) => this.EndMontage(...args))
        GameplayEvent.ReadyForActivation()

    }

    // 结束动画
    EndMontage(Payload: UE.GameplayEventData) {
        const MontageWait = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Laser, 2, "End")
        /*MontageWait.OnCompleted.Add(() => this.K2_EndAbility())
        MontageWait.OnBlendOut.Add(() => this.K2_EndAbility())
        MontageWait.OnInterrupted.Add(() => this.K2_EndAbility())
        MontageWait.OnCancelled.Add(() => this.K2_EndAbility())*/
        // 播放动画
        MontageWait.ReadyForActivation()
        this.K2_EndAbility()
    }

    // 检查消耗
    ChackCost() {
        if (!this.IsSatisfyCost()) {
            console.log(`${this.GetAvatarActorFromActorInfo().GetName()}->技能消耗不足`)
            this.EndMontage(null)
        }
    }


    // 创建激光
    /*  SpawnLasetrActor() {
  
          const Task_SapwnActor = UE.AbilityTask_SpawnActor.SpawnActor(this, new UE.GameplayAbilityTargetDataHandle(), LaserActorClass)
          Task_SapwnActor.Success.Add((...args) => this.SpawnSuccess(...args))
          Task_SapwnActor.DidNotSpawn.Add((...args) => this.SpawnSuccess(...args))
          console.log(`${Task_SapwnActor.GetName()}`)
          // 任务激活
          Task_SapwnActor.ReadyForActivation()
      }*/

    // 创建成功
    SpawnSuccess(SpawnedActor: $Nullable<UE.Actor>) {
        console.log(`${this.GetAvatarActorFromActorInfo().GetName()}->创建激光`)
        if (SpawnedActor) {
            this.SpawnActor = SpawnedActor
            this.SpawnActor.Instigator = this.Character
            this.SpawnActor.K2_AttachToComponent(
                this.Character.LaserPoint,
                "",
                UE.EAttachmentRule.SnapToTarget,
                UE.EAttachmentRule.SnapToTarget,
                UE.EAttachmentRule.KeepRelative,
                false
            )

            let GameplayEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, LaserDamageTag, this.Character, false, true)
            // 事件触发回调
            GameplayEvent.EventReceived.Add((...args) => this.TriggerDamage(...args))
            GameplayEvent.ReadyForActivation()

        }
    }

    // 触发伤害
    TriggerDamage(Payload: UE.GameplayEventData) {

        this.BP_ApplyGameplayEffectToTarget(Payload.TargetData, LaserDamageClass)

        let HitArrar = UE.AbilitySystemBlueprintLibrary.GetActorsFromTargetData(Payload.TargetData, 0)

        for (let i = 0; i < HitArrar.Num(); i++) {
            let HitActor = HitArrar.Get(i) as UE.Game.Blueprints.Character.BP_BaseCharacter.BP_BaseCharacter_C
            if (HitActor) {
                HitActor.Stun(1)
                let Dir = new UE.Vector(
                    HitActor.K2_GetActorLocation().X - this.SpawnActor.K2_GetActorLocation().X,
                    HitActor.K2_GetActorLocation().Y - this.SpawnActor.K2_GetActorLocation().Y,
                    HitActor.K2_GetActorLocation().Z - this.SpawnActor.K2_GetActorLocation().Z
                )

                Dir = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Dir))

                HitActor.PushAwaly(1000, 0.5, Dir)

            }
        }
    }

    // 技能结束
    K2_OnEndAbility(bWasCancelled: boolean) {

        this.Character = this.GetAvatarActorFromActorInfo() as UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C

        this.BP_RemoveGameplayEffectFromOwnerWithAssetTags(UE.BlueprintGameplayTagLibrary.MakeGameplayTagContainerFromTag(LaserCostTag as UE.GameplayTag), -1)
        this.BP_RemoveGameplayEffectFromOwnerWithAssetTags(UE.BlueprintGameplayTagLibrary.MakeGameplayTagContainerFromTag(LaserCostEndTag as UE.GameplayTag), -1)
        this.K2_CommitAbilityCooldown(false, true)
        this.StartUI_CD()

        if (this.Character) {
            this.Character.LockCamera(false)
            this.Character.IsLasering = false
        }

        if (this.SpawnActor) {
            this.SpawnActor.K2_DestroyActor()
        }
        console.log(`${this.GetAvatarActorFromActorInfo().GetName()}->激光技能结束`)
    }
}