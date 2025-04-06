import * as UE from "ue";
import mixin from "../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Gameplay/BP_PlayerController.BP_PlayerController_C";

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

    }

    // 普通攻击
    Melee() {
        if (this.BP_Player) {
            const MeleeTag = new UE.GameplayTag("Ability.Melee")
            this.BP_Player.ActivateAbility(MeleeTag)
        }
    }
}