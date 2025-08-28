import { CacheService } from "@core/storage/CacheService"
import { MorphService, MorphServiceConfig } from "./MorphService"

/**
 * Create a MorphService instance from the current cache configuration
 *
 * @param cacheService - The cache service to read configuration from
 * @returns MorphService instance if properly configured, null otherwise
 */
export function createMorphService(cacheService: CacheService): MorphService | null {
	const morphEnabled = cacheService.getGlobalStateKey("morphEnabled")
	const morphApiKey = cacheService.getSecretKey("morphApiKey")
	const morphBaseUrl = cacheService.getGlobalStateKey("morphBaseUrl")

	console.log(
		"[MORPH DEBUG] createMorphService - morphEnabled:",
		morphEnabled,
		"morphApiKey:",
		morphApiKey ? "***SET***" : "***EMPTY***",
		"morphBaseUrl:",
		morphBaseUrl,
	)

	// Return null if Morph is disabled or API key is missing
	if (!morphEnabled || !morphApiKey) {
		console.log(
			"[MORPH DEBUG] createMorphService returning null - morphEnabled:",
			morphEnabled,
			"morphApiKey present:",
			!!morphApiKey,
		)
		return null
	}

	const config: MorphServiceConfig = {
		apiKey: morphApiKey,
		baseUrl: morphBaseUrl || "https://api.morphllm.com/v1",
	}

	console.log("[MORPH DEBUG] createMorphService returning MorphService instance")
	return new MorphService(config)
}

/**
 * Check if Morph service is available and properly configured
 *
 * @param cacheService - The cache service to check configuration
 * @returns True if Morph is enabled and has an API key
 */
export function isMorphAvailable(cacheService: CacheService): boolean {
	const morphEnabled = cacheService.getGlobalStateKey("morphEnabled")
	const morphApiKey = cacheService.getSecretKey("morphApiKey")

	return Boolean(morphEnabled && morphApiKey)
}

export { DEFAULT_MORPH_SETTINGS, DEFAULT_MORPH_TIMEOUT_MS, MORPH_FAST_APPLY_MODEL } from "./constants"
// Re-export types and classes for easy importing
export { type MorphEditRequest, MorphError, MorphService, type MorphServiceConfig } from "./MorphService"
