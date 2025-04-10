import * as UE from "ue";
import mixin from "../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Gameplay/BP_PlayerController.BP_PlayerController_C";

// UI类
const MainUIClass = UE.Class.Load("/Game/Blueprints/Character/Player/UMG/UMG_MainUI.UMG_MainUI_C")

// 普通攻击标签
const MeleeTag = new UE.GameplayTag("Ability.Melee")

// 回血技能标签
const HPRegenTag = new UE.GameplayTag("Ability.HPRegen")

// 冲刺技能标签
const DashTag = new UE.GameplayTag("Ability.Dash")

// 激光技能标签
const LaserTag = new UE.GameplayTag("Ability.Laser")

// 激光技能结束事件标签
const LaserEndEventTag = new UE.GameplayTag("Ability.Laser.Cost.EndEvent")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_PlayerController extends UE.Game.Blueprints.Gameplay.BP_PlayerController.BP_PlayerController_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_PlayerController implements BP_PlayerController {
    ReceiveBeginPlay() {
        this.BP_Player = UE.GameplayStatics.GetPlayerCharacter(this, 0) as UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C
        UE.GameplayStatics.GetPlayerCameraManager(this, 0).ViewPitchMin = -65
        UE.GameplayStatics.GetPlayerCameraManager(this, 0).ViewPitchMax = 25
        // 创建UI
        this.MainUI = UE.WidgetBlueprintLibrary.Create(this, MainUIClass, this) as UE.Game.Blueprints.Character.Player.UMG.UMG_MainUI.UMG_MainUI_C
        if (this.MainUI) {
            this.MainUI.AddToViewport()
        }
    }

    // 普通攻击
    Melee() {
        if (this.BP_Player) {
            this.BP_Player.ActivateAbility(MeleeTag)
        }
    }

    // 回血技能
    HPRegen() {

        if (this.BP_Player) {
            this.BP_Player.ActivateAbility(HPRegenTag)
        }
    }

    // 冲刺技能
    Dash() {
        if (this.BP_Player) {
            this.BP_Player.ActivateAbility(DashTag)
        }
    }

    // 激光技能
    Laser() {
        if (this.BP_Player) {
            if (this.BP_Player.IsLasering) {
                this.BP_Player.IsLasering = false
                // 创建游戏玩法事件数据
                let GameplayEventData = new UE.GameplayEventData()
                GameplayEventData.EventTag = LaserEndEventTag
                UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this.BP_Player, LaserEndEventTag, GameplayEventData)
            } else {
                this.BP_Player.ActivateAbility(LaserTag)
            }
        }
    }
}