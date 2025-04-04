// Fill out your copyright notice in the Description page of Project Settings.


#include "YcAnimNotify_Script.h"

FString UYcAnimNotify_Script::GetNotifyName_Implementation() const
{
	return FunctionName.ToString();
}

/**
 * @brief 处理动画通知的函数，当动画播放到特定帧时触发。
 * 
 * 该函数首先调用父类的Notify方法，然后检查传入的MeshComp是否有效。
 * 如果有效，获取MeshComp的所有者（Actor），并尝试在该Actor上查找指定的函数。
 * 如果找到该函数，则通过ProcessEvent方法触发该函数的执行。
 * 
 * @param MeshComp 指向骨骼网格组件的指针，表示触发通知的动画所在的网格组件。
 * @param Animation 指向动画序列的指针，表示触发通知的动画。
 * @param EventReference 动画通知事件的引用，包含与通知相关的信息。
 */
void UYcAnimNotify_Script::Notify(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation, const FAnimNotifyEventReference& EventReference)
{
	// 调用父类的Notify方法，确保父类的逻辑得到执行
	Super::Notify(MeshComp, Animation, EventReference);

	// 检查MeshComp是否有效，如果无效则直接返回
	if (!MeshComp) return;

	// 获取MeshComp的所有者（Actor）
	if (AActor* TempActor = MeshComp->GetOwner())
	{
		// 在Actor上查找指定的函数
		if (UFunction* TempFunction = TempActor->FindFunction(FunctionName))
		{
			// 如果找到函数，则通过ProcessEvent方法触发该函数的执行
			TempActor->ProcessEvent(TempFunction, nullptr);
		}
	}
}
