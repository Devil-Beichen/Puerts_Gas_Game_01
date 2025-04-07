import * as UE from "ue";

import mixin from "../../../mixin";

import {BP_BaseBaseCharacter} from "../BP_BaseBaseCharacter";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Player/BP_Player.BP_Player_C";

// 输入映射上下文
const IMC_Default = UE.InputMappingContext.Load("/Game/Blueprints/Input/IMC_Default.IMC_Default")

// 基础回复类
const GA_BaseRegenClass = UE.Class.Load("/Game/Blueprints/Ability/BaseRegen/GA_BaseRegen.GA_BaseRegen_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_Player extends UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_Player extends BP_BaseBaseCharacter implements BP_Player {

    ReceiveBeginPlay() {
        super.ReceiveBeginPlay()
        this.CameraLocation.SetPlayRate(1 / 0.15)

        this.BP_PlayerController = UE.GameplayStatics.GetPlayerController(this, 0) as UE.Game.Blueprints.Gameplay.BP_PlayerController.BP_PlayerController_C

        if (this.BP_PlayerController) {
            // 获取增强输入子系统
            const EnhancedInputSubsystem = UE.SubsystemBlueprintLibrary.GetLocalPlayerSubSystemFromPlayerController(this.BP_PlayerController, UE.EnhancedInputLocalPlayerSubsystem.StaticClass()) as UE.EnhancedInputLocalPlayerSubsystem;
            if (EnhancedInputSubsystem) {
                EnhancedInputSubsystem.AddMappingContext(IMC_Default, 0);
            }
        }

        // 给予技能
        if (GA_BaseRegenClass) {
            this.AbilitySystem.K2_GiveAbilityAndActivateOnce(GA_BaseRegenClass)
        }
    }

    // 初始化技能
    protected InitAbility() {
        const GasNum = this.GAS.Num()
        for (let i = 0; i < GasNum; i++) {
            if (this.GAS.Get(i)) {
                this.AbilitySystem.K2_GiveAbility(this.GAS.Get(i))
                if (i > 0) {
                    this.BP_PlayerController.MainUI.AllAbilitySlot.Get(i - 1).InitInfo(this.GetAbilityInfo(this.GAS.Get(i), 0))
                }
            }
        }
    }

    // 血量变化事件
    protected HPChangeEvent(Value: number) {
        super.HPChangeEvent(Value);
        let Pre = Value / UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(this.AbilitySystem, new UE.GameplayAttribute("MaxHP", "/Script/Puerts_Gas_Game_01.BaseAttributeSet:MaxHP", null), null)
        this.BP_PlayerController.MainUI.HPAttributeBar.SetProgress(Pre)

        if (this.Dead) {
            this.DisableInput(this.BP_PlayerController)
        }
    }


    // 移动
    Move(ActionValue: UE.Vector2D) {
        let ForwardVector = UE.KismetMathLibrary.GetForwardVector(new UE.Rotator(0, this.GetControlRotation().Yaw, 0));
        let RightVector = UE.KismetMathLibrary.GetRightVector(new UE.Rotator(0, this.GetControlRotation().Yaw, 0));

        this.AddMovementInput(ForwardVector, ActionValue.Y)
        this.AddMovementInput(RightVector, ActionValue.X)

    }

    // 旋转
    Look(ActionValue: UE.Vector2D) {
        this.AddControllerYawInput(ActionValue.X)
        this.AddControllerPitchInput(ActionValue.Y)
    }

    // 锁定相机
    LockCamera(Lock$: boolean) {
        this.bUseControllerRotationYaw = Lock$
        this.SpringArm.bUsePawnControlRotation = !Lock$
        this.CharacterMovement.bOrientRotationToMovement = !Lock$

        if (Lock$) {
            this.CameraLocation.PlayFromStart()
        } else {
            this.CameraLocation.ReverseFromEnd()
        }
    }

    // 相机位置缓动
    CameraLocation__UpdateFunc() {
        let NewLocation = UE.KismetMathLibrary.VLerp(new UE.Vector(0, 0, 0), new UE.Vector(0, 0, 180), this.CameraLocation_Time_E679C4044A332CE3891EBABC32FEC70C)
        let NewRotation = UE.KismetMathLibrary.RLerp(new UE.Rotator(0, 0, 0), new UE.Rotator(-17, 0, 0), this.CameraLocation_Time_E679C4044A332CE3891EBABC32FEC70C, true)
        this.Camera.K2_SetRelativeLocationAndRotation(NewLocation, NewRotation, false, null, false)
    }
}