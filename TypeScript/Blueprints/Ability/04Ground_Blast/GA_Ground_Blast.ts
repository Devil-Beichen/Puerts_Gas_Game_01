import * as UE from "ue";
import mixin from "../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Ability/04Ground_Blast/GA_Ground_Blast.GA_Ground_Blast_C";

// 选择位置蒙太奇
const MA_SelectGround_Blast = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_SelectGround_Blast.MA_SelectGround_Blast") as UE.AnimMontage
// 释放技能蒙太奇
const MA_Cast = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Cast.MA_Cast") as UE.AnimMontage
// 地面位置Class
const GroundSelectClass = UE.Class.Load("/Game/Blueprints/Ability/04Ground_Blast/BP_GroundSelectTargetActor.BP_GroundSelectTargetActor_C")

const BlastDamageClass = UE.Class.Load("/Game/Blueprints/Ability/04Ground_Blast/GE_Ground_Blast_Damage.GE_Ground_Blast_Damage_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_Ground_Blast extends UE.Game.Blueprints.Ability._04Ground_Blast.GA_Ground_Blast.GA_Ground_Blast_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_Ground_Blast implements GA_Ground_Blast {
    Character: UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C;
    // 命中位置
    HitLocation: UE.Vector;
    // 命中的目标
    HitActors: UE.TArray<UE.Actor>;

    TargetData: UE.AbilityTask_WaitTargetData

    K2_ActivateAbility() {
        this.Character = this.GetAvatarActorFromActorInfo() as UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C
        if (this.Character) {
            this.Character.IsBlastSkill = true
        }

        this.PlayerSelectMontage()
        this.SpawnTargetData()

        console.log(`${this.GetAvatarActorFromActorInfo().GetName()}->山崩地裂技能准备`)

    }

    // 播放选择蒙太奇动画
    PlayerSelectMontage() {
        let SelectMontage = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(
            this,
            "",
            MA_SelectGround_Blast
        )
        SelectMontage.ReadyForActivation()
    }


    // 成功释放
    ValidData(Data: UE.GameplayAbilityTargetDataHandle) {
        this.HitLocation = UE.AbilitySystemBlueprintLibrary.GetTargetDataEndPoint(Data, 0)
        this.HitActors = UE.AbilitySystemBlueprintLibrary.GetActorsFromTargetData(Data, 1)
        this.K2_CommitAbility()
        this.StartUI_CD()
        this.PlayCastMontage()
    }

    // 取消
    Cancelled(Data: UE.GameplayAbilityTargetDataHandle) {
        this.K2_EndAbility()
    }

    // 播放释放技能蒙太奇
    PlayCastMontage() {
        let CastMontage = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Cast)
        CastMontage.OnCompleted.Add(() => this.K2_EndAbility())
        CastMontage.OnBlendOut.Add(() => this.K2_EndAbility())
        CastMontage.OnInterrupted.Add(() => this.K2_EndAbility())
        CastMontage.OnCancelled.Add(() => this.K2_EndAbility())
        CastMontage.ReadyForActivation()

        UE.GameplayStatics.SpawnEmitterAtLocation(
            this, this.BlastFX,
            this.HitLocation,
            UE.Rotator.ZeroRotator,
            new UE.Vector(0.5, 0.5, 0.5),
            true,
            UE.EPSCPoolMethod.ManualRelease,
            true
        )

        console.log(`${this.GetAvatarActorFromActorInfo().GetName()}->山崩地裂技能成功释放`)

        // 延迟0.4秒释放技能
        setTimeout(() => {
            this.CastSkill()
        }, 0.4 * 1000)
    }

    // 释放技能
    CastSkill() {

        // 应用伤害
        this.BP_ApplyGameplayEffectToTarget(UE.AbilitySystemBlueprintLibrary.AbilityTargetDataFromActorArray(this.HitActors, false), BlastDamageClass)

        for (let i = 0; i < this.HitActors.Num(); i++) {
            let HitCharacter = this.HitActors.Get(i) as UE.Game.Blueprints.Character.BP_BaseCharacter.BP_BaseCharacter_C
            if (HitCharacter) {
                HitCharacter.Stun(2)

                let Dir = new UE.Vector(
                    HitCharacter.K2_GetActorLocation().X - this.HitLocation.X,
                    HitCharacter.K2_GetActorLocation().Y - this.HitLocation.Y,
                    HitCharacter.K2_GetActorLocation().Z - this.HitLocation.Z
                )
                Dir = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Dir))

                HitCharacter.PushAwaly(1000, 1, Dir)

            }
        }

    }

    K2_OnEndAbility(bWasCancelled: boolean) {
        if (this.Character) {
            this.Character.IsBlastSkill = false
        }

        console.log(`${this.GetAvatarActorFromActorInfo().GetName()}->山崩地裂技能结束`)
    }

}