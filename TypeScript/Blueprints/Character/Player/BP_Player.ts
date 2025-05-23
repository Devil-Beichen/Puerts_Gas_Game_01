﻿import * as UE from "ue";

import mixin from "../../../mixin";

import {BP_BaseCharacter} from "../BP_BaseCharacter";
import {$Nullable} from "puerts";



// 资产路径
const AssetPath = "/Game/Blueprints/Character/Player/BP_Player.BP_Player_C";

// 输入映射上下文
const IMC_Default = UE.InputMappingContext.Load("/Game/Blueprints/Input/IMC_Default.IMC_Default")

// 冲刺命中Tag
const DashHitTag = new UE.GameplayTag("Ability.Dash.HitEvent")

// 拉回Tag
const PullBakTag = new UE.GameplayTag("Ability.FireBlast.PullBack")

// 推走Tag
const PushAwayTag = new UE.GameplayTag("Ability.FireBlast.PushAway")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_Player extends UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_Player extends BP_BaseCharacter implements BP_Player {

    // 相机开始位置
    CameraStartLocation = new UE.Vector;
    // 相机结束位置
    CameraEndLocation = new UE.Vector(0, 0, 180);
    // 相机开始旋转
    CameraStartRotation = new UE.Rotator;
    // 相机结束旋转
    CameraEndRotation = new UE.Rotator(-17, 0, 0);

    ReceiveBeginPlay() {
        this.BP_PlayerController = UE.GameplayStatics.GetPlayerController(this, 0) as UE.Game.Blueprints.Gameplay.BP_PlayerController.BP_PlayerController_C

        super.ReceiveBeginPlay()
        this.CameraLocation.SetPlayRate(1 / 0.25)

        if (this.BP_PlayerController) {
            // 获取增强输入子系统
            const EnhancedInputSubsystem = UE.SubsystemBlueprintLibrary.GetLocalPlayerSubSystemFromPlayerController(this.BP_PlayerController, UE.EnhancedInputLocalPlayerSubsystem.StaticClass()) as UE.EnhancedInputLocalPlayerSubsystem;
            if (EnhancedInputSubsystem) {
                EnhancedInputSubsystem.AddMappingContext(IMC_Default, 0);
            }
        }

        this.Sphere.OnComponentBeginOverlap.Add((...args) => this.SphereOnOverlap(...args))
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

    // 设置摩擦力为0
    SetFrictionToZero(Zero: boolean) {
        super.SetFrictionToZero(Zero);
        this.Sphere.SetSphereRadius(Zero ? 80 : 32, true)
        this.SpringArm.bDoCollisionTest = !Zero
        this.AttackActors.Empty()
    }

    // 球体重叠事件
    SphereOnOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number, bFromSweep: boolean, SweepResult: UE.HitResult) {
        let HitChatacter = OtherActor as UE.Game.Blueprints.Character.BP_BaseCharacter.BP_BaseCharacter_C
        if (!this.AttackActors.Contains(HitChatacter) && HitChatacter != this) {

            // 创建游戏玩法事件数据进行广播
            let GameplayEventData = new UE.GameplayEventData()
            GameplayEventData.EventTag = DashHitTag
            GameplayEventData.Instigator = this
            GameplayEventData.Target = HitChatacter
            UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this, DashHitTag, GameplayEventData)

            this.AttackActors.Add(HitChatacter)
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

    // 蓝量变化事件
    protected MPChangeEvent(Value: number) {
        let Pre = Value / UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(this.AbilitySystem, new UE.GameplayAttribute("MaxMP", "/Script/Puerts_Gas_Game_01.BaseAttributeSet:MaxMP", null), null)
        this.BP_PlayerController.MainUI.MPAttributeBar.SetProgress(Pre)
    }

    // 能量变化
    protected SPChangeEvent(Value: number) {
        let Pre = Value / UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(this.AbilitySystem, new UE.GameplayAttribute("MaxSP", "/Script/Puerts_Gas_Game_01.BaseAttributeSet:MaxSP", null), null)
        this.BP_PlayerController.MainUI.SPAttributeBar.SetProgress(Pre)
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
            this.CameraStartLocation = this.Camera.RelativeLocation
            this.CameraStartRotation = this.Camera.RelativeRotation
        } else {
            this.CameraLocation.ReverseFromEnd()
            this.CameraStartLocation = UE.Vector.ZeroVector
            this.CameraStartRotation = UE.Rotator.ZeroRotator
        }
    }

    // 相机位置缓动
    CameraLocation__UpdateFunc() {
        let NewLocation = UE.KismetMathLibrary.VLerp(this.CameraStartLocation, new UE.Vector(0, 0, 180), this.CameraLocation_Time_E679C4044A332CE3891EBABC32FEC70C)
        let NewRotation = UE.KismetMathLibrary.RLerp(this.CameraStartRotation, new UE.Rotator(-17, 0, 0), this.CameraLocation_Time_E679C4044A332CE3891EBABC32FEC70C, true)
        this.Camera.K2_SetRelativeLocationAndRotation(NewLocation, NewRotation, false, null, false)
    }

    // 拉回
    PullBack() {
        UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this, PullBakTag, null)
    }

    // 推开
    PushAway() {
        UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this, PushAwayTag, null)
    }
}