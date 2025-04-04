// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Animation/AnimNotifies/AnimNotify.h"
#include "YcAnimNotify_Script.generated.h"

/**
 * 动画脚本通知(用于动画直接触发函数，仅限于没有参数的)
 */
UCLASS()
class PUERTS_GAS_GAME_01_API UYcAnimNotify_Script : public UAnimNotify
{
	GENERATED_BODY()

public:
	// 函数名
	UPROPERTY(EditAnywhere, Category="Name")
	FName FunctionName = "None";

	// 获取函数名
	virtual FString GetNotifyName_Implementation() const override;

	// 触发调用
	virtual void Notify(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation, const FAnimNotifyEventReference& EventReference) override;
};
