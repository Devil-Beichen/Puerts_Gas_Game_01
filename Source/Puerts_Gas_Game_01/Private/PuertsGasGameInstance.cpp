// Fill out your copyright notice in the Description page of Project Settings.


#include "PuertsGasGameInstance.h"

void UPuertsGasGameInstance::OnStart()
{
	Super::OnStart();
	/**
	 * 根据调试模式初始化游戏脚本环境，并启动脚本。
	 * 
	 * 该函数根据 `bDebugMode` 和 `bWaitForDebugger` 标志决定如何初始化 `GameScript` 对象。
	 * 如果 `bDebugMode` 为真，则创建一个带有调试功能的 `puerts::FJsEnv` 实例，并可选地等待调试器连接。
	 * 如果 `bDebugMode` 为假，则创建一个普通的 `puerts::FJsEnv` 实例。
	 * 最后，函数会启动脚本，并传递必要的参数。
	 */

	if (bDebugMode)
	{
		// 在调试模式下，创建一个带有调试功能的 `puerts::FJsEnv` 实例
		// 使用自定义的 JavaScript 模块加载器和默认的日志记录器，并指定调试端口为 8080
		GameScript = MakeShared<puerts::FJsEnv>(
			std::make_unique<puerts::DefaultJSModuleLoader>(TEXT("JavaScript")),
			std::make_shared<puerts::FDefaultLogger>(),
			8080
		);

		// 如果需要等待调试器连接，则调用 `WaitDebugger` 方法
		if (bWaitForDebugger)
		{
			GameScript->WaitDebugger();
		}
	}
	else
	{
		// 在非调试模式下，创建一个普通的 `puerts::FJsEnv` 实例
		GameScript = MakeShared<puerts::FJsEnv>();
	}

	// 准备传递给脚本的参数列表，包含游戏实例对象
	TArray<TPair<FString, UObject*>> Arguments;
	Arguments.Add({TEXT("GameInstance"), this});

	// 启动脚本，指定入口模块为 "MainGame"，并传递参数
	GameScript->Start(TEXT("MainGame"), Arguments);
}

void UPuertsGasGameInstance::Init()
{
	Super::Init();
}

void UPuertsGasGameInstance::Shutdown()
{
	Super::Shutdown();
	GameScript.Reset();
}

// 调用TS函数
void UPuertsGasGameInstance::CallTS(FString FunctionName, UObject* Uobject)
{
	FCall.ExecuteIfBound(FunctionName, Uobject);
}
