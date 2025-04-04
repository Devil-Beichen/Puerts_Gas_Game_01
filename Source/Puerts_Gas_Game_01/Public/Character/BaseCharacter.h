// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GasInterface.h"
#include "GameFramework/Character.h"
#include "BaseCharacter.generated.h"

struct FOnAttributeChangeData;
class UBaseGameplayAbility;
class UAbilitySystemComponent;
struct FGameplayAbilityInfo;

// 监听属性变化的代理
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnAttributeChanged, float, Value);

/**
 * 基础角色
 */
UCLASS()
class PUERTS_GAS_GAME_01_API ABaseCharacter : public ACharacter, public IGasInterface
{
	GENERATED_BODY()

public:
	ABaseCharacter();

	// 获取技能系统
	virtual TObjectPtr<UAbilitySystemComponent> GetAbilitySystemComponent_Implementation() const;

	// 获取技能信息
	UFUNCTION(BlueprintPure, Category="AbilitySystem")
	FGameplayAbilityInfo GetAbilityInfo(const TSubclassOf<UBaseGameplayAbility> AbilityClass, const int Level) const;

	// 监听血量变化
	UPROPERTY(BlueprintAssignable, Category="AbilitySystem")
	FOnAttributeChanged HPChange;
	void OnHPAttributeChanged(const FOnAttributeChangeData& Data);

	// 监听蓝量变化
	UPROPERTY(BlueprintAssignable, Category="AbilitySystem")
	FOnAttributeChanged MPChange;
	void OnMPAttributeChanged(const FOnAttributeChangeData& Data);

	// 监听能量变化
	UPROPERTY(BlueprintAssignable, Category="AbilitySystem")
	FOnAttributeChanged SPChange;
	void OnSPAttributeChanged(const FOnAttributeChangeData& Data);

protected:
	virtual void BeginPlay() override;

private:
	// 技能系统
	UPROPERTY(VisibleAnywhere, Category="AbilitySystem")
	TObjectPtr<UAbilitySystemComponent> AbilitySystem;
};
