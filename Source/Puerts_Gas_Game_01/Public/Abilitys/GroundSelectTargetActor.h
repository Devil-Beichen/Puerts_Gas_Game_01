// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Abilities/GameplayAbilityTargetActor.h"
#include "GroundSelectTargetActor.generated.h"

/**
 * 地面选择目标Actor
 */
UCLASS()
class PUERTS_GAS_GAME_01_API AGroundSelectTargetActor : public AGameplayAbilityTargetActor
{
	GENERATED_BODY()

public:
	AGroundSelectTargetActor();

	virtual void Tick(float DeltaSeconds) override;

	// 启用目标选择
	virtual void StartTargeting(UGameplayAbility* Ability) override;

	// 确认目标选择并且发射数据
	virtual void ConfirmTargetingAndContinue() override;

	// 获取玩家当前瞄准的点
	UFUNCTION(BlueprintPure)
	FVector GetPlayerLookAtPoint();

	// 选中半径
	UPROPERTY(EditAnywhere, BlueprintReadWrite, meta=(ExposeOnSpawn = true), Category="GroundSelect")
	float SelectRadius = 10.f;
};
