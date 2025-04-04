// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "AutomationBlueprintFunctionLibrary.h"
#include "GasFunctionLibrary.generated.h"

/**
 * GAS函数库（暂时用不到，可能以后就用到了）
 */
UCLASS()
class PUERTS_GAS_GAME_01_API UGasFunctionLibrary : public UBlueprintFunctionLibrary
{
	GENERATED_BODY()

public:
	// 一个空函数
	UFUNCTION(BlueprintCallable, Category="GasFunctionLibrary")
	static void EmptyFunction();
};
