// Fill out your copyright notice in the Description page of Project Settings.


#include "Abilitys/BaseAttributeSet.h"

#include "GameplayEffectExtension.h"

void UBaseAttributeSet::PostGameplayEffectExecute(const struct FGameplayEffectModCallbackData& Data)
{
	Super::PostGameplayEffectExecute(Data);

	/**
	 * 确保属性值都在范围内
	 */
	if (Data.EvaluatedData.Attribute.GetUProperty() != nullptr)
	{
		FString AttributeName = Data.EvaluatedData.Attribute.GetUProperty()->GetName();

		// 血量限制
		if (AttributeName == "HP")
		{
			SetHP(FMath::Clamp(GetHP(), 0.f, GetMaxHP()));
		}
		/*if (AttributeName == "MaxHP")
		{
			SetMaxHP(FMath::Clamp(GetMaxHP(), 0.f, GetMaxHP()));
		}*/

		// 蓝量限制
		if (AttributeName == "MP")
		{
			SetMP(FMath::Clamp(GetMP(), 0.f, GetMaxMP()));
		}
		/*if (AttributeName == "MaxMP")
		{
			SetMaxMP(FMath::Clamp(GetMaxMP(), 0.f, GetMaxMP()));
		}*/

		// 能量限制
		if (AttributeName == "SP")
		{
			SetSP(FMath::Clamp(GetSP(), 0.f, GetMaxSP()));
		}

		/*if (AttributeName == "MaxSP")
		{
			SetMaxSP(FMath::Clamp(GetMaxSP(), 0.f, GetMaxSP()));
		}*/
	}
}
