// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "JsEnv.h"
#include "Engine/GameInstance.h"
#include "PuertsGasGameInstance.generated.h"

/**
 * Puerts脚本的GAS游戏实例
 */
UCLASS()
class PUERTS_GAS_GAME_01_API UPuertsGasGameInstance : public UGameInstance
{
	GENERATED_BODY()
public:
	// 启动
	virtual void OnStart() override;

	// 初始化
	virtual void Init() override;

	// 关闭
	virtual void Shutdown() override;

	// 是否调试模式
	UPROPERTY(EditDefaultsOnly, BlueprintReadWrite, Category="Debug")
	uint8 bDebugMode : 1;

	// 等待调试
	UPROPERTY(EditDefaultsOnly, BlueprintReadWrite, Category="Debug")
	uint8 bWaitForDebugger : 1;

	// 调用ts函数的代理
	DECLARE_DYNAMIC_DELEGATE_TwoParams(FCall, FString, FunctionName, UObject*, Uobject);
	UPROPERTY()
	FCall FCall;

	// 调用ts函数
	UFUNCTION(BlueprintCallable)
	void CallTS(FString FunctionName, UObject* Uobject);

private:
	// 游戏脚本
	TSharedPtr<puerts::FJsEnv> GameScript;
};
