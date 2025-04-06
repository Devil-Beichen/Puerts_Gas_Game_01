import * as UE from "ue";
import mixin from "../../../../mixin";
import {$Nullable} from "puerts";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemys/AI/BTT_FindPlayer.BTT_FindPlayer_C";
// 玩家类
const BP_PlayerClass = UE.Class.Load("/Game/Blueprints/Character/Player/BP_Player.BP_Player_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTT_FindPlayer extends UE.Game.Blueprints.Character.Enemys.AI.BTT_FindPlayer.BTT_FindPlayer_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTT_FindPlayer implements BTT_FindPlayer {
    TempPlayer: UE.Game.Blueprints.Character.BP_BaseBaseCharacter.BP_BaseBaseCharacter_C;

    ReceiveExecuteAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {

        if (UE.BTFunctionLibrary.GetBlackboardValueAsActor(this, this.Player)) {
            this.TempPlayer = UE.BTFunctionLibrary.GetBlackboardValueAsActor(this, this.Player) as UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C

            this.ChackCharacter()

        } else {
            this.TempPlayer = UE.GameplayStatics.GetActorOfClass(this, BP_PlayerClass) as UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C
            this.ChackCharacter()
        }
    }

    // 角色判断
    ChackCharacter() {
        if (this.TempPlayer && !this.TempPlayer.Dead) {
            // 设置黑板
            UE.BTFunctionLibrary.SetBlackboardValueAsObject(this, this.Player, this.TempPlayer)
            this.FinishExecute(true)
        } else {
            // 设置黑板
            UE.BTFunctionLibrary.SetBlackboardValueAsObject(this, this.Player, null)
            this.FinishExecute(true)
        }
    }


}