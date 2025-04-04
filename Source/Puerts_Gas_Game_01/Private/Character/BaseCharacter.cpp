// Fill out your copyright notice in the Description page of Project Settings.


#include "Character/BaseCharacter.h"

#include "AbilitySystemComponent.h"
#include "Abilitys/BaseAttributeSet.h"
#include "Abilitys/BaseGameplayAbility.h"


ABaseCharacter::ABaseCharacter()
{
	PrimaryActorTick.bCanEverTick = false;

	AbilitySystem = CreateDefaultSubobject<UAbilitySystemComponent>(TEXT("AbilitySystem"));
}

void ABaseCharacter::BeginPlay()
{
	Super::BeginPlay();
	if (AbilitySystem)
	{
		// 监听属性变化
		AbilitySystem->GetGameplayAttributeValueChangeDelegate(UBaseAttributeSet::GetHPAttribute()).AddUObject(this, &ABaseCharacter::OnHPAttributeChanged);
		AbilitySystem->GetGameplayAttributeValueChangeDelegate(UBaseAttributeSet::GetMPAttribute()).AddUObject(this, &ABaseCharacter::OnMPAttributeChanged);
		AbilitySystem->GetGameplayAttributeValueChangeDelegate(UBaseAttributeSet::GetSPAttribute()).AddUObject(this, &ABaseCharacter::OnSPAttributeChanged);
	}
}

// 获取技能系统
TObjectPtr<UAbilitySystemComponent> ABaseCharacter::GetAbilitySystemComponent_Implementation() const
{
	if (AbilitySystem)
	{
		return AbilitySystem;
	}
	return nullptr;
}

// 获取技能信息
FGameplayAbilityInfo ABaseCharacter::GetAbilityInfo(const TSubclassOf<UBaseGameplayAbility> AbilityClass, const int Level) const
{
	if (const UBaseGameplayAbility* Ability = AbilityClass->GetDefaultObject<UBaseGameplayAbility>(); AbilitySystem)
	{
		return Ability->GetAbilityInfo(Level);
	}
	return FGameplayAbilityInfo();
}

// 监听血量变化
void ABaseCharacter::OnHPAttributeChanged(const FOnAttributeChangeData& Data)
{
	// 属性变化在回调
	if (Data.OldValue != Data.NewValue)
	{
		HPChange.Broadcast(Data.NewValue);
	}
}

// 监听蓝量变化
void ABaseCharacter::OnMPAttributeChanged(const FOnAttributeChangeData& Data)
{
	// 属性变化在回调
	if (Data.OldValue != Data.NewValue)
	{
		MPChange.Broadcast(Data.NewValue);
	}
}

// 监听蓝量变化
void ABaseCharacter::OnSPAttributeChanged(const FOnAttributeChangeData& Data)
{
	// 属性变化在回调
	if (Data.OldValue != Data.NewValue)
	{
		SPChange.Broadcast(Data.NewValue);
	}
}
