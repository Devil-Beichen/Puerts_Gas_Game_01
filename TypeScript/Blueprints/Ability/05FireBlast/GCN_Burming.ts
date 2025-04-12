import * as UE from "ue";
import mixin from "../../../mixin";
import {$Nullable} from "puerts";



// 资产路径
const AssetPath = "/Game/Blueprints/Ability/05FireBlast/GCN_Burming.GCN_Burming_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GCN_Burming extends UE.Game.Blueprints.Ability._05FireBlast.GCN_Burming.GCN_Burming_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GCN_Burming implements GCN_Burming {

    FireEmittCom: UE.ParticleSystemComponent

    // 触发
    OnApplication(Target: $Nullable<UE.Actor>, Parameters: UE.GameplayCueParameters, SpawnResults: UE.GameplayCueNotify_SpawnResult) {
        this.FireEmittCom = UE.GameplayStatics.SpawnEmitterAttached(
            this.BurmingFX,
            Target.RootComponent,
            "",
            new UE.Vector(0, 0, -65),
            UE.Rotator.ZeroRotator,
            new UE.Vector(0.4, 0.4, 0.4),
            UE.EAttachLocation.KeepRelativeOffset,
            true,
            UE.EPSCPoolMethod.ManualRelease,
            true
        )
    }

    // 移除
    OnRemoval(Target: $Nullable<UE.Actor>, Parameters: UE.GameplayCueParameters, SpawnResults: UE.GameplayCueNotify_SpawnResult) {
        if (this.FireEmittCom) {
            this.FireEmittCom.ReleaseToPool()
            this.K2_EndGameplayCue()
        }
    }
}