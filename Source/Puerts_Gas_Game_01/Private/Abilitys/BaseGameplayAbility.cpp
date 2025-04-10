// Fill out your copyright notice in the Description page of Project Settings.


#include "Abilitys/BaseGameplayAbility.h"

#include "AbilitySystemBlueprintLibrary.h"
#include "Abilitys/BaseAttributeSet.h"

// 获取技能信息
FGameplayAbilityInfo UBaseGameplayAbility::GetAbilityInfo(const int Level) const
{
	// 获取技能冷却和消耗
	const UGameplayEffect* CDEffect = GetCooldownGameplayEffect();
	const UGameplayEffect* CostEffect = GetCostGameplayEffect();

	// 技能消耗类型
	ECostType CostType = ECT_HP;

	if (CDEffect && CostEffect)
	{
		// 获取技能CD
		float CDValue = 0.f;
		// 获取技能冷却
		CDEffect->DurationMagnitude.GetStaticMagnitudeIfPossible(Level, CDValue);
		// 判断技能是否消耗属性
		if (CostEffect->Modifiers.Num() > 0)
		{
			// 获取技能消耗值
			float CostValue = 0.f;
			FGameplayModifierInfo CostEffectModifierInfo = CostEffect->Modifiers[0];
			CostEffectModifierInfo.ModifierMagnitude.GetStaticMagnitudeIfPossible(Level, CostValue);
			const FString CostTypeName = CostEffectModifierInfo.Attribute.AttributeName;
			if (CostTypeName == "HP")
			{
				CostType = ECT_HP;
			}
			if (CostTypeName == "MP")
			{
				CostType = ECT_MP;
			}
			if (CostTypeName == "SP")
			{
				CostType = ECT_SP;
			}
			return FGameplayAbilityInfo(IconMaterial, GetClass(), CDValue, CostType, CostValue);
		}
	}
	return FGameplayAbilityInfo();
}

// 判断是否满足消耗
bool UBaseGameplayAbility::IsSatisfyCost_Implementation() const
{
	// 判断是是否拥有技能系统组件
	// if (const AActor* OwningActor = GetOwningActorFromActorInfo(); OwningActor && OwningActor->GetClass()->ImplementsInterface(UGameInstance::StaticClass()))
	if (AActor* OwningActor = GetOwningActorFromActorInfo())
	{
		if (UAbilitySystemComponent* AbilitySystemComponent = UAbilitySystemBlueprintLibrary::GetAbilitySystemComponent(OwningActor))
		{
			const FGameplayAbilityInfo ReturnValue = GetAbilityInfo(0);

			float Value = 0.f;
			// 结果
			bool bSatisfy = false;
			switch (ReturnValue.CostType)
			{
			case ECT_HP:
				Value = UAbilitySystemBlueprintLibrary::GetFloatAttributeFromAbilitySystemComponent(AbilitySystemComponent, UBaseAttributeSet::GetHPAttribute(), bSatisfy);
				break;
			case ECT_MP:
				Value = UAbilitySystemBlueprintLibrary::GetFloatAttributeFromAbilitySystemComponent(AbilitySystemComponent, UBaseAttributeSet::GetMPAttribute(), bSatisfy);
				break;
			case ECT_SP:
				Value = UAbilitySystemBlueprintLibrary::GetFloatAttributeFromAbilitySystemComponent(AbilitySystemComponent, UBaseAttributeSet::GetSPAttribute(), bSatisfy);
				break;
			default:
				break;
			}
			if (bSatisfy && Value > 0.f)
			{
				return true;
			}
		}
	}

	return false;
}
