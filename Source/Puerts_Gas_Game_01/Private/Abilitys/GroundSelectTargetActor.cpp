// Fill out your copyright notice in the Description page of Project Settings.


#include "Abilitys/GroundSelectTargetActor.h"

#include "Abilities/GameplayAbility.h"


AGroundSelectTargetActor::AGroundSelectTargetActor()
{
	PrimaryActorTick.bCanEverTick = true;
}

void AGroundSelectTargetActor::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);
}

void AGroundSelectTargetActor::StartTargeting(UGameplayAbility* Ability)
{
	Super::StartTargeting(Ability);
	PrimaryPC = Cast<APlayerController>(Ability->GetOwningActorFromActorInfo()->GetInstigatorController());
}

void AGroundSelectTargetActor::ConfirmTargetingAndContinue()
{
	FVector LookPoint = GetPlayerLookAtPoint();
	if (LookPoint.Size() != 0)
	{
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
			FCollisionShape::MakeSphere(SelectRadius),
			CollisionParams
		);

		// 创建一个数据句柄，用来封装目标信息
		FGameplayAbilityTargetDataHandle TargetDataHandle;
		// 创建一个目标位置信息，并且将他加入搭配目标数据句柄中
		FGameplayAbilityTargetData_LocationInfo* CenterLocation = new FGameplayAbilityTargetData_LocationInfo();
		CenterLocation->TargetLocation.LiteralTransform = FTransform(LookPoint);
		// 位置类型选择 使用原始转换结果
		CenterLocation->TargetLocation.LocationType = EGameplayAbilityTargetingLocationType::LiteralTransform;
		// 将目标位置信息加入到目标数据句柄中
		TargetDataHandle.Add(CenterLocation);

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
		check(ShouldProduceTargetData())

		// 如果允许确认目标数据，则把数据广播出去
		if (IsConfirmTargetingAllowed())
		{
			TargetDataReadyDelegate.Broadcast(TargetDataHandle);
		}
	}
}

FVector AGroundSelectTargetActor::GetPlayerLookAtPoint()
{
	FVector ViewLocation; // 存储玩家视角的位置
	FRotator ViewRotation; // 存储玩家视角的旋转

	// 获取玩家视角的位置和旋转
	PrimaryPC->GetPlayerViewPoint(ViewLocation, ViewRotation);

	/**
	 * 获取玩家视角位置到500米范围内最近的可碰撞物体的碰撞点
	 */
	FHitResult HitResult;
	FCollisionQueryParams CollisionParams;
	CollisionParams.bTraceComplex = true;
	CollisionParams.AddIgnoredActor(PrimaryPC->GetPawn());

	bool TraceResult = GetWorld()->LineTraceSingleByChannel(
		HitResult,
		ViewLocation,
		ViewLocation + ViewRotation.Vector() * 5000.f,
		ECC_Visibility,
		CollisionParams
	);

	if (TraceResult)
	{
		return HitResult.ImpactPoint;
	}
	return FVector();
}
