This is a comprehensive and strategic plan to integrate Morph Fast Apply into the existing codebase. The plan is designed to minimize modifications to existing code, reduce potential conflicts, and ensure maintainability by leveraging the established architecture detailed in `INDEX.md` and adhering to the guidelines in `MORPH_APPLY_INTEGRATION.md`.

### Integration Strategy Overview

The integration is structured into four main phases:

1.  **Configuration and Service Implementation:** Setting up secure configuration storage and creating an isolated service for the Morph API.
2.  **Tool Definition:** Defining the `edit_file` tool specification within the prompt system.
3.  **Tool Implementation (Handler):** Implementing the backend execution logic for the tool.
4.  **Prompt Engineering and Optimization:** Updating system prompts to prioritize `edit_file` and implementing the recommended XML tool invocation format.

-----

### Phase 1: Configuration and Morph API Service

This phase focuses on setting up the infrastructure for the Morph API communication.

#### 1.1 Configuration Management

We must enable secure storage for the Morph API key and configuration for the endpoint.

  * **File to Edit:** `src/core/storage/state-keys.ts`
  * **Action:**
      * Define `MORPH_API_KEY` within the `SecretStorageState` definitions. This ensures the key is securely managed by the `StateManager`.
      * Define `MORPH_API_URL` within the `GlobalStateKey` definitions.
  * **File to Edit:** `src/config.ts` (or similar configuration file)
  * **Action:** Define the default values:
      * `MORPH_API_URL`: `https://api.morphllm.com/v1`
      * Default Model: `morph-v3-large`

#### 1.2 Morph Apply Service Implementation

To isolate the external dependency, we will create a dedicated service.

  * **New Directory:** `src/services/morph`
  * **New File:** `src/services/morph/MorphApplyService.ts`
  * **Purpose:** To encapsulate all interactions with the Morph API.
  * **Dependencies:** `src/core/storage/StateManager.ts` (for configuration retrieval).
  * **Key Method:** `applyEdit(initialCode: string, instructions: string, codeEdit: string): Promise<string>`
      * Retrieves the API key and URL.
      * Constructs the specific XML payload required by the Morph API:
    <!-- end list -->
    ```xml
    <instruction>{instructions}</instruction>
    <code>{initialCode}</code>
    <update>{codeEdit}</update>
    ```
      * Executes the API request (using an OpenAI-compatible SDK or HTTP client).
      * Implements robust error handling (e.g., using `src/services/error/ClineError.ts`).

#### 1.3 Settings UI (Webview)

The user interface must allow configuration of the Morph settings.

  * **Strategy:** Create a dedicated settings section for code editing utilities.
  * **New File (Suggested):** `webview-ui/src/components/settings/sections/CodeEditingSettingsSection.tsx`
  * **Action:** Implement a React component with inputs for the Morph API Key and URL.
  * **Integration:** Integrate this component into the main settings view hierarchy. The existing gRPC mechanisms (e.g., `src/core/controller/state/updateSettings.ts`) will handle persistence via the `StateManager`.

-----

### Phase 2: Tool Definition

We must define the `edit_file` tool specification within the modular prompt system (`src/core/prompts/system-prompt`).

#### 2.1 Define the Tool Specification

  * **New File:** `src/core/prompts/system-prompt/tools/edit_file.ts`
  * **Action:** Define the tool schema according to `src/core/prompts/system-prompt/spec.ts`.
      * **Name:** `edit_file`
      * **Parameters:** `target_file` (string), `instructions` (string), `code_edit` (string).
      * **Description:** Must include the detailed guidelines from `MORPH_APPLY_INTEGRATION.md`, emphasizing the `// ... existing code ...` syntax, minimal context, and first-person instructions.

#### 2.2 Register the Tool

  * **File to Edit:** `src/core/prompts/system-prompt/tools/index.ts`
      * **Action:** Export the new `edit_file` definition.
  * **File to Edit:** `src/core/prompts/system-prompt/tools/init.ts`
      * **Action:** Register the new tool in the `ClineToolSet`.
  * **File to Edit:** `src/shared/tools.ts`
      * **Action:** Add `edit_file` to the `ToolId` enum for type safety.

-----

### Phase 3: Tool Implementation (Handler)

We need to implement the backend logic that executes when the agent calls `edit_file`.

#### 3.1 Implement the `EditFileToolHandler`

  * **New File:** `src/core/task/tools/handlers/EditFileToolHandler.ts`

  * **Workflow:**

    1.  Receive parameters (`target_file`, `instructions`, `code_edit`).
    2.  Validate `target_file` (permissions, existence) using `src/core/task/tools/ToolValidator.ts` and `src/core/ignore/ClineIgnoreController.ts`.
    3.  Read the current file content (`initialCode`).
    4.  Call `MorphApplyService.applyEdit`.
    5.  Receive the `mergedCode`.
    6.  Write the `mergedCode` back to the `target_file`.
    7.  Display the changes using the `DiffViewProvider` (`src/integrations/editor/DiffViewProvider.ts`).

  * **Context to Read:** `src/core/task/tools/handlers/WriteToFileToolHandler.ts`. It is crucial to review this file and reuse its file writing mechanisms (or shared utilities) to ensure consistency with IDE dirty state management, event triggering, and checkpointing (`src/integrations/checkpoints/CheckpointTracker.ts`).

#### 3.2 Register the Handler

  * **File to Edit:** `src/core/task/tools/ToolExecutorCoordinator.ts`
  * **Action:** Map the `edit_file` tool name to the new `EditFileToolHandler`.

-----

### Phase 4: Prompt Engineering and Optimization

This critical phase ensures the agent prioritizes `edit_file` and uses the optimized XML format for tool invocation.

#### 4.1 Update Editing Guidelines (Prioritization)

  * **File to Edit:** `src/core/prompts/system-prompt/components/editing_files.ts`
  * **Action:** Significantly revise this component:
      * Establish `edit_file` as the **default and preferred** method for modifying existing files.
      * Incorporate the best practices for generating `code_edit` snippets (placeholders, minimal context, deletion handling, comprehensive edits in a single call).
      * Explicitly deprecate `replace_in_file` (Search/Replace) as a fallback only.
      * Restrict `write_to_file` to creating *new* files only.

#### 4.2 Implement XML Tool Invocation

The Morph guide strongly recommends using XML for the agent's tool calls.

  * **File to Edit:** `src/core/prompts/system-prompt/components/tool_use/formatting.ts`

  * **Action:** Update the instructions to enforce the recommended XML structure for all tool calls:

    ```xml
    <tool_name>
    <parameter_name>parameter_value</parameter_name>
    </tool_name>
    ```

  * **CRITICAL Follow-up:** The message parser must support this format.

      * **File to Edit/Verify:** `src/core/assistant-message/parse-assistant-message.ts`
      * **Action:** Ensure the parsing logic robustly extracts tool names and parameters (especially multi-line `code_edit` content) from the XML structure. If the current parser is insufficient, it must be updated.

#### 4.3 Update Examples

  * **File to Edit:** `src/core/prompts/system-prompt/components/tool_use/examples.ts`
  * **Action:** Add clear examples demonstrating the correct XML invocation of `edit_file` for various scenarios (adding, modifying, deleting code).