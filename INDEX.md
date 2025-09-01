# Project Index

This document provides a high-level overview of the project structure and key files, intended to help an LLM understand the codebase.

## `src`

The main source code directory for the extension.

*   `common.ts` - Contains common initialization and teardown logic used across different extension hosts (e.g., VS Code, standalone).
*   `config.ts` - Manages environment-specific configurations such as API base URLs for production, staging, and local development.
*   `extension.ts` - The main entry point for the VS Code extension, responsible for activation, command registration, and setting up providers.

### `src/api`

Handles all interactions with external Large Language Model (LLM) APIs.

*   #### `src/api/providers`
    This directory contains individual API handlers for various LLM providers, abstracting the specific details of each API into a common `ApiHandler` interface.
    *   `anthropic.ts` - API handler for Anthropic models (Claude series).
    *   `asksage.ts` - API handler for AskSage models.
    *   `baseten.ts` - API handler for Baseten models.
    *   `bedrock.ts` - API handler for AWS Bedrock, supporting various models available through the service.
    *   `cerebras.ts` - API handler for Cerebras models.
    *   `claude-code.ts` - API handler for interacting with the `claude-code` local binary.
    *   `cline.ts` - API handler for using Cline's own proxied model endpoints.
    *   `deepseek.ts` - API handler for DeepSeek models.
    *   `dify.ts` - API handler for Dify.ai, allowing interaction with Dify workflows.
    *   `doubao.ts` - API handler for Doubao models.
    *   `fireworks.ts` - API handler for Fireworks AI models.
    *   `gemini.ts` - API handler for Google Gemini models.
    *   `gemini-mock.test.ts` - A mock of the Gemini SDK used for testing purposes.
    *   `groq.ts` - API handler for Groq models, known for high-speed inference.
    *   `huawei-cloud-maas.ts` - API handler for Huawei Cloud MaaS models.
    *   `huggingface.ts` - API handler for models on the Hugging Face Inference API.
    *   `litellm.ts` - API handler for LiteLLM, a tool for calling various LLM APIs with a unified interface.
    *   `lmstudio.ts` - API handler for models running locally via LM Studio.
    *   `mistral.ts` - API handler for Mistral AI models.
    *   `moonshot.ts` - API handler for Moonshot AI models.
    *   `nebius.ts` - API handler for Nebius AI models.
    *   `ollama.ts` - API handler for models running locally via Ollama.
    *   `openai-native.ts` - API handler specifically for native OpenAI models like GPT-4o.
    *   `openai.ts` - API handler for any OpenAI-compatible API endpoint.
    *   `openrouter.ts` - API handler for OpenRouter, a service that aggregates multiple LLM providers.
    *   `qwen-code.ts` - API handler for Qwen Code models, which require OAuth authentication.
    *   `qwen.ts` - API handler for Alibaba's Qwen models.
    *   `requesty.ts` - API handler for Requesty.ai models.
    *   `sambanova.ts` - API handler for Sambanova models.
    *   `sapaicore.ts` - API handler for SAP AI Core models.
    *   `together.ts` - API handler for Together AI models.
    *   `types.ts` - Contains TypeScript type definitions for API provider error responses.
    *   `vercel-ai-gateway.ts` - API handler for the Vercel AI Gateway.
    *   `vertex.ts` - API handler for Google Cloud Vertex AI models.
    *   `vscode-lm.ts` - API handler that integrates with VS Code's built-in Language Model API.
    *   `xai.ts` - API handler for xAI's Grok models.
    *   `zai.ts` - API handler for Zhipu AI models.

### `src/core`

Contains the core logic of the extension, managing tasks, state, UI, and other fundamental components.

*   `README.md` - A brief overview of the core architecture.

*   #### `src/core/api`
    *   `index.ts` - A factory that creates the appropriate API handler based on the user's configuration.
    *   `retry.ts` - Implements a decorator (`@withRetry`) for API requests, providing exponential backoff for retriable errors.
    *   `retry.test.ts` - Unit tests for the retry decorator logic.
    *   ##### `src/core/api/transform`
        This sub-directory contains modules for converting message formats between Cline's internal representation (based on Anthropic's format) and the specific formats required by different LLM providers.
        *   `gemini-format.ts` - Converts messages to and from the Google Gemini API format.
        *   `mistral-format.ts` - Converts messages to the Mistral AI API format.
        *   `o1-format.ts` - Converts messages to a special format required by "o1" models.
        *   `ollama-format.ts` - Converts messages to the Ollama API format.
        *   `openai-format.ts` - Converts messages to and from the OpenAI API format.
        *   `openrouter-stream.ts` - Logic to create a streaming request specifically for OpenRouter, handling its unique parameters.
        *   `r1-format.ts` - Converts messages to the "R1" format, required by models like DeepSeek Reasoner.
        *   `stream.ts` - Defines the TypeScript types for the standardized API stream chunks used within Cline.
        *   `vercel-ai-gateway-stream.ts` - Logic to create a streaming request for the Vercel AI Gateway.
        *   `vscode-lm-format.ts` - Converts messages to and from the VS Code Language Model API format.
        *   `vscode-lm-format.test.ts` - Unit tests for the VS Code LM format conversion.

*   #### `src/core/assistant-message`
    *   `index.ts` - Defines the core types for parsed assistant messages, including text content and tool use structures.
    *   `diff.ts` - Implements the logic to parse Cline's custom `SEARCH/REPLACE` diff format and apply it to file content.
    *   `diff.test.ts` - Unit tests for the diff application logic.
    *   `diff_edge_cases.test.ts` - Additional tests covering edge cases for the diff logic.
    *   `diff_edge_cases2.test.ts` - More tests for complex edge cases in the diff logic.
    *   `parse-assistant-message.ts` - Contains the primary function for parsing the raw string output from the LLM into structured `AssistantMessageContent` objects.

*   #### `src/core/context`
    *   ##### `src/core/context/context-management`
        *   `context-error-handling.ts` - Contains functions to detect "context window exceeded" errors from various LLM APIs.
        *   `context-window-utils.ts` - Provides utilities for calculating the effective context window size for different models.
        *   `ContextManager.ts` - The main class for managing the conversation context, including strategies for truncation and summarization to avoid exceeding token limits.
        *   `ContextManager-legacy.ts` - A legacy version of the context manager.
    *   ##### `src/core/context/context-tracking`
        *   `ContextTrackerTypes.ts` - Defines TypeScript types for metadata related to context tracking.
        *   `FileContextTracker.ts` - Tracks which files are part of the current task's context and watches them for external changes to prevent stale context.
        *   `FileContextTracker.test.ts` - Unit tests for the file context tracker.
        *   `ModelContextTracker.ts` - Tracks which LLM models have been used within a task for metadata and analytics.
        *   `ModelContextTracker.test.ts` - Unit tests for the model context tracker.
    *   ##### `src/core/context/instructions/user-instructions`
        *   `cline-rules.ts` - Logic for loading and processing user-defined instructions from `.clinerules` files.
        *   `external-rules.ts` - Logic for loading user instructions from other formats, such as Cursor's `.cursorrules`.
        *   `rule-helpers.ts` - Helper functions for managing rule files, toggles, and content aggregation.
        *   `workflows.ts` - Logic for loading and managing user-defined workflows.

*   #### `src/core/controller`
    The central hub for handling interactions between the webview UI, the VS Code host, and the core task logic. It dispatches actions based on user input and system events.
    *   `index.ts` - The main `Controller` class that orchestrates the extension's logic, manages the active `Task`, and handles state.
    *   `grpc-handler.ts` - The entry point for handling gRPC-like requests coming from the webview via `postMessage`.
    *   `grpc-handler.test.ts` - Unit tests for the gRPC request handler.
    *   `grpc-request-registry.ts` - A registry to manage the lifecycle of active streaming gRPC requests.
    *   `grpc-service.ts` - A generic service registry for defining and organizing gRPC service handlers.
    *   ##### `src/core/controller/account` - Handlers for account management actions.
        *   `accountLoginClicked.ts` - Handles the user clicking the login button.
        *   `accountLogoutClicked.ts` - Handles the user clicking the logout button.
        *   `authStateChanged.ts` - Responds to changes in the user's authentication state.
        *   `getOrganizationCredits.ts` - Fetches credit balance for a user's organization.
        *   `getUserCredits.ts` - Fetches the current user's credit balance.
        *   `getUserOrganizations.ts` - Fetches the organizations a user belongs to.
        *   `openrouterAuthClicked.ts` - Initiates the OAuth flow for OpenRouter.
        *   `setUserOrganization.ts` - Sets the user's active organization.
        *   `subscribeToAuthStatusUpdate.ts` - Sets up a stream for authentication status updates to the UI.
    *   ##### `src/core/controller/browser` - Handlers for browser automation actions.
        *   `discoverBrowser.ts` - Discovers running Chrome instances that can be used for remote debugging.
        *   `getBrowserConnectionInfo.ts` - Retrieves information about the current browser connection status.
        *   `getDetectedChromePath.ts` - Gets the file path of the detected Chrome executable.
        *   `relaunchChromeDebugMode.ts` - Relaunches the Chrome browser with the remote debugging port enabled.
        *   `testBrowserConnection.ts` - Tests the connection to a remote debugging-enabled browser instance.
        *   `updateBrowserSettings.ts` - Updates settings related to browser automation.
    *   ##### `src/core/controller/checkpoints` - Handlers for task checkpoint functionality.
        *   `checkpointDiff.ts` - Shows a diff of file changes associated with a specific checkpoint.
        *   `checkpointRestore.ts` - Restores the task and/or workspace to a previous checkpoint.
    *   ##### `src/core/controller/commands` - Handlers for commands triggered from the VS Code UI (e.g., context menus, code actions).
        *   `addToCline.ts` - Handles the "Add to Cline" command, sending selected code to the chat.
        *   `explainWithCline.ts` - Handles the "Explain with Cline" command.
        *   `fixWithCline.ts` - Handles the "Fix with Cline" command for code with diagnostics.
        *   `improveWithCline.ts` - Handles the "Improve with Cline" command.
    *   ##### `src/core/controller/file` - Handlers for file system and version control operations.
        *   `copyToClipboard.ts` - Copies text to the system clipboard.
        *   `createRuleFile.ts` - Creates a new `.clinerules` file.
        *   `deleteRuleFile.ts` - Deletes a `.clinerules` file.
        *   `getRelativePaths.ts` - Converts absolute file URIs to workspace-relative paths.
        *   `ifFileExistsRelativePath.ts` - Checks if a file exists at a given relative path.
        *   `openFile.ts` - Opens a file in the editor.
        *   `openFileRelativePath.ts` - Opens a file using a workspace-relative path.
        *   `openFocusChainFile.ts` - Opens the markdown file for the current task's focus chain (todo list).
        *   `openImage.ts` - Opens an image file using the system's default viewer.
        *   `openMention.ts` - Handles opening a file, URL, or special mention from the chat.
        *   `openTaskHistory.ts` - Opens the raw JSON file containing a task's API conversation history.
        *   `refreshRules.ts` - Refreshes all user-defined rules and workflows.
        *   `searchCommits.ts` - Searches the Git history for commits matching a query.
        *   `searchFiles.ts` - Searches for files within the workspace.
        *   `selectFiles.ts` - Opens a system dialog for the user to select files.
        *   `toggleClineRule.ts` - Enables or disables a specific Cline rule.
        *   `toggleCursorRule.ts` - Enables or disables a specific Cursor rule.
        *   `toggleWindsurfRule.ts` - Enables or disables a specific Windsurf rule.
        *   `toggleWorkflow.ts` - Enables or disables a specific workflow.
    *   ##### `src/core/controller/mcp` - Handlers for the Model Context Protocol (MCP).
        *   `addRemoteMcpServer.ts` - Adds a new remote MCP server to the configuration.
        *   `deleteMcpServer.ts` - Deletes an MCP server from the configuration.
        *   `downloadMcp.ts` - Downloads an MCP server from the marketplace and starts an installation task.
        *   `getLatestMcpServers.ts` - Gets the current list of configured MCP servers.
        *   `openMcpSettings.ts` - Opens the MCP settings file for manual editing.
        *   `refreshMcpMarketplace.ts` - Refreshes the catalog of available MCP servers from the marketplace.
        *   `restartMcpServer.ts` - Restarts a specific MCP server.
        *   `subscribeToMcpMarketplaceCatalog.ts` - Sets up a stream for marketplace catalog updates.
        *   `subscribeToMcpServers.ts` - Sets up a stream for updates to the list of MCP servers.
        *   `toggleMcpServer.ts` - Enables or disables a specific MCP server.
        *   `toggleToolAutoApprove.ts` - Toggles the auto-approval setting for a specific MCP tool.
        *   `updateMcpTimeout.ts` - Updates the timeout setting for an MCP server.
    *   ##### `src/core/controller/models` - Handlers for fetching and managing LLM model information.
        *   `getLmStudioModels.ts` - Fetches the list of available models from a running LM Studio instance.
        *   `getOllamaModels.ts` - Fetches the list of available models from a running Ollama instance.
        *   `getSapAiCoreModels.ts` - Fetches the list of available models from SAP AI Core.
        *   `getVsCodeLmModels.ts` - Fetches the list of available models from the VS Code Language Model API.
        *   `refreshBasetenModels.ts` - Refreshes the list of available Baseten models.
        *   `refreshGroqModels.ts` - Refreshes the list of available Groq models.
        *   `refreshHuggingFaceModels.ts` - Refreshes the list of available Hugging Face models.
        *   `refreshOpenAiModels.ts` - Refreshes the list of models from an OpenAI-compatible endpoint.
        *   `refreshOpenRouterModels.ts` - Refreshes the list of available OpenRouter models.
        *   `refreshRequestyModels.ts` - Refreshes the list of available Requesty models.
        *   `refreshVercelAiGatewayModels.ts` - Refreshes the list of models from the Vercel AI Gateway.
        *   `subscribeToOpenRouterModels.ts` - Sets up a stream for OpenRouter model list updates.
        *   `updateApiConfigurationProto.ts` - Updates the user's API and model configuration.
    *   ##### `src/core/controller/slash` - Handlers for built-in slash commands.
        *   `condense.ts` - Handles the `/condense` command to summarize the conversation.
        *   `reportBug.ts` - Handles the `/reportbug` command.
    *   ##### `src/core/controller/state` - Handlers for managing general extension state.
        *   `getAvailableTerminalProfiles.ts` - Gets the list of available terminal profiles from VS Code.
        *   `getLatestState.ts` - Gets the entire current state of the extension.
        *   `resetState.ts` - Resets the extension's state to its default values.
        *   `setWelcomeViewCompleted.ts` - Marks the initial welcome screen as completed.
        *   `subscribeToState.ts` - Sets up a stream for all state updates to the UI.
        *   `toggleFavoriteModel.ts` - Toggles a model as a favorite.
        *   `togglePlanActModeProto.ts` - Toggles the agent between "Plan" and "Act" modes.
        *   `updateAutoApprovalSettings.ts` - Updates the settings for auto-approving tool calls.
        *   `updateDefaultTerminalProfile.ts` - Sets the default terminal profile to be used for commands.
        *   `updateSettings.ts` - A batch endpoint to update multiple settings at once.
        *   `updateTelemetrySetting.ts` - Updates the user's telemetry preference.
        *   `updateTerminalConnectionTimeout.ts` - Updates the timeout for terminal shell integration.
        *   `updateTerminalReuseEnabled.ts` - Updates the setting for whether to reuse terminals.
    *   ##### `src/core/controller/task` - Handlers for managing the lifecycle of a task.
        *   `askResponse.ts` - Handles a user's response to a question asked by the assistant.
        *   `cancelTask.ts` - Cancels the currently running task.
        *   `clearTask.ts` - Clears the current task and resets the chat view.
        *   `deleteAllTaskHistory.ts` - Deletes all saved task histories.
        *   `deleteTasksWithIds.ts` - Deletes a selection of tasks from history.
        *   `executeQuickWin.ts` - Executes a pre-defined "quick win" task.
        *   `exportTaskWithId.ts` - Exports a specific task's history to a markdown file.
        *   `getTaskHistory.ts` - Retrieves the list of saved tasks.
        *   `getTotalTasksSize.ts` - Calculates the total disk space used by all saved tasks.
        *   `newTask.ts` - Starts a new task with a given prompt.
        *   `showTaskWithId.ts` - Loads and displays a specific task from history.
        *   `taskCompletionViewChanges.ts` - Shows a diff of all changes made in a completed task.
        *   `taskFeedback.ts` - Records user feedback (thumbs up/down) for a task.
        *   `toggleTaskFavorite.ts` - Toggles a task's favorite status in the history.
    *   ##### `src/core/controller/ui` - Handlers for general UI events and subscriptions.
        *   `getWebviewHtml.ts` - Gets the webview's HTML content (for standalone host).
        *   `initializeWebview.ts` - Handles one-time initialization when the webview is first loaded.
        *   `onDidShowAnnouncement.ts` - Acknowledges that the user has seen the latest announcement.
        *   `openUrl.ts` - Opens a URL in the browser.
        *   `openWalkthrough.ts` - Opens the extension's official VS Code walkthrough.
        *   `scrollToSettings.ts` - Requests the UI to scroll to a specific settings section.
        *   `subscribeToAccountButtonClicked.ts` - Sets up a stream for account button clicks.
        *   `subscribeToAddToInput.ts` - Sets up a stream for events that add text to the chat input.
        *   `subscribeToChatButtonClicked.ts` - Sets up a stream for chat button clicks.
        *   `subscribeToDidBecomeVisible.ts` - Sets up a stream for webview visibility events.
        *   `subscribeToFocusChatInput.ts` - Sets up a stream for events that focus the chat input.
        *   `subscribeToHistoryButtonClicked.ts` - Sets up a stream for history button clicks.
        *   `subscribeToMcpButtonClicked.ts` - Sets up a stream for MCP button clicks.
        *   `subscribeToPartialMessage.ts` - Sets up a stream for partial message updates during streaming.
        *   `subscribeToRelinquishControl.ts` - Sets up a stream for events where the assistant relinquishes control.
        *   `subscribeToSettingsButtonClicked.ts` - Sets up a stream for settings button clicks.
    *   ##### `src/core/controller/web` - Handlers for web-related utilities.
        *   `checkIsImageUrl.ts` - Checks if a given URL points to an image.
        *   `fetchOpenGraphData.ts` - Fetches Open Graph metadata for a URL to display a link preview.
        *   `openInBrowser.ts` - Opens a URL in the user's default browser.

*   #### `src/core/ignore`
    *   `ClineIgnoreController.ts` - Manages `.clineignore` files, similar to `.gitignore`, to prevent the LLM from accessing sensitive or irrelevant files.
    *   `ClineIgnoreController.test.ts` - Unit tests for the ignore controller.

*   #### `src/core/mentions`
    *   `index.ts` - Parses `@` mentions in user input to include context from files, URLs, the terminal, or Git changes.
    *   `index.test.ts` - Unit tests for mention parsing logic.

*   #### `src/core/prompts`
    *   `commands.ts` - Contains the specific system prompt instructions that are injected when a user invokes a slash command.
    *   `contextManagement.ts` - Prompts used for context summarization and task continuation after truncation.
    *   `loadMcpDocumentation.ts` - The detailed documentation prompt for creating MCP servers.
    *   `responses.ts` - A collection of pre-formatted string responses used for tool results, errors, and other system messages.
    *   ##### `src/core/prompts/system-prompt` - A modular and extensible architecture for constructing the main system prompt.
        *   `index.ts` - The main entry point for the system prompt builder, which selects a variant and assembles the final prompt.
        *   `README.md` - Detailed documentation explaining the system prompt architecture.
        *   `spec.ts` - TypeScript interfaces defining the specification for a tool prompt.
        *   `types.ts` - Core TypeScript type definitions used throughout the system prompt architecture.
        *   `utils.ts` - Utility functions for detecting model families (e.g., "claude-4", "gpt-5").
        *   ###### `src/core/prompts/system-prompt/components` - Reusable, self-contained sections of the system prompt.
            *   `index.ts` - Registers all available prompt components.
            *   `act_vs_plan_mode.ts` - The prompt section explaining the difference between Act and Plan modes.
            *   `agent_role.ts` - The section defining the agent's persona and role.
            *   `auto_todo.ts` - Instructions related to the automatic todo list (Focus Chain) feature.
            *   `capabilities.ts` - The section describing the agent's capabilities and tools.
            *   `editing_files.ts` - The section providing detailed guidelines for editing files.
            *   `feedback.ts` - Instructions on how the user can provide feedback.
            *   `mcp.ts` - The section that lists connected MCP servers and their capabilities.
            *   `objective.ts` - The section defining the agent's primary objective and iterative workflow.
            *   `rules.ts` - The section containing general rules and constraints the agent must follow.
            *   `system_info.ts` - The section that provides the agent with information about the user's system.
            *   `task_progress.ts` - Instructions for using the `task_progress` parameter to update the todo list.
            *   `user_instructions.ts` - The section where user-defined rules from `.clinerules` are injected.
            *   `tool_use/` - A sub-directory for components related to tool usage instructions.
                *   `index.ts` - Assembles the complete tool use section from its sub-components.
                *   `examples.ts` - Provides concrete examples of how to format tool calls.
                *   `formatting.ts` - Defines the XML-like syntax for tool calls.
                *   `guidelines.ts` - Provides high-level guidelines for using tools effectively.
                *   `tools.ts` - Dynamically generates the list of available tools and their descriptions.
        *   ###### `src/core/prompts/system-prompt/registry` - Manages the registration and retrieval of prompts and tools.
            *   `ClineToolSet.ts` - A class that manages the set of available tools for different model variants.
            *   `PromptBuilder.ts` - A class responsible for constructing the final system prompt by assembling components and resolving templates.
            *   `PromptRegistry.ts` - A singleton registry for loading, managing, and retrieving prompt variants.
        *   ###### `src/core/prompts/system-prompt/templates` - The template engine and placeholder definitions.
            *   `placeholders.ts` - Defines the standard set of placeholders (e.g., `{{CWD}}`) available in templates.
            *   `TemplateEngine.ts` - A simple template engine for resolving `{{placeholder}}` syntax.
        *   ###### `src/core/prompts/system-prompt/tools` - Contains the definitions for each available tool.
            *   `index.ts` - Exports all tool definitions for registration.
            *   `init.ts` - The central point where all tool variants are registered.
            *   `README.md` - Documentation for the tool registration system.
            *   `*.ts` - Individual files defining the specification (name, description, parameters) for each tool.
        *   ###### `src/core/prompts/system-prompt/variants` - Contains different versions (variants) of the system prompt tailored for specific model families.
            *   `index.ts` - Exports all available variant configurations.
            *   `config.template.ts` - A template file for creating new prompt variants.
            *   `variant-builder.ts` - A builder class that provides a fluent API for creating type-safe variant configurations.
            *   `variant-validator.ts` - A validator to ensure that prompt variant configurations are correct and complete.
            *   `generic/` - The configuration for the generic/fallback prompt variant.
            *   `gpt-5/` - The configuration for the prompt variant optimized for GPT-5 models.
            *   `next-gen/` - The configuration for the prompt variant optimized for next-generation models.
            *   `xs/` - A compact prompt variant designed for small or local models with limited context windows.
    *   ##### `src/core/prompts/system-prompt-legacy` - The previous, non-modular system prompt implementation.
        *   `generic-system-prompt.ts` - The old generic system prompt.
        *   `families/local-models/compact-system-prompt.ts` - The old compact system prompt for local models.
        *   `families/next-gen-models/gpt-5.ts` - The old system prompt for GPT-5.
        *   `families/next-gen-models/next-gen-system-prompt.ts` - The old system prompt for next-generation models.

*   #### `src/core/slash-commands`
    *   `index.ts` - Parses and handles built-in slash commands (e.g., `/newtask`, `/condense`) from user input.

*   #### `src/core/storage`
    *   `disk.ts` - Provides low-level functions for reading from and writing files to the extension's storage directory.
    *   `error-messages.ts` - Centralizes error messages related to storage operations.
    *   `state-keys.ts` - Defines TypeScript types for all keys used in global, workspace, and secret storage, ensuring type safety.
    *   `state-migrations.ts` - Contains logic for migrating user settings and data between different versions of the extension.
    *   `StateManager.ts` - A key service that manages all extension state, providing an in-memory cache for fast access and debounced persistence to disk.
    *   `utils/state-helpers.ts` - Helper functions for reading and resetting extension state.

*   #### `src/core/task`
    *   `index.ts` - The main `Task` class, which encapsulates the entire lifecycle of a single user request, from initial prompt to final completion.
    *   `message-state.ts` - A state handler specifically for managing the messages (both UI and API) associated with a task.
    *   `multifile-diff.ts` - Implements the logic for presenting a multi-file diff view of changes made during a task.
    *   `multifile-diff.test.ts` - Unit tests for the multi-file diff logic.
    *   `TaskState.ts` - A class that holds all the dynamic state for a running task (e.g., streaming status, tool execution flags).
    *   `ToolExecutor.ts` - The core class responsible for executing tools called by the assistant, handling approval flows, and processing results.
    *   `utils.ts` - General utility functions used within the task management system.
    *   ##### `src/core/task/focus-chain`
        *   `index.ts` - The `FocusChainManager` class, which implements the "Focus Chain" (todo list) feature.
        *   `file-utils.ts` - Utilities for creating, reading, and parsing the markdown files used for focus chain lists.
        *   `utils.ts` - Other utilities for parsing and analyzing focus chain lists.
    *   ##### `src/core/task/tools`
        *   `autoApprove.ts` - Contains the logic for auto-approving tool calls based on user settings.
        *   `ToolExecutorCoordinator.ts` - A coordinator class that routes tool execution requests to the appropriate registered handler.
        *   `ToolValidator.ts` - A lightweight validator for tool parameters and file access permissions.
        *   `handlers/` - Contains the individual, self-contained handler class for each tool.
            *   `AccessMcpResourceHandler.ts` - Handler for the `access_mcp_resource` tool.
            *   `AskFollowupQuestionToolHandler.ts` - Handler for the `ask_followup_question` tool.
            *   `AttemptCompletionHandler.ts` - Handler for the `attempt_completion` tool.
            *   `BrowserToolHandler.ts` - Handler for the `browser_action` tool.
            *   `CondenseHandler.ts` - Handler for the `condense` slash command tool.
            *   `ExecuteCommandToolHandler.ts` - Handler for the `execute_command` tool.
            *   `ListCodeDefinitionNamesToolHandler.ts` - Handler for the `list_code_definition_names` tool.
            *   `ListFilesToolHandler.ts` - Handler for the `list_files` tool.
            *   `LoadMcpDocumentationHandler.ts` - Handler for the `load_mcp_documentation` tool.
            *   `NewTaskHandler.ts` - Handler for the `new_task` tool.
            *   `PlanModeRespondHandler.ts` - Handler for the `plan_mode_respond` tool.
            *   `ReadFileToolHandler.ts` - Handler for the `read_file` tool.
            *   `ReportBugHandler.ts` - Handler for the `report_bug` tool.
            *   `SearchFilesToolHandler.ts` - Handler for the `search_files` tool.
            *   `SummarizeTaskHandler.ts` - Handler for the `summarize_task` tool.
            *   `UseMcpToolHandler.ts` - Handler for the `use_mcp_tool` tool.
            *   `WebFetchToolHandler.ts` - Handler for the `web_fetch` tool.
            *   `WriteToFileToolHandler.ts` - A shared handler for file writing tools (`write_to_file`, `replace_in_file`, `new_rule`).
        *   `types/` - Contains TypeScript type definitions for the tool execution system.
            *   `TaskConfig.ts` - Defines the structure of the configuration object passed to all tool handlers.
            *   `UIHelpers.ts` - Defines the structure of the UI helper functions available to tool handlers.
        *   `utils/` - Contains utility functions shared among tool handlers.
            *   `index.ts` - Exports all tool utilities.
            *   `ToolConstants.ts` - Defines shared constants for tool validation and configuration.
            *   `ToolDisplayUtils.ts` - Provides utilities for formatting tool information for display in the UI.
            *   `ToolResultUtils.ts` - Provides utilities for formatting tool results and handling user feedback.

*   #### `src/core/webview`
    *   `index.ts` - Exports the main `WebviewProvider` class.
    *   `getNonce.ts` - A utility function to generate a cryptographic nonce for the webview's Content Security Policy.
    *   `WebviewProvider.ts` - An abstract class that manages the lifecycle and HTML content of the webview panel.

### `src/dev`

Contains developer-specific tools, commands, and code quality patterns that are not part of the production build.

*   #### `src/dev/commands`
    *   `tasks.ts` - A development command to generate a large number of test tasks for UI and performance testing.
*   #### `src/dev/grit`
    *   `process-env.grit` - A GritQL pattern to find and flag incorrect usage of `process.env`.
    *   `use-cache-service.grit` - A GritQL pattern to enforce the use of the `StateManager` instead of direct state access.
    *   `vscode-api.grit` - A GritQL pattern to identify direct usage of VS Code APIs that should be abstracted through the `HostProvider`.

### `src/exports`

Defines the public API that the Cline extension exposes to other VS Code extensions.

*   `README.md` - Documentation explaining how other extensions can use the Cline API.
*   `cline.d.ts` - The TypeScript definition file for the public API, defining the available methods and types.
*   `index.ts` - The implementation of the public API, creating a bridge between external calls and the internal `Controller`.

### `src/generated`

Contains all auto-generated code, primarily from Protocol Buffer definitions. This code should not be manually edited.

*   #### `src/generated/grpc-js`
    Contains TypeScript definitions and service stubs generated by `protoc-gen-ts_proto` for use with `@grpc/grpc-js`.
    *   ##### `src/generated/grpc-js/cline` - Service definitions for the core application logic.
        *   `account.ts` - gRPC definitions for account management services.
        *   `browser.ts` - gRPC definitions for browser automation services.
        *   `checkpoints.ts` - gRPC definitions for checkpoint services.
        *   `commands.ts` - gRPC definitions for IDE command services.
        *   `common.ts` - gRPC definitions for common, shared message types.
        *   `file.ts` - gRPC definitions for file system and version control services.
        *   `mcp.ts` - gRPC definitions for Model Context Protocol (MCP) services.
        *   `models.ts` - gRPC definitions for LLM model management services.
        *   `slash.ts` - gRPC definitions for slash command services.
        *   `state.ts` - gRPC definitions for extension state management services.
        *   `task.ts` - gRPC definitions for task management services.
        *   `ui.ts` - gRPC definitions for UI interaction services.
        *   `web.ts` - gRPC definitions for web-related services.
        *   `index.cline.ts` - Barrel file re-exporting all `cline` gRPC modules.
    *   ##### `src/generated/grpc-js/host` - Service definitions for the host environment (e.g., VS Code, standalone).
        *   `diff.ts` - gRPC definitions for host diff view services.
        *   `env.ts` - gRPC definitions for host environment services (clipboard, machine ID).
        *   `testing.ts` - gRPC definitions for host testing services.
        *   `watch.ts` - gRPC definitions for host file watching services.
        *   `window.ts` - gRPC definitions for host window and editor management services.
        *   `workspace.ts` - gRPC definitions for host workspace services.
        *   `index.host.ts` - Barrel file re-exporting all `host` gRPC modules.
    *   `index.ts` - Main barrel file re-exporting all generated gRPC modules.

*   #### `src/generated/hosts`
    Contains generated code specific to different host environments, such as client interfaces and service configurations.
    *   `host-bridge-client-types.ts` - Generated TypeScript interfaces for the host bridge clients.
    *   ##### `src/generated/hosts/standalone`
        *   `host-bridge-clients.ts` - Generated host bridge client implementations for the standalone host.
        *   `protobus-server-setup.ts` - Generated server setup code that registers all ProtoBus services for the standalone host.
    *   ##### `src/generated/hosts/vscode`
        *   `hostbridge-grpc-service-config.ts` - Generated configuration mapping host services to their handlers for the VS Code host bridge.
        *   `protobus-service-types.ts` - Generated TypeScript types for ProtoBus service handlers.
        *   `protobus-services.ts` - Generated map of all ProtoBus service handlers.

*   #### `src/generated/nice-grpc`
    Contains TypeScript definitions and service stubs generated by `protoc-gen-ts_proto` for use with `nice-grpc`.
    *   ##### `src/generated/nice-grpc/cline` - Service definitions for the core application logic.
        *   `account.ts` - `nice-grpc` definitions for account management services.
        *   `browser.ts` - `nice-grpc` definitions for browser automation services.
        *   `checkpoints.ts` - `nice-grpc` definitions for checkpoint services.
        *   `commands.ts` - `nice-grpc` definitions for IDE command services.
        *   `common.ts` - `nice-grpc` definitions for common, shared message types.
        *   `file.ts` - `nice-grpc` definitions for file system and version control services.
        *   `mcp.ts` - `nice-grpc` definitions for Model Context Protocol (MCP) services.
        *   `models.ts` - `nice-grpc` definitions for LLM model management services.
        *   `slash.ts` - `nice-grpc` definitions for slash command services.
        *   `state.ts` - `nice-grpc` definitions for extension state management services.
        *   `task.ts` - `nice-grpc` definitions for task management services.
        *   `ui.ts` - `nice-grpc` definitions for UI interaction services.
        *   `web.ts` - `nice-grpc` definitions for web-related services.
        *   `index.cline.ts` - Barrel file re-exporting all `cline` `nice-grpc` modules.
    *   ##### `src/generated/nice-grpc/host` - Service definitions for the host environment.
        *   `diff.ts` - `nice-grpc` definitions for host diff view services.
        *   `env.ts` - `nice-grpc` definitions for host environment services.
        *   `testing.ts` - `nice-grpc` definitions for host testing services.
        *   `watch.ts` - `nice-grpc` definitions for host file watching services.
        *   `window.ts` - `nice-grpc` definitions for host window and editor management services.
        *   `workspace.ts` - `nice-grpc` definitions for host workspace services.
        *   `index.host.ts` - Barrel file re-exporting all `host` `nice-grpc` modules.
    *   `index.ts` - Main barrel file re-exporting all generated `nice-grpc` modules.

### `src/hosts`

Contains code that abstracts the differences between host environments (e.g., VS Code extension vs. standalone application).

*   `host-provider-types.ts` - Defines the core TypeScript interfaces for the host abstraction layer.
*   `host-provider.ts` - A singleton that provides access to the correct host-specific implementations at runtime.
*   #### `src/hosts/external` - Code specific to the standalone (external) host environment.
    *   `AuthHandler.ts` - Manages OAuth authentication flow via a local HTTP server for standalone mode.
    *   `ExternalDiffviewProvider.ts` - Implementation of `DiffViewProvider` for standalone mode, using the host bridge.
    *   `ExternalWebviewProvider.ts` - Implementation of `WebviewProvider` for standalone mode.
    *   `grpc-types.ts` - Defines common types and base classes for gRPC communication in standalone mode.
    *   `host-bridge-client-manager.ts` - Manages and provides gRPC clients for communicating with the host bridge in standalone mode.
*   #### `src/hosts/vscode` - Code specific to the VS Code extension host environment.
    *   `commandUtils.ts` - Utility functions for handling commands triggered from the VS Code UI (e.g., context menus).
    *   `DecorationController.ts` - Manages VS Code text editor decorations for highlighting streaming code changes.
    *   `VscodeDiffViewProvider.ts` - The VS Code-specific implementation of the `DiffViewProvider`, using native VS Code APIs.
    *   `VscodeWebviewProvider.ts` - The VS Code-specific implementation of the `WebviewProvider`, managing the webview panel.
    *   `vscode.d.ts` - A TypeScript declaration file that marks direct usage of certain VS Code APIs as deprecated to enforce abstraction.
    *   ##### `src/hosts/vscode/hostbridge` - The gRPC server implementation that runs within the VS Code extension host, allowing the core logic (potentially in a separate process) to interact with the VS Code API.
        *   `hostbridge-grpc-handler.ts` - Handles the routing and execution of incoming gRPC requests for the VS Code host.
        *   `hostbridge-grpc-service.ts` - A generic service registry for defining and organizing gRPC service handlers in VS Code.
        *   `client/` - Contains the client-side code for the webview to communicate with the host bridge.
            *   `host-grpc-client-base.ts` - A generic base class for creating gRPC clients that communicate with the host bridge.
            *   `host-grpc-client.ts` - Creates and exports the specific gRPC clients for each host service.
        *   `diff/` - Handlers for the `DiffService`.
            *   `openMultiFileDiff.ts` - Handler for opening a multi-file diff view.
            *   `*.ts` - Other handlers that are not implemented as they are handled by the native `VscodeDiffViewProvider`.
        *   `env/` - Handlers for the `EnvService`.
            *   `clipboardReadText.ts` - Handler for reading from the system clipboard.
            *   `clipboardWriteText.ts` - Handler for writing to the system clipboard.
            *   `getHostVersion.ts` - Handler for getting the host (VS Code) version.
            *   `getMachineId.ts` - Handler for getting a unique machine ID for telemetry.
        *   `testing/` - Handlers for the `TestingService`.
            *   `getWebviewHtml.ts` - A testing-only handler to retrieve the webview's HTML content.
        *   `watch/` - Handlers for the `WatchService`.
            *   `subscribeToFile.ts` - Handler for subscribing to file changes using `chokidar`.
        *   `window/` - Handlers for the `WindowService`.
            *   `getActiveEditor.ts` - Handler to get the currently active text editor.
            *   `getOpenTabs.ts` - Handler to get all open editor tabs.
            *   `getOpenTabs.test.ts` - Unit tests for the `getOpenTabs` handler.
            *   `getVisibleTabs.ts` - Handler to get all visible editor tabs.
            *   `getVisibleTabs.test.ts` - Unit tests for the `getVisibleTabs` handler.
            *   `openFile.ts` - Handler to open a file in the editor.
            *   `openSettings.ts` - Handler to open the VS Code settings UI.
            *   `showInputBox.ts` - Handler to show a VS Code input box.
            *   `showMessage.ts` - Handler to show a VS Code notification message.
            *   `showOpenDialogue.ts` - Handler to show the native file open dialog.
            *   `showSaveDialog.ts` - Handler to show the native file save dialog.
            *   `showTextDocument.ts` - Handler to show a specific text document in an editor.
        *   `workspace/` - Handlers for the `WorkspaceService`.
            *   `getDiagnostics.ts` - Handler for getting all workspace diagnostics (problems).
            *   `getDiagnostics.test.ts` - Unit tests for the `getDiagnostics` handler.
            *   `getWorkspacePaths.ts` - Handler for getting the paths of open workspace folders.
            *   `openClineSidebarPanel.ts` - Handler to focus the Cline sidebar view.
            *   `openInFileExplorerPanel.ts` - Handler to reveal a file in the VS Code file explorer.
            *   `openProblemsPanel.ts` - Handler to open the VS Code Problems panel.
            *   `saveOpenDocumentIfDirty.ts` - Handler to save a document if it has unsaved changes.
            *   `saveOpenDocumentIfDirty.test.ts` - Unit tests for the `saveOpenDocumentIfDirty` handler.
            *   `searchWorkspaceItems.ts` - Handler for searching files and folders in the workspace.

### `src/integrations`

Contains modules that integrate with external tools or provide specific, isolated functionalities.

*   #### `src/integrations/checkpoints`
    *   `CheckpointExclusions.ts` - Manages file exclusion rules for the checkpoint system, respecting `.gitignore` and LFS.
    *   `CheckpointGitOperations.ts` - Handles all direct Git commands for the shadow checkpoint repository.
    *   `CheckpointMigration.ts` - Contains logic for migrating legacy checkpoint data to a new format.
    *   `CheckpointTracker.ts` - The core implementation of the checkpoint system using a shadow Git repository.
    *   `CheckpointUtils.ts` - Utility functions for the checkpoint system, such as path hashing and validation.
*   #### `src/integrations/claude-code`
    *   `message-filter.ts` - Filters messages to remove content unsupported by the `claude-code` binary (e.g., images).
    *   `run.ts` - Contains the logic for executing the local `claude-code` binary and streaming its output.
    *   `run.test.ts` - Unit tests for the `claude-code` binary runner.
    *   `types.ts` - Defines TypeScript types for the JSON messages produced by the `claude-code` binary.
*   #### `src/integrations/diagnostics`
    *   `index.ts` - Provides utilities for processing and formatting VS Code diagnostics (problems) into a human-readable string for the LLM.
*   #### `src/integrations/dify`
    *   `dify-integration.ts` - Provides helper functions for integrating with Dify's specific API features beyond the standard chat completion.
*   #### `src/integrations/editor`
    *   `detect-omission.ts` - Contains logic to detect and warn about potential code omission by the AI, which can happen with large files.
    *   `DiffViewProvider.ts` - An abstract base class for providing a diff view, with concrete implementations for VS Code and standalone hosts.
*   #### `src/integrations/git`
    *   `commit-message-generator.ts` - Contains the logic for generating Git commit messages based on the staged changes.
*   #### `src/integrations/misc`
    *   `export-markdown.ts` - Provides functionality to export a task's conversation history to a markdown file.
    *   `extract-file-content.ts` - A utility that extracts text or image content from various file types.
    *   `extract-images.ts` - Logic for extracting and formatting image content into a base64 format for model consumption.
    *   `extract-text.ts` - Logic for extracting text content from various document types (PDF, DOCX, etc.).
    *   `link-preview.ts` - Fetches Open Graph data from URLs to generate link previews in the chat UI.
    *   `open-file.ts` - Contains utility functions for opening files and images from the chat UI.
    *   `process-files.ts` - Handles the file selection dialog and processes selected files for inclusion in the chat.
*   #### `src/integrations/notifications`
    *   `index.ts` - Provides a cross-platform way to show system notifications.
*   #### `src/integrations/terminal`
    *   `ansiUtils.ts` - Utilities for stripping ANSI escape codes from terminal output.
    *   `get-latest-output.ts` - Logic to get the latest output from the active VS Code terminal by selecting all and copying.
    *   `TerminalManager.ts` - Manages the lifecycle of integrated terminals, including creation, reuse, and command execution.
    *   `TerminalProcess.ts` - Represents and manages a single command execution process within a terminal, handling output streaming.
    *   `TerminalProcess.test.ts` - Unit tests for the `TerminalProcess` class.
    *   `TerminalRegistry.ts` - A registry to track and manage all active terminal instances used by the extension.

### `src/packages`

A directory for re-exporting or wrapping third-party libraries to ensure consistent usage across the codebase.

*   `execa.ts` - Re-exports the `execa` library for running external commands.

### `src/services`

Contains singleton services that provide core functionalities like authentication, telemetry, and error reporting.

*   #### `src/services/account`
    *   `ClineAccountService.ts` - A service for interacting with the Cline backend API for account and billing information.
*   #### `src/services/auth`
    *   `AuthService.ts` - Manages user authentication state, sign-in/out flows, and token management.
    *   `AuthServiceMock.ts` - A mock implementation of the `AuthService` for local development and testing against a mock server.
    *   `providers/`
        *   `FirebaseAuthProvider.ts` - Implements the authentication flow using Firebase Authentication.
*   #### `src/services/browser`
    *   `BrowserDiscovery.ts` - Utilities for discovering running Chrome instances that have remote debugging enabled.
    *   `BrowserSession.ts` - Manages a Puppeteer browser session for executing web automation tools.
    *   `UrlContentFetcher.ts` - A service that uses a headless browser to fetch and parse web page content into markdown.
*   #### `src/services/error`
    *   `ClineError.ts` - A custom error class that standardizes error information from various sources.
    *   `ErrorProviderFactory.ts` - A factory for creating different error reporting providers (e.g., PostHog, Sentry).
    *   `ErrorService.ts` - The main service for logging and reporting errors to an external service.
    *   `index.ts` - Exports the error service and related types.
    *   `providers/`
        *   `IErrorProvider.ts` - The interface that all error reporting providers must implement.
        *   `PostHogErrorProvider.ts` - An implementation of `IErrorProvider` that reports errors to PostHog.
*   #### `src/services/feature-flags`
    *   `FeatureFlagsProviderFactory.ts` - A factory for creating different feature flag providers.
    *   `FeatureFlagsService.ts` - The main service for managing and checking feature flags.
    *   `index.ts` - Exports the feature flag service and related types.
    *   `providers/`
        *   `IFeatureFlagsProvider.ts` - The interface that all feature flag providers must implement.
        *   `PostHogFeatureFlagsProvider.ts` - An implementation of `IFeatureFlagsProvider` that uses PostHog.
*   #### `src/services/glob`
    *   `list-files.ts` - A utility for listing files in a directory, respecting `.gitignore` and providing an efficient breadth-first traversal.
*   #### `src/services/logging`
    *   `distinctId.ts` - Manages the creation and retrieval of unique identifiers for telemetry and logging.
    *   `Logger.ts` - A simple logging utility that outputs messages to the VS Code "Cline Dev Logger" channel.
*   #### `src/services/mcp`
    *   `constants.ts` - Defines constants used throughout the Model Context Protocol (MCP) system.
    *   `McpHub.ts` - The central hub for managing connections to and communication with all registered MCP servers.
    *   `schemas.ts` - Contains Zod schemas for validating MCP server configuration files.
    *   `types.ts` - Defines core TypeScript types used in the MCP system.
*   #### `src/services/posthog`
    *   `PostHogClientProvider.ts` - A provider that manages the singleton instance of the PostHog client.
*   #### `src/services/ripgrep`
    *   `index.ts` - A service for performing fast, regex-based file searches using the Ripgrep binary bundled with VS Code.
*   #### `src/services/search`
    *   `file-search.ts` - A service for searching workspace files, using Ripgrep for speed and FZF for fuzzy matching and ranking.
*   #### `src/services/telemetry`
    *   `TelemetryProviderFactory.ts` - A factory for creating different telemetry providers.
    *   `TelemetryService.ts` - The main service for capturing and sending telemetry events.
    *   `index.ts` - Exports the telemetry service and related types.
    *   `providers/`
        *   `ITelemetryProvider.ts` - The interface that all telemetry providers must implement.
        *   `PostHogTelemetryProvider.ts` - An implementation of `ITelemetryProvider` that sends events to PostHog.
*   #### `src/services/test`
    *   `GitHelper.ts` - Provides helper functions for Git operations specifically for testing and evaluation scenarios.
    *   `TestMode.ts` - Manages the state and setup for the extension's special test/evaluation mode.
    *   `TestServer.ts` - An HTTP server used to orchestrate automated tests and evaluations of the extension.
*   #### `src/services/tree-sitter`
    *   `index.ts` - A service that uses Tree-sitter to parse source code and extract definitions for context.
    *   `languageParser.ts` - Handles loading and managing Tree-sitter language parsers from WASM files.
    *   `queries/` - Contains the Tree-sitter queries used to extract definitions for each supported language.
        *   `*.ts` - Individual files containing the query for a specific language.
        *   `index.ts` - Barrel file re-exporting all language queries.
*   #### `src/services/uri`
    *   `SharedUriHandler.ts` - A unified handler for processing URIs from both VS Code events (e.g., OAuth callbacks) and local HTTP server callbacks in standalone mode.

### `src/shared`

Contains TypeScript types, utilities, and generated code that are shared between the extension's backend (Node.js) and the webview's frontend (React). This ensures type safety and consistency across the two environments.

*   `api.ts` - Defines API providers, handler options, and detailed model information (pricing, context windows) for all supported LLMs.
*   `array.ts` - Utility functions for arrays, like `findLastIndex`, `findLast`, and parsing partial array strings.
*   `array.test.ts` - Unit tests for array utility functions.
*   `AutoApprovalSettings.ts` - Defines the structure and defaults for auto-approval settings for agent actions.
*   `BrowserSettings.ts` - Defines the structure and defaults for browser automation settings.
*   `ChatContent.ts` - Defines the structure for chat content, including messages, images, and files.
*   `cline-rules.ts` - Defines the type for toggling user-defined `.clinerules`.
*   `ClineAccount.ts` - Defines TypeScript interfaces for Cline backend API responses related to user accounts, organizations, and billing.
*   `combineApiRequests.ts` - Utility to combine `api_req_started` and `api_req_finished` messages into a single message for UI display.
*   `combineCommandSequences.ts` - Utility to combine `command` and `command_output` messages into a single message for UI display.
*   `context-mentions.ts` - Defines the regular expression for parsing `@` mentions in user input.
*   `ExtensionMessage.ts` - Defines core data structures shared between the extension host and the webview UI, including the main `ExtensionState` and `ClineMessage` types.
*   `focus-chain-utils.ts` - Shared utility functions for parsing and identifying "Focus Chain" (todo list) items in markdown.
*   `FocusChainSettings.ts` - Defines the structure and defaults for the "Focus Chain" feature settings.
*   `getApiMetrics.ts` - Utility to calculate total token usage and cost from a series of API request messages.
*   `HistoryItem.ts` - Defines the TypeScript interface for a single task in the history.
*   `Languages.ts` - Defines supported languages for the UI and system prompts, with utilities for mapping between language keys and display names.
*   `mcp.ts` - Defines core types, constants, and interfaces for the Model Context Protocol (MCP).
*   `McpDisplayMode.ts` - Defines the display modes for MCP responses in the UI.
*   `prompts.ts` - Defines an enum for different LLM families to select appropriate system prompt variants.
*   `TelemetrySetting.ts` - Defines the type for the user's telemetry preference.
*   `tools.ts` - Defines an enum for the default tool IDs available to the agent.
*   `UserInfo.ts` - Defines the structure for user information.
*   `vsCodeSelectorUtils.ts` - Utility function for stringifying VS Code's `LanguageModelChatSelector`.
*   `WebviewMessage.ts` - Defines the structure of messages sent from the webview to the extension host, primarily for gRPC requests.

*   #### `src/shared/proto`
    Contains all auto-generated TypeScript files from the `.proto` definitions, used for gRPC communication between the webview and the extension host.
    *   ##### `src/shared/proto/cline` - gRPC definitions for the core application logic.
        *   `account.ts` - gRPC definitions for account management.
        *   `browser.ts` - gRPC definitions for browser automation.
        *   `checkpoints.ts` - gRPC definitions for task checkpoints.
        *   `commands.ts` - gRPC definitions for IDE commands.
        *   `common.ts` - gRPC definitions for shared message types.
        *   `file.ts` - gRPC definitions for file system operations.
        *   `mcp.ts` - gRPC definitions for MCP.
        *   `models.ts` - gRPC definitions for model management.
        *   `slash.ts` - gRPC definitions for slash commands.
        *   `state.ts` - gRPC definitions for state management.
        *   `task.ts` - gRPC definitions for task management.
        *   `ui.ts` - gRPC definitions for UI interactions.
        *   `web.ts` - gRPC definitions for web utilities.
        *   `index.cline.ts` - Barrel file re-exporting all `cline` gRPC modules.
    *   ##### `src/shared/proto/host` - gRPC definitions for the host environment abstraction.
        *   `diff.ts` - gRPC definitions for diff views.
        *   `env.ts` - gRPC definitions for environment access (clipboard, machine ID).
        *   `testing.ts` - gRPC definitions for testing.
        *   `watch.ts` - gRPC definitions for file watching.
        *   `window.ts` - gRPC definitions for window management.
        *   `workspace.ts` - gRPC definitions for workspace operations.
        *   `index.host.ts` - Barrel file re-exporting all `host` gRPC modules.
    *   `index.ts` - Main barrel file re-exporting all generated gRPC modules.

*   #### `src/shared/proto-conversions`
    Contains functions to convert between application-specific types (used in the core logic) and the generated protobuf types.
    *   `cline-message.ts` - Converts between application `ClineMessage` and its protobuf equivalent.
    *   ##### `src/shared/proto-conversions/file`
        *   `git-commit-conversion.ts` - Converts Git commit types.
        *   `rule-files-conversion.ts` - Helpers for creating rule file request protos.
        *   `search-result-conversion.ts` - Converts file search result types.
    *   ##### `src/shared/proto-conversions/mcp`
        *   `mcp-server-conversion.ts` - Converts MCP server types.
    *   ##### `src/shared/proto-conversions/models`
        *   `api-configuration-conversion.ts` - Converts the main `ApiConfiguration` type.
        *   `auto-approval-settings-conversion.ts` - Converts auto-approval settings types.
        *   `vscode-lm-models-conversion.ts` - Converts VS Code Language Model selector types.
    *   ##### `src/shared/proto-conversions/state`
        *   `settings-conversion.ts` - Converts various settings types.
        *   `telemetry-setting-conversion.ts` - Converts the telemetry setting type.
    *   ##### `src/shared/proto-conversions/web`
        *   `open-graph-conversion.ts` - Converts Open Graph data types.

*   #### `src/shared/services`
    Contains shared service configurations and definitions.
    *   ##### `src/shared/services/config`
        *   `posthog-config.ts` - Configuration for the PostHog analytics and error tracking service.
    *   ##### `src/shared/services/feature-flags`
        *   `feature-flags.ts` - Defines an enum for feature flags used in the application.

*   #### `src/shared/storage`
    *   `types.ts` - Defines simple shared types like `Mode` (`plan`|`act`) and `OpenaiReasoningEffort`.

*   #### `src/shared/webview`
    *   `types.ts` - Defines types related to the webview environment, like the provider type (sidebar or tab).

### `src/standalone`

Contains the code for running the extension's core logic as a standalone Node.js application, separate from the VS Code host.

*   `cline-core.ts` - The main entry point for the standalone `cline-core` service.
*   `protobus-service.ts` - Sets up and runs the main gRPC server (ProtoBus) that exposes the extension's core functionality.
*   `utils.ts` - General utility functions for the standalone service, such as logging and package definition loading.
*   `vscode-context-utils.ts` - Mock implementations of various VS Code context utilities (like `Memento` and `SecretStorage`) for the standalone environment.
*   `vscode-context.ts` - A mock implementation of the VS Code `ExtensionContext` API, allowing the core logic to run outside of VS Code.

### `src/utils`

Contains general-purpose utility functions used throughout the codebase.

*   `announcements.ts` - A utility for managing extension version announcements.
*   `cost.ts` - Utilities for calculating the estimated cost of LLM API calls based on token counts and pricing information.
*   `cost.test.ts` - Unit tests for the API cost calculation utilities.
*   `env.ts` - Cross-platform utilities for interacting with the environment, such as clipboard access and opening external URLs.
*   `fs.ts` - Cross-platform file system utilities that build upon Node's `fs` module.
*   `fs.test.ts` - Unit tests for the file system utilities.
*   `git.ts` - Utilities for interacting with Git repositories, such as searching commits and getting diffs.
*   `github-url-utils.ts` - Utilities for creating and opening GitHub issue URLs, specifically designed to bypass VS Code's URI encoding issues.
*   `model-utils.ts` - Contains utility functions related to specific model capabilities, such as image support.
*   `path.ts` - Cross-platform path handling utilities, including a custom `toPosix()` method and a case-insensitive path comparison function.
*   `path.test.ts` - Unit tests for the path utilities.
*   `shell.ts` - Utilities for detecting the user's default shell and managing shell profiles.
*   `storage.ts` - Utilities for managing the extension's storage on disk, such as calculating directory sizes.
*   `string.ts` - General string manipulation utilities.
*   `string.test.ts` - Unit tests for the string utilities.
*   `time.ts` - Simple time conversion utilities.

## `proto`

Contains all the Protocol Buffer (`.proto`) definitions for the gRPC services that facilitate communication between different parts of the extension (e.g., webview UI and extension host).

*   #### `proto/cline`
    Contains service definitions for the core application logic.
    *   `account.proto` - gRPC service definitions for account management.
    *   `browser.proto` - gRPC service definitions for browser automation.
    *   `checkpoints.proto` - gRPC service definitions for task checkpoints.
    *   `commands.proto` - gRPC service definitions for IDE commands (context menus, etc.).
    *   `common.proto` - gRPC definitions for common, shared message types.
    *   `file.proto` - gRPC service definitions for file system operations.
    *   `mcp.proto` - gRPC service definitions for Model Context Protocol (MCP).
    *   `models.proto` - gRPC service definitions for LLM model management.
    *   `slash.proto` - gRPC service definitions for slash commands.
    *   `state.proto` - gRPC service definitions for extension state management.
    *   `task.proto` - gRPC service definitions for task management.
    *   `ui.proto` - gRPC service definitions for UI interactions.
    *   `web.proto` - gRPC service definitions for web-related utilities.
*   #### `proto/host`
    Contains service definitions for abstracting the host environment (e.g., VS Code).
    *   `diff.proto` - gRPC service definitions for host diff view services.
    *   `env.proto` - gRPC service definitions for host environment services (clipboard, machine ID).
    *   `testing.proto` - gRPC service definitions for host testing services.
    *   `watch.proto` - gRPC service definitions for host file watching services.
    *   `window.proto` - gRPC service definitions for host window and editor management services.
    *   `workspace.proto` - gRPC service definitions for host workspace services.

### `webview-ui`

The source code for the React-based webview UI, built with Vite and TypeScript.

*   `webview-ui/.gitignore` - Ignores build artifacts and environment files for the webview.
*   `webview-ui/.vite-port` - Stores the port number for the Vite development server.
*   `webview-ui/index.html` - The main HTML entry point for the webview application.
*   `webview-ui/package.json` - Defines dependencies and scripts for the webview UI.
*   `webview-ui/tailwind.config.mjs` - Tailwind CSS configuration file.
*   `webview-ui/tsconfig.app.json` - TypeScript configuration for the application source code.
*   `webview-ui/tsconfig.json` - Root TypeScript configuration for the webview project.
*   `webview-ui/tsconfig.node.json` - TypeScript configuration for Node.js-specific files like Vite config.
*   `webview-ui/vite.config.ts` - Vite build and development server configuration.

*   #### `webview-ui/src`
    The main source code directory for the webview UI.
    *   `App.tsx` - The root React component that manages views (Chat, Settings, History, etc.).
    *   `CustomPostHogProvider.tsx` - A custom provider for initializing and configuring PostHog analytics and feature flags.
    *   `Providers.tsx` - A component that wraps the application with all necessary context providers.
    *   `index.css` - Global CSS styles, including Tailwind CSS imports and custom scrollbar styling.
    *   `main.tsx` - The main entry point for the React application, where the root component is rendered.
    *   `setupTests.ts` - Setup file for Vitest, mocking global APIs for testing.
    *   `vite-env.d.ts` - TypeScript declarations for Vite environment variables.
    *   ##### `webview-ui/src/assets` - Contains static assets, primarily SVG logos as React components.
        *   `ClineLogoBlack.tsx` - Black version of the Cline logo.
        *   `ClineLogoVariable.tsx` - Cline logo that adapts its color to the VS Code theme.
        *   `ClineLogoWhite.tsx` - White version of the Cline logo.
    *   ##### `webview-ui/src/components` - The directory for all React components.
        *   ###### `webview-ui/src/components/account` - Components for the user account view.
            *   `AccountOptions.tsx` - A component that triggers the login flow automatically.
            *   `AccountView.tsx` - The main view for user account management.
            *   `AccountWelcomeView.tsx` - The view shown to unauthenticated users.
            *   `CreditBalance.tsx` - Component for displaying the user's current credit balance.
            *   `CreditsHistoryTable.tsx` - A data grid for showing usage and payment history.
            *   `helpers.ts` - Helper functions for the account view.
            *   `StyledCreditDisplay.tsx` - A component that animates and styles the credit balance display.
        *   ###### `webview-ui/src/components/browser` - Components related to browser automation.
            *   `BrowserSettingsMenu.tsx` - A menu for browser automation settings and connection status.
        *   ###### `webview-ui/src/components/chat` - Components that make up the core chat interface.
            *   `Announcement.tsx` - A component to display new feature announcements.
            *   `BrowserSessionRow.tsx` - A specialized chat row for displaying browser automation sessions.
            *   `ChatErrorBoundary.tsx` - An error boundary to catch and display rendering errors in the chat UI.
            *   `ChatRow.tsx` - The core component for rendering a single message or group of messages.
            *   `ChatTextArea.tsx` - The main text input area for the chat.
            *   `ChatView.tsx` - The main component that orchestrates the entire chat interface.
            *   `colors.ts` - Color constants used for the task timeline.
            *   `ContextMenu.tsx` - The UI for the `@` mention context menu.
            *   `CreditLimitError.tsx` - A component to display a credit limit error message.
            *   `ErrorBlockTitle.tsx` - A component for rendering the title of an error block in the chat.
            *   `ErrorRow.tsx` - A component for rendering various types of error messages.
            *   `NewTaskPreview.tsx` - A component to preview the context of a new task.
            *   `OptionsButtons.tsx` - Renders selectable option buttons for assistant questions.
            *   `QuoteButton.tsx` - A button that appears on text selection to quote a message.
            *   `QuotedMessagePreview.tsx` - A preview of a quoted message above the text input.
            *   `ReportBugPreview.tsx` - A component to preview a bug report before submission.
            *   `ServersToggleModal.tsx` - A modal for quickly toggling MCP servers.
            *   `SlashCommandMenu.tsx` - The UI for the `/` slash command menu.
            *   `TaskFeedbackButtons.tsx` - Thumbs up/down buttons for providing feedback.
            *   `UserMessage.tsx` - Renders user-submitted messages, with editing capabilities.
            *   `auto-approve-menu/` - Components for the auto-approval feature.
            *   `chat-view/` - A refactored, modular structure for the main chat view.
            *   `task-header/` - Components for the header of an active task.
        *   ###### `webview-ui/src/components/cline-rules` - Components for managing Cline rules.
            *   `ClineRulesToggleModal.tsx` - A modal for toggling Cline rules and workflows.
            *   `NewRuleRow.tsx` - A component for creating a new rule file.
            *   `RuleRow.tsx` - A component representing a single rule with controls.
            *   `RulesToggleList.tsx` - A list of rule rows.
        *   ###### `webview-ui/src/components/common` - Reusable components shared across the UI.
            *   `AlertDialog.tsx` - A generic alert dialog component.
            *   `ChecklistRenderer.tsx` - Renders markdown checklists for the Focus Chain feature.
            *   `CheckmarkControl.tsx` - A UI control for interacting with a task checkpoint.
            *   `CheckpointControls.tsx` - A set of buttons for interacting with checkpoints.
            *   `CodeAccordian.tsx` - A collapsible code block component.
            *   `codeblock-parser.css` - CSS for syntax highlighting.
            *   `CodeBlock.tsx` - The core component for rendering syntax-highlighted code.
            *   `CopyButton.tsx` - A reusable copy-to-clipboard button.
            *   `DangerButton.tsx` - A styled button for dangerous actions.
            *   `Demo.tsx` - A demo component showcasing UI toolkit elements.
            *   `HeroTooltip.tsx` - A styled tooltip component.
            *   `MarkdownBlock.tsx` - A component for rendering markdown content.
            *   `MermaidBlock.tsx` - A component for rendering Mermaid diagrams.
            *   `SettingsButton.tsx` - A styled button for use in the settings view.
            *   `SuccessButton.tsx` - A styled button for success actions.
            *   `Tab.tsx` - Reusable components for creating tabbed interfaces.
            *   `TelemetryBanner.tsx` - A banner to ask for telemetry consent.
            *   `Thumbnails.tsx` - Displays image and file thumbnails.
            *   `Tooltip.tsx` - A simple tooltip component.
            *   `VSCodeButtonLink.tsx` - A component that styles a link like a VS Code button.
        *   ###### `webview-ui/src/components/history` - Components for the task history view.
            *   `HistoryPreview.tsx` - A preview of recent tasks on the welcome screen.
            *   `HistoryView.tsx` - The full view for browsing and managing task history.
        *   ###### `webview-ui/src/components/mcp` - Components for the Model Context Protocol (MCP).
            *   `chat-display/` - Components for displaying MCP responses in the chat.
            *   `configuration/` - Components for configuring MCP servers.
            *   `RICH_MCP_TESTING.md` - Test cases for rich MCP responses.
        *   ###### `webview-ui/src/components/menu` - Components for navigation.
            *   `Navbar.tsx` - The main navigation bar for the standalone webview.
        *   ###### `webview-ui/src/components/settings` - Components for the settings view.
            *   `ApiOptions.tsx` - The main component for selecting and configuring API providers.
            *   `README.md` - Documentation for the settings component architecture.
            *   `common/` - Reusable components specific to the settings view.
            *   `providers/` - Individual components for each API provider.
            *   `sections/` - Individual components for each section in the settings view.
            *   `utils/` - Utility functions and hooks for the settings view.
        *   ###### `webview-ui/src/components/ui` - General UI-related hooks and components.
            *   `hooks/useOpenRouterKeyInfo.ts` - A hook to fetch information about an OpenRouter API key.
        *   ###### `webview-ui/src/components/welcome` - Components for the welcome screen.
            *   `HomeHeader.tsx` - The header displayed on the welcome screen.
            *   `QuickWinCard.tsx` - A card for a "quick win" suggested task.
            *   `quickWinTasks.ts` - A list of predefined "quick win" tasks.
            *   `SuggestedTasks.tsx` - A component that displays suggested tasks.
            *   `WelcomeView.tsx` - The main welcome screen for new users.
    *   ##### `webview-ui/src/constants.ts` - Global constants for the webview UI.
    *   ##### `webview-ui/src/context` - React context providers.
        *   `ClineAuthContext.tsx` - Manages user authentication state.
        *   `ExtensionStateContext.tsx` - Manages the overall extension state from the host.
    *   ##### `webview-ui/src/hooks` - Global custom React hooks.
        *   `useAutoApproveActions.ts` - Manages auto-approval logic.
        *   `useFeatureFlag.ts` - Checks PostHog feature flags.
    *   ##### `webview-ui/src/services` - Services for communication and external APIs.
        *   `grpc-client-base.ts` - The base class for gRPC clients.
        *   `grpc-client.ts` - Auto-generated gRPC client services.
    *   ##### `webview-ui/src/utils` - General utility functions.
        *   `context-mentions.ts` - Utilities for parsing and handling `@` mentions.
        *   `format.ts` - General formatting utilities.
        *   `getLanguageFromPath.ts` - Maps file extensions to language identifiers.
        *   `hooks.ts` - General-purpose React hooks.
        *   `mcp.ts` - Utilities for handling MCP-related data.
        *   `platformUtils.ts` - Utilities for detecting the user's platform.
        *   `slash-commands.ts` - Utilities for parsing and handling `/` slash commands.
        *   `useDebounceEffect.ts` - A hook for debouncing effects.
        *   `validate.ts` - Validation functions for API configuration.
        *   `vscode.ts` - A wrapper around the `acquireVsCodeApi`.
        *   `vscStyles.ts` - Constants and utilities for using VS Code theme colors.