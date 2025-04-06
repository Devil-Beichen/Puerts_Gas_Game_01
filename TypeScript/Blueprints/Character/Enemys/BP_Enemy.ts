import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_BaseBaseCharacter} from "../BP_BaseBaseCharacter";
import {$Delegate, GameplayAttribute} from "ue";
import {$ref, $Ref} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemys/BP_Enemy.BP_Enemy_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_Enemy extends UE.Game.Blueprints.Character.Enemys.BP_Enemy.BP_Enemy_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_Enemy extends BP_BaseBaseCharacter implements BP_Enemy {

    UMGEnemyBar: UE.Game.Blueprints.Character.Enemys.UMG.UMG_EnemyBay.UMG_EnemyBay_C;

    ReceiveBeginPlay() {
        super.ReceiveBeginPlay();

        this.UMGEnemyBar = this.Bar.GetUserWidgetObject() as UE.Game.Blueprints.Character.Enemys.UMG.UMG_EnemyBay.UMG_EnemyBay_C

        this.SetBarValue()
    }

    ReceiveTick(DeltaSeconds: number) {
        super.ReceiveTick(DeltaSeconds);
        this.SetBarValue()
        this.SetBarRotation()
    }

    protected HPChangeEvent(Value: number) {
        super.HPChangeEvent(Value);
        if (this.Dead) {
            this.StopController()
         UE.KismetSystemLibrary.K2_SetTimer(this,"DestroyBar",1.5,false)
        }
    }

    DestroyBar() {
        this.Bar.K2_DestroyComponent(this)
    }

    // 停止控制
    protected StopController() {
        let Controller = UE.AIBlueprintHelperLibrary.GetAIController(this.GetController())
        if (Controller) {
            Controller.BrainComponent.StopLogic("Death!!!")
        }
    }

    // 恢复控制
    protected ResumeController() {
        let Controller = UE.AIBlueprintHelperLibrary.GetAIController(this.GetController())
        if (Controller) {
            Controller.BrainComponent.RestartLogic()
        }
    }

    // 设置血条的值
    SetBarValue() {
        if (this.UMGEnemyBar) {
            let bSuccess: $Ref<boolean> = $ref(false)
            this.UMGEnemyBar.HP = UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(this.AbilitySystem, new GameplayAttribute("HP", "/Script/Puerts_Gas_Game_01.BaseAttributeSet:HP", null), bSuccess)
            this.UMGEnemyBar.MaxHP = UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(this.AbilitySystem, new GameplayAttribute("MaxHP", "/Script/Puerts_Gas_Game_01.BaseAttributeSet:MaxHP", null), bSuccess)
            // console.log(`${this.UMGEnemyBar.HP}/${this.UMGEnemyBar.MaxHP}...Tick`)
        }
    }

    SetBarRotation() {
        if (this.Bar) {
            let CameraRotation = UE.GameplayStatics.GetPlayerCameraManager(this.GetWorld(), 0).GetCameraRotation()
            let NewRotation = new UE.Rotator
            NewRotation.Roll = CameraRotation.Roll * -1
            NewRotation.Pitch = CameraRotation.Pitch * -1
            NewRotation.Yaw = CameraRotation.Yaw + 180

            this.Bar.K2_SetWorldRotation(NewRotation, false, null, false)
        }
    }

}