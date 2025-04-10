// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Abilities/GameplayAbility.h"
#include "BaseGameplayAbility.generated.h"

class UMaterialInstance;

// 技能消耗类型
UENUM(BlueprintType)
enum ECostType :uint8
{
	// 血量
	ECT_HP UMETA(DisplayName = "HP"),
	// 蓝量
	ECT_MP UMETA(DisplayName = "MP"),
	// 能量
	ECT_SP UMETA(DisplayName = "SP")
};

// 游戏玩法能力信息
USTRUCT(BlueprintType)
struct FGameplayAbilityInfo
{
	GENERATED_BODY()

public:
	// 技能图标
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AbilityInfo")
	UMaterialInstance* IconMaterial;

	// 技能类
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AbilityInfo")
	TSubclassOf<class UBaseGameplayAbility> AbilityClass;

	// 技能CD
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AbilityInfo")
	float CD;

	// 技能消耗类型
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AbilityInfo")
	TEnumAsByte<ECostType> CostType;

	// 技能消耗值
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AbilityInfo")
	float CostValue;

	// 无参构造
	FGameplayAbilityInfo()
	{
		IconMaterial = nullptr;
		AbilityClass = nullptr;
		CD = 0.0f;
		CostType = ECostType::ECT_HP;
		CostValue = 0.0f;
	}

	// 有参构造
	FGameplayAbilityInfo(UMaterialInstance* IconMaterial, TSubclassOf<class UBaseGameplayAbility> AbilityClass, float CD, ECostType CostType, float CostValue)
	{
		this->IconMaterial = IconMaterial;
		this->AbilityClass = AbilityClass;
		this->CD = CD;
		this->CostType = CostType;
		this->CostValue = CostValue;
	}
};

/**
 * 游戏技能基类
 */
UCLASS()
class PUERTS_GAS_GAME_01_API UBaseGameplayAbility : public UGameplayAbility
{
	GENERATED_BODY()

public:
	// 技能图标
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AbilityInfo")
	UMaterialInstance* IconMaterial;

	// 获取技能信息
	UFUNCTION(BlueprintCallable, Category = "AbilityInfo")
	FGameplayAbilityInfo GetAbilityInfo(const int Level) const;

	// 判断是否满足消耗
	UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "AbilityInfo")
	bool IsSatisfyCost() const;
};
