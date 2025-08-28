import OpenAI from "openai"
import { DEFAULT_MORPH_TIMEOUT_MS, MORPH_FAST_APPLY_MODEL } from "./constants"

/**
 * Request parameters for Morph Fast Apply edit operation
 */
export interface MorphEditRequest {
	/**
	 * Single sentence describing what you're changing (first person)
	 * Example: "I am adding error handling to the login function"
	 */
	instructions: string

	/**
	 * The current content of the file being edited
	 */
	originalContent: string

	/**
	 * The lazy edit using // ... existing code ... format
	 */
	codeEdit: string
}

/**
 * Configuration for the Morph service
 */
export interface MorphServiceConfig {
	apiKey: string
	baseUrl: string
	timeout?: number
}

/**
 * Error thrown when Morph API operations fail
 */
export class MorphError extends Error {
	public override readonly cause?: Error

	constructor(message: string, cause?: Error) {
		super(message)
		this.name = "MorphError"
		this.cause = cause
	}
}

/**
 * Service for interacting with Morph's Fast Apply API
 *
 * This service handles the dual-model architecture where:
 * 1. Main chat model generates lazy edits
 * 2. Morph model applies them precisely to files
 */
export class MorphService {
	private client: OpenAI
	private config: MorphServiceConfig

	constructor(config: MorphServiceConfig) {
		this.config = {
			...config,
			timeout: config.timeout ?? DEFAULT_MORPH_TIMEOUT_MS,
		}

		this.client = new OpenAI({
			apiKey: config.apiKey,
			baseURL: config.baseUrl,
			timeout: this.config.timeout,
		})
	}

	/**
	 * Apply a lazy edit to file content using Morph's Fast Apply API
	 *
	 * @param request - The edit request with instructions, original content, and lazy edit
	 * @returns Promise resolving to the merged file content
	 * @throws MorphError if the API request fails
	 */
	async applyEdit(request: MorphEditRequest): Promise<string> {
		try {
			// Validate input
			this.validateEditRequest(request)

			// Format the request for Morph API
			const morphPrompt = this.formatMorphPrompt(request)

			// Make the API request
			const response = await this.client.chat.completions.create({
				model: MORPH_FAST_APPLY_MODEL,
				messages: [
					{
						role: "user",
						content: morphPrompt,
					},
				],
				// Disable streaming for consistency
				stream: false,
			})

			const mergedCode = response.choices[0]?.message?.content
			if (!mergedCode) {
				throw new MorphError("Morph API returned empty response")
			}

			return mergedCode
		} catch (error) {
			if (error instanceof MorphError) {
				throw error
			}

			// Wrap other errors in MorphError for consistent handling
			const message = error instanceof Error ? error.message : "Unknown error"
			throw new MorphError(`Morph API request failed: ${message}`, error instanceof Error ? error : undefined)
		}
	}

	/**
	 * Validate the API key by making a minimal test request
	 *
	 * @returns Promise resolving to true if the API key is valid
	 */
	async validateApiKey(): Promise<boolean> {
		try {
			// Make a minimal test request
			await this.client.chat.completions.create({
				model: MORPH_FAST_APPLY_MODEL,
				messages: [
					{
						role: "user",
						content: "<instruction>test</instruction>\n<code>test</code>\n<update>test</update>",
					},
				],
				max_tokens: 1,
				stream: false,
			})
			return true
		} catch (error) {
			// Any error indicates invalid API key or service unavailable
			return false
		}
	}

	/**
	 * Format the edit request into Morph's expected prompt format
	 */
	private formatMorphPrompt(request: MorphEditRequest): string {
		return `<instruction>${request.instructions}</instruction>\n<code>${request.originalContent}</code>\n<update>${request.codeEdit}</update>`
	}

	/**
	 * Validate the edit request parameters
	 */
	private validateEditRequest(request: MorphEditRequest): void {
		if (!request.instructions?.trim()) {
			throw new MorphError("Instructions are required and cannot be empty")
		}

		if (request.originalContent === undefined || request.originalContent === null) {
			throw new MorphError("Original content is required (can be empty string for new files)")
		}

		if (!request.codeEdit?.trim()) {
			throw new MorphError("Code edit is required and cannot be empty")
		}

		// Check for lazy edit format markers
		if (
			request.codeEdit.includes("// ... existing code ...") ||
			request.codeEdit.includes("# ... existing code ...") ||
			request.codeEdit.includes("<!-- ... existing code ... -->")
		) {
			// Good - contains expected lazy edit markers
		} else if (request.originalContent.length > 0) {
			// Warn if no lazy markers found and file is not empty
			console.warn(
				"Morph edit request does not contain lazy edit markers (// ... existing code ...). This may result in unexpected behavior.",
			)
		}
	}
}
