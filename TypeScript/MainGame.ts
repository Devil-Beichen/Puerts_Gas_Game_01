import * as UE from "ue";
import {argv} from "puerts";

console.log("Hello, TypeScript!");

UE.KismetSystemLibrary.PrintString(
    null,
    `启动！！`,
    true,
    true,
    UE.LinearColor.Green,
    0.1
)

/* 获取游戏实例对象并执行类型断言
 * @param gameInstance - 通过参数管理器获取的PuertsGasGameInstance实例对象
 * @type {UE.PuertsGasGameInstance} - 显式类型断言确保符合游戏实例接口规范 */
const GameInstance = argv.getByName("GameInstance") as UE.PuertsGasGameInstance;

/* 绑定FCall回调函数
 * @param FunctionName - 需要动态调用的方法名称字符串
 * @param Uobject - 包含目标方法的游戏对象实例
 * @note 使用类型断言(as any)绕过TS类型检查，运行时动态调用对象的指定方法
 * @behavior 当FCall事件触发时，在目标对象上执行指定名称的方法 */
GameInstance.FCall.Bind((FunctionName, Uobject) => {
    (Uobject as any)[FunctionName]();
})

import "./Blueprints/BP_Puerts_Test"
import "./Blueprints/Character/BP_BaseCharacter"
import "./Blueprints/Character/Player/BP_Player"
import "./Blueprints/Gameplay/BP_PlayerController"

// GAS模块引入
import "./Blueprints/Ability/00Melee/GA_Melee"
import "./Blueprints/Ability/BaseRegen/GA_BaseRegen"

// AI部分引用
import "./Blueprints/Character/Enemys/BP_Enemy"
import "./Blueprints/Character/Enemys/UMG/UMG_EnemyBay"
import "./Blueprints/Character/Enemys/BP_AIController"
import "./Blueprints/Character/Enemys/AI/BTT_FindPlayer"
import "./Blueprints/Character/Enemys/AI/BTT_MeleeAttack"
import "./Blueprints/Character/Enemys/AI/BTS_CheckDead"
import "./Blueprints/Character/Player/UMG/UMG_AbilitySlot";
import "./Blueprints/Character/Player/UMG/UMG_AttributeBar";
import "./Blueprints/Character/Player/UMG/UMG_MainUI";
import "./Blueprints/Ability/BP_BaseGameplayAbility";
import "./Blueprints/Ability/01HPRegen/GC_HPRegen_Cue";
import "./Blueprints/Ability/01HPRegen/GA_HPRegen";
import "./Blueprints/Ability/02Dash/GA_Dash";
import "./Blueprints/Ability/03Laser/BP_LaserActor";
import "./Blueprints/Ability/03Laser/GA_Laser";
import "./Blueprints/Ability/04Ground_Blast/BP_GroundSelectTargetActor";
import "./Blueprints/Ability/04Ground_Blast/GA_Ground_Blast";
import "./Blueprints/Ability/05FireBlast/GCN_Burming";
import "./Blueprints/Ability/05FireBlast/GA_FireBlast";
import "./Blueprints/Ability/05FireBlast/BP_RemoveBurming";
import "./Blueprints/Character/Enemys/AI/BTS_CheckBuming";
import "./Blueprints/Character/Enemys/AI/BTT_FindRemoveBuming";
