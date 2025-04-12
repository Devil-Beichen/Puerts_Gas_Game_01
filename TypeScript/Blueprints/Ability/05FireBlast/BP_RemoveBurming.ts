import * as UE from "ue";
import mixin from "../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Ability/05FireBlast/BP_RemoveBurming.BP_RemoveBurming_C";

// 着火标签
const BuringTag = new UE.GameplayTag("Ability.FireBlast.BuringDamage")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_RemoveBurming extends UE.Game.Blueprints.Ability._05FireBlast.BP_RemoveBurming.BP_RemoveBurming_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_RemoveBurming implements BP_RemoveBurming {
    ReceiveBeginPlay() {
        this.Box.OnComponentBeginOverlap.Add((...args) => this.BoxBeginOverlap(...args))
    }

    // Box的重叠事件
    BoxBeginOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number, bFromSweep: boolean, SweepResult: UE.HitResult) {
        let Character = OtherActor as UE.Game.Blueprints.Character.BP_BaseCharacter.BP_BaseCharacter_C
        if (Character) {
            if (UE.AbilitySystemBlueprintLibrary.GetAbilitySystemComponent(Character).HasMatchingGameplayTag(BuringTag)) {
                // 移除着火效果
                UE.AbilitySystemBlueprintLibrary.GetAbilitySystemComponent(Character).RemoveActiveEffectsWithTags(UE.BlueprintGameplayTagLibrary.MakeGameplayTagContainerFromTag(BuringTag as UE.GameplayTag))
                console.log(`${Character.GetName()}移除了着火效果`)
            }
        }
    }
}