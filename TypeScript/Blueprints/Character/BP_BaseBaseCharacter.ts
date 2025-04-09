import * as UE from "ue";
import mixin from "../../mixin";
import {$Nullable, $ref, $Ref} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/BP_BaseBaseCharacter.BP_BaseBaseCharacter_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_BaseBaseCharacter extends UE.Game.Blueprints.Character.BP_BaseBaseCharacter.BP_BaseBaseCharacter_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_BaseBaseCharacter implements BP_BaseBaseCharacter {

    // 初始摩擦力
    InitFriction: number;

    ReceiveBeginPlay() {
        this.InitFriction = this.CharacterMovement.GroundFriction
        // 获取动画实例
        this.ABP_Sinbi = this.Mesh.GetAnimInstance() as UE.Game.Blueprints.Character.Animations.ABP_Sinbi.ABP_Sinbi_C

        this.InitAbility()
        // 绑定碰撞检测
        this.DamageBox.OnComponentBeginOverlap.Add((...args) => this.WeaponOnOverlap(...args))

        /**
         * 绑定属性变化事件
         */
        this.HPChange.Add((...args) => this.HPChangeEvent(...args))
        this.MPChange.Add((...args) => this.MPChangeEvent(...args))
        this.SPChange.Add((...args) => this.SPChangeEvent(...args))

    }


    // 血量变化函数
    protected HPChangeEvent(Value: number) {
        if (Value <= 0) {
            this.ABP_Sinbi.Die = true
            this.Dead = true

            let BaseRegenTag = new UE.GameplayTag
            BaseRegenTag.TagName = ("Ability.BaseRegen")

            this.AbilitySystem.RemoveActiveEffectsWithTags(this.GetAbilityTag(BaseRegenTag))

            // 死亡时关闭碰撞检测
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Pawn, UE.ECollisionResponse.ECR_Ignore)
        }

        /*UE.KismetSystemLibrary.PrintString(
                 this,
                 `${this.GetName()} 的剩余血量 ：${Value} `,
                 true,
                 true,
                 UE.LinearColor.Yellow,
                 5.0
             )

         this.Attribute.AttributeName = "HP"
         this.Attribute.Attribute = "/Script/Puerts_Gas_Game_01.BaseAttributeSet:HP"
 
         console.log(`${this.Attribute.AttributeName}... ${this.Attribute.Attribute}`)
         let bSuccess: $Ref<boolean> = $ref(false)
 
         let outValue = UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(
             UE.AbilitySystemBlueprintLibrary.GetAbilitySystemComponent(this),
             this.Attribute,
             bSuccess
         )*/

    }

    // 设置摩擦力为0并且设置对应碰撞
    SetFrictionToZero(Zero: boolean) {
        if (Zero) {
            this.CharacterMovement.GroundFriction = 0
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Pawn, UE.ECollisionResponse.ECR_Ignore)
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Camera, UE.ECollisionResponse.ECR_Ignore)
        } else {
            this.CharacterMovement.GroundFriction = this.InitFriction
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Pawn, UE.ECollisionResponse.ECR_Block)
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Camera, UE.ECollisionResponse.ECR_Block)
        }
    }

    // 蓝量变化函数
    protected MPChangeEvent(Value: number) {
    }

    // 能量变化函数
    protected SPChangeEvent(Value: number) {
    }

    // 开启伤害
    OpenDamage() {
        this.DamageBox.SetCollisionEnabled(UE.ECollisionEnabled.QueryOnly)
    }

    // 关闭伤害
    EndDamage() {
        this.DamageBox.SetCollisionEnabled(UE.ECollisionEnabled.NoCollision)
        // 清空数组
        this.AttackActors.Empty()
    }

    // 武器碰撞检测
    WeaponOnOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number, bFromSweep: boolean, SweepResult: UE.HitResult) {
        if (OtherActor != this) {
            let HitChatacter = OtherActor as UE.Game.Blueprints.Character.BP_BaseBaseCharacter.BP_BaseBaseCharacter_C
            if (!this.AttackActors.Contains(HitChatacter)) {

                /* UE.KismetSystemLibrary.PrintString(
                     this.GetWorld(),
                     `我是${this.GetName()}.. 我命中了 ==》 ${HitChatacter.GetName()}`,
                     true,
                     true,
                     UE.LinearColor.Red,
                     5.0
                 )*/
                this.AttackActors.Add(HitChatacter)

                // 普攻命中Tag
                let MeleeHitTag = new UE.GameplayTag()
                MeleeHitTag.TagName = ("Ability.Melee.HitEvent")
                // 创建游戏玩法事件数据
                let GameplayEventData = new UE.GameplayEventData()
                GameplayEventData.EventTag = MeleeHitTag
                GameplayEventData.Instigator = this
                GameplayEventData.Target = HitChatacter

                UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this, MeleeHitTag, GameplayEventData)
            }
        }
    }

    // 推力
    PushAwaly(Force: number, Time: number, ImpulseDirection: UE.Vector) {
        this.SetFrictionToZero(true)
        const Impulse = new UE.Vector(ImpulseDirection.X * Force, ImpulseDirection.Y * Force, ImpulseDirection.Z * Force)
        this.CharacterMovement.AddImpulse(Impulse, true)
        // 设置时间
        setTimeout(() => {
            this.SetFrictionToZero(false)
        }, Time * 1000)
    }

    // 初始化技能
    protected InitAbility() {
        const GasNum = this.GAS.Num()
        for (let i = 0; i < GasNum; i++) {
            if (this.GAS.Get(i)) {
                this.AbilitySystem.K2_GiveAbility(this.GAS.Get(i))
            }
        }
    }

    // 激活技能
    ActivateAbility(AbilityTag: UE.GameplayTag) {

        // 死亡时无法激活技能
        if (this.Dead) return

        UE.AbilitySystemBlueprintLibrary.GetAbilitySystemComponent(this).TryActivateAbilitiesByTag(this.GetAbilityTag(AbilityTag), true)
    }

    // 根据传入的GameplayTag获取GAS使用的Tag
    GetAbilityTag(AbilityTag: UE.GameplayTag): UE.GameplayTagContainer {
        return UE.BlueprintGameplayTagLibrary.MakeGameplayTagContainerFromTag(AbilityTag as UE.GameplayTag)
    }


}