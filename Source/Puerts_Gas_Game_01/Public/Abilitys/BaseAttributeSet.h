// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "AttributeSet.h"
#include "AbilitySystemComponent.h"
#include "BaseAttributeSet.generated.h"

// 标准属性宏
#define ATTRIBUTE_ACCESSORS(ClassName, PropertyName) \
GAMEPLAYATTRIBUTE_PROPERTY_GETTER(ClassName, PropertyName) \
GAMEPLAYATTRIBUTE_VALUE_GETTER(PropertyName) \
GAMEPLAYATTRIBUTE_VALUE_SETTER(PropertyName) \
GAMEPLAYATTRIBUTE_VALUE_INITTER(PropertyName)


/**
 * 基础属性集
 */
UCLASS()
class PUERTS_GAS_GAME_01_API UBaseAttributeSet : public UAttributeSet
{
	GENERATED_BODY()

public:
	// 生命值
	UPROPERTY(BlueprintReadOnly, Category="BaseAttributeSet")
	FGameplayAttributeData HP;
	ATTRIBUTE_ACCESSORS(UBaseAttributeSet, HP)

	// 最大生命值
	UPROPERTY(BlueprintReadOnly, Category="BaseAttributeSet")
	FGameplayAttributeData MaxHP;
	ATTRIBUTE_ACCESSORS(UBaseAttributeSet, MaxHP)

	// 魔法值
	UPROPERTY(BlueprintReadOnly, Category="BaseAttributeSet")
	FGameplayAttributeData MP;
	ATTRIBUTE_ACCESSORS(UBaseAttributeSet, MP)

	// 最大魔法值
	UPROPERTY(BlueprintReadOnly, Category="BaseAttributeSet")
	FGameplayAttributeData MaxMP;
	ATTRIBUTE_ACCESSORS(UBaseAttributeSet, MaxMP)

	// 能量
	UPROPERTY(EditDefaultsOnly, BlueprintReadWrite, Category="BaseAttributeSet")
	FGameplayAttributeData SP;
	ATTRIBUTE_ACCESSORS(UBaseAttributeSet, SP);

	// 最大能量
	UPROPERTY(EditDefaultsOnly, BlueprintReadWrite, Category="BaseAttributeSet")
	FGameplayAttributeData MaxSP;
	ATTRIBUTE_ACCESSORS(UBaseAttributeSet, MaxSP);

	// 限制技能值 游戏后执行
	virtual void PostGameplayEffectExecute(const struct FGameplayEffectModCallbackData& Data) override;
};
