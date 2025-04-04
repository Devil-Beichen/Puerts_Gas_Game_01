import * as UE from "ue";
import mixin from "../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/BP_BaseBaseCharacter.BP_BaseBaseCharacter_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_BaseBaseCharacter extends UE.Game.Blueprints.Character.BP_BaseBaseCharacter.BP_BaseBaseCharacter_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_BaseBaseCharacter implements BP_BaseBaseCharacter {
    ReceiveBeginPlay() {
        UE.KismetSystemLibrary.PrintString(
            this.GetWorld(),
            `你好这是一条来自于 ${this.GetName()}的打印信息 `,
            true,
            true,
            UE.LinearColor.Green,
            5.0
        )
    }
}