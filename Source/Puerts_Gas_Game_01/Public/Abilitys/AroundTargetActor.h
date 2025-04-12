// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Abilities/GameplayAbilityTargetActor.h"
#include "AroundTargetActor.generated.h"

/**
 * 选中周围目标
 */

UCLASS()
class PUERTS_GAS_GAME_01_API AAroundTargetActor : public AGameplayAbilityTargetActor
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AAroundTargetActor();

	// 启用目标选择
	virtual void StartTargeting(UGameplayAbility* Ability) override;

	// 确认目标选择并且发射数据
	virtual void ConfirmTargetingAndContinue() override;

	// 半径
	UPROPERTY(EditAnywhere, BlueprintReadWrite, meta=(ExposeOnSpawn = true), Category="GroundSelect")
	float AroundRadius = 10.f;
};
