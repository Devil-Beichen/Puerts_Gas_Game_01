// Fill out your copyright notice in the Description page of Project Settings.


#include "Abilitys/AroundTargetActor.h"

#include "Abilities/GameplayAbility.h"


// Sets default values
AAroundTargetActor::AAroundTargetActor()
{
	PrimaryActorTick.bCanEverTick = false;
}

void AAroundTargetActor::StartTargeting(UGameplayAbility* Ability)
{
	Super::StartTargeting(Ability);
	// 获取玩家控制器
	PrimaryPC = Cast<APlayerController>(Ability->GetOwningActorFromActorInfo()->GetInstigatorController());
}

void AAroundTargetActor::ConfirmTargetingAndContinue()
{
	if (!PrimaryPC->GetPawn()) return;
	FVector LookPoint = PrimaryPC->GetPawn()->GetActorLocation();
	// 重叠检测的结果
	TArray<FOverlapResult> OverlapResults;
	// 用弱指针储存重叠的Actor
	TArray<TWeakObjectPtr<AActor>> OverlapActors;
	// 碰撞参数
	FCollisionQueryParams CollisionParams;
	CollisionParams.bTraceComplex = false;
	CollisionParams.AddIgnoredActor(PrimaryPC->GetPawn());

	// 在看到的点进行球形碰撞检测
	bool QueryResult = GetWorld()->OverlapMultiByChannel(
		OverlapResults,
		LookPoint,
		FQuat::Identity,
		ECC_Pawn,
		FCollisionShape::MakeSphere(AroundRadius),
		CollisionParams
	);

	// 创建一个数据句柄，用来封装目标信息
	FGameplayAbilityTargetDataHandle TargetDataHandle;
	// 创建Actor数组数据
	FGameplayAbilityTargetData_ActorArray* ActorArray = new FGameplayAbilityTargetData_ActorArray();

	if (QueryResult)
	{
		// 遍历重叠结果，将重叠的Actor加入到OverlapActors中
		for (int i = 0; i < OverlapResults.Num(); i++)
		{
			APawn* HitPawn = Cast<APawn>(OverlapResults[i].GetActor());
			if (HitPawn && !OverlapActors.Contains(HitPawn))
			{
				OverlapActors.AddUnique(HitPawn);
			}
		}
		if (!OverlapActors.IsEmpty())
		{
			ActorArray->SetActors(OverlapActors); // 将检测到的Actor存入Actor数据
			TargetDataHandle.Add(ActorArray); // 将数组对象添加到目标数据句柄
		}
	}

	// 检查并处理目标数据准备情况
	check(ShouldProduceTargetData());

	// 如果确认目标操作被允许，则广播目标数据准备完成的消息
	if (IsConfirmTargetingAllowed())
	{
		TargetDataReadyDelegate.Broadcast(TargetDataHandle);
	}
}
