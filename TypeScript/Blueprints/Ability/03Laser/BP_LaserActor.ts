import * as UE from "ue";
import mixin from "../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Ability/03Laser/BP_LaserActor.BP_LaserActor_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_LaserActor extends UE.Game.Blueprints.Ability._03Laser.BP_LaserActor.BP_LaserActor_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_LaserActor implements BP_LaserActor {

    ReceiveBeginPlay() {
        this.EndPoint.OnComponentBeginOverlap.Add((...args) => this.EndPointOnBeginOverlap(...args))
        this.EndPoint.OnComponentEndOverlap.Add((...args) => this.EndPointOnEndOverlap(...args))

        // 持续发送
        UE.KismetSystemLibrary.K2_SetTimer(this, "LaserDamage", 0.25, true)
    }

    // 结束球重叠事件
    EndPointOnBeginOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number, bFromSweep: boolean, SweepResult: UE.HitResult) {
        const EnemyActor = OtherActor as UE.Game.Blueprints.Character.Enemys.BP_Enemy.BP_Enemy_C
        if (!EnemyActor.Dead && !this.AllHitActor.Contains(EnemyActor)) {
            this.AllHitActor.Add(EnemyActor)
        }
    }

    // 结束球取消重叠事件
    EndPointOnEndOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number) {
        const EnemyActor = OtherActor as UE.Game.Blueprints.Character.Enemys.BP_Enemy.BP_Enemy_C
        if (this.AllHitActor.Contains(EnemyActor)) {
            this.AllHitActor.RemoveAt(this.AllHitActor.FindIndex(EnemyActor))
        }
    }

    // 激光伤害
    LaserDamage() {
        if (this.AllHitActor.Num() != 0) {

            // 冲刺命中Tag
            const LaserHitTag = new UE.GameplayTag()
            LaserHitTag.TagName = ("Ability.Laser.Damage")
            // 创建游戏玩法事件数据
            let GameplayEventData = new UE.GameplayEventData()
            GameplayEventData.EventTag = LaserHitTag
            GameplayEventData.Instigator = this.GetInstigator()
            GameplayEventData.TargetData = UE.AbilitySystemBlueprintLibrary.AbilityTargetDataFromActorArray(this.AllHitActor, false)
            UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this.GetInstigator(), LaserHitTag, GameplayEventData)
        }
    }

}