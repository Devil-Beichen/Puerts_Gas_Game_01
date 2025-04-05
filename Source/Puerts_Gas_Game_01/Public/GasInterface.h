// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "GasInterface.generated.h"

class UAbilitySystemComponent;

/**
 * 用于GAS的接口
 */
// This class does not need to be modified.
UINTERFACE()
class UGasInterface : public UInterface
{
	GENERATED_BODY()
};

/**
 * 用于GAS的接口
 */
class PUERTS_GAS_GAME_01_API IGasInterface
{
	GENERATED_BODY()

	// Add interface functions to this class. This is the class that will be inherited to implement this interface.
public:
	// 获取ASC组件
	/*UFUNCTION(BlueprintCallable, BlueprintImplementableEvent)
	UAbilitySystemComponent* GetAbilitySystemComponent() const;*/
};
