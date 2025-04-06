import * as UE from "ue";
import mixin from "../../../../mixin";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemys/UMG/UMG_EnemyBay.UMG_EnemyBay_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface UMG_EnemyBay extends UE.Game.Blueprints.Character.Enemys.UMG.UMG_EnemyBay.UMG_EnemyBay_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class UMG_EnemyBay implements UMG_EnemyBay {

    // 获取当前血量
    GetText(): string {
        return (`${this.HP}/${this.MaxHP}`)
    }

    // 获取当前血量百分比
    Get_ProgressBar_Percent(): number {
        return UE.KismetMathLibrary.FClamp(this.HP / this.MaxHP, 0, 1) as number
    }

}