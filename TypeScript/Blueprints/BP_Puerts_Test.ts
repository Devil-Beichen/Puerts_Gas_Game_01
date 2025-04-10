// BP_Puerts_Test.ts
import * as UE from "ue";
import mixin from "../mixin";

// 加载蓝图路径
const AssetPath = "/Game/Blueprints/BP_Puerts_Test.BP_Puerts_Test_C";

// 创建一个继承ts类的接口（用来类型提示）
export interface BP_Puerts_Test extends UE.Game.Blueprints.BP_Puerts_Test.BP_Puerts_Test_C {
}

@mixin(AssetPath)
export class BP_Puerts_Test implements BP_Puerts_Test {

    ReceiveBeginPlay() {
       /* UE.KismetSystemLibrary.PrintString(
            this.GetWorld(),
            "Hello from TypeScript! 你好这是一条来自于TypeScript的打印信息!",
            true,
            true,
            UE.LinearColor.Green,
            5.0
        )*/
    }
    
    Ts_Debug(){
        UE.KismetSystemLibrary.PrintString(
            this.GetWorld(),
            "蓝图调用TS代码测试!",
            true,
            true,
            UE.LinearColor.Yellow,
            5.0
        )
    }
    

}