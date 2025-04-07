import * as UE from "ue";
import mixin from "../../../../mixin";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Player/UMG/UMG_AbilitySlot.UMG_AbilitySlot_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface UMG_AbilitySlot extends UE.Game.Blueprints.Character.Player.UMG.UMG_AbilitySlot.UMG_AbilitySlot_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class UMG_AbilitySlot implements UMG_AbilitySlot {

    // 总CD
    CD: number;
    // 当前CD
    CD_Current: number;
    // 在技能CD期间
    IsDuringCD: boolean;

    PreConstruct(IsDesignTime: boolean) {
        this.Key.SetText(this.KeyText)
    }

    Tick(MyGeometry: UE.Geometry, InDeltaTime: number) {
        this.UpdateCD(InDeltaTime)
    }

    // 初始化信息
    InitInfo(AbilityInfo: UE.GameplayAbilityInfo) {
        this.CD = AbilityInfo.CD
        this.AbilityClass = AbilityInfo.AbilityClass
        this.AbilityImage.SetBrushFromMaterial(AbilityInfo.IconMaterial)
        console.log(`初始化 `)
    }

    // 开始UI的CD
    StartUI_CD() {
        this.IsDuringCD = true
        this.CD_Text.SetVisibility(UE.ESlateVisibility.Visible)
        this.CD_Current = this.CD
    }

    // 更新UI的CD
    UpdateCD(DeltaTime: number) {
        if (this.IsDuringCD) {
            this.CD_Current = UE.KismetMathLibrary.FClamp(this.CD_Current - DeltaTime, 0, this.CD)
            if (this.CD_Current > 0) {

                this.CD_Text.Text = this.CD_Current.toString()
                this.AbilityImage.GetDynamicMaterial().SetScalarParameterValue("Pre", UE.KismetMathLibrary.FClamp((1 - this.CD_Current / this.CD), 0, 1))

            } else {
                this.CD_Text.SetVisibility(UE.ESlateVisibility.Hidden)
                this.IsDuringCD = false
                this.AbilityImage.GetDynamicMaterial().SetScalarParameterValue("Pre", 1)
            }
        }
    }
}