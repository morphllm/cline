import { SystemPromptSection } from "../templates/placeholders"
import { TemplateEngine } from "../templates/TemplateEngine"
import type { PromptVariant, SystemPromptContext } from "../types"

const EDITING_FILES_TEMPLATE_TEXT = `EDITING FILES

You have access to three tools for working with files: **edit_file**, **replace_in_file**, and **write_to_file**. Always use **edit_file** by default for edits to existing files. **replce_in_file** is only used as fall back. **write_to_file** solely for creating new files or when a complete rewrite is truly unavoidable.

Decision rule: edit_file → replace_in_file → write_to_file.

# edit_file

## Purpose

- Make semantic, targeted edits to specific parts of an existing file by specifying only the changed lines and using placeholders for unchanged code.

## When to Use

- Default choice for most modifications where you want to minimize risk and avoid rewriting entire files.
- Multiple small or medium edits within a single file, including structural changes that are brittle with plain search/replace.

## Important Considerations

- Use placeholders to represent unchanged sections (e.g., // ... existing code ...). Provide minimal but sufficient surrounding context before and after your changes.
- Combine all required changes to a single file into one edit_file call when possible.
- If **edit_file** is unavailable or clearly unnecessary for a trivial exact-text change, fall back to **replace_in_file**.

# write_to_file

## Purpose

- Create a new file, or overwrite the entire contents of an existing file.

## When to Use

- Initial file creation, such as when scaffolding a new project.  
- Overwriting large boilerplate files where you want to replace the entire content at once.
- When the complexity or number of changes would make replace_in_file unwieldy or error-prone.
- When you need to completely restructure a file's content or change its fundamental organization.

## Important Considerations

- Using write_to_file requires providing the file's complete final content.  
- If you only need to make small changes to an existing file, consider using replace_in_file instead to avoid unnecessarily rewriting the entire file.
- While write_to_file should not be your default choice, don't hesitate to use it when the situation truly calls for it.

# replace_in_file

## Purpose

- Make targeted edits to specific parts of an existing file without overwriting the entire file.

## When to Use

- Small, localized changes like updating a few lines, function implementations, changing variable names, modifying a section of text, etc.
- Targeted improvements where only specific portions of the file's content needs to be altered.
- Especially useful for long files where much of the file will remain unchanged.

## Advantages

- More efficient for minor edits, since you don't need to supply the entire file content.  
- Reduces the chance of errors that can occur when overwriting large files.

# Choosing the Appropriate Tool

- **Default to edit_file** for most changes. It enables precise, context-aware edits while minimizing risk.
- If in doubt, use **edit_file**.
- **Fallback to replace_in_file** when:
  - A simple, exact-text change is sufficient and unambiguous
  - edit_file is unavailable or unnecessary for the scope of the change
- **Use write_to_file** when:
  - Creating new files
  - The changes are so extensive that using edit_file or replace_in_file would be more complex or risky
  - You need to completely reorganize or restructure a file
  - The file is relatively small and the changes affect most of its content
  - You're generating boilerplate or template files
- Do not use **write_to_file** on existing files unless both **edit_file** and **replace_in_file** are impossible.

# Auto-formatting Considerations

- After using either write_to_file or replace_in_file, the user's editor may automatically format the file
- This auto-formatting may modify the file contents, for example:
  - Breaking single lines into multiple lines
  - Adjusting indentation to match project style (e.g. 2 spaces vs 4 spaces vs tabs)
  - Converting single quotes to double quotes (or vice versa based on project preferences)
  - Organizing imports (e.g. sorting, grouping by type)
  - Adding/removing trailing commas in objects and arrays
  - Enforcing consistent brace style (e.g. same-line vs new-line)
  - Standardizing semicolon usage (adding or removing based on style)
- The write_to_file and replace_in_file tool responses will include the final state of the file after any auto-formatting
- Use this final state as your reference point for any subsequent edits. This is ESPECIALLY important when crafting SEARCH blocks for replace_in_file which require the content to match what's in the file exactly.

# Workflow Tips

1. Before editing, assess the scope of your changes and decide which tool to use.
2. Prefer a single **edit_file** call for a file when making multiple related edits; otherwise apply **replace_in_file** with carefully crafted SEARCH/REPLACE blocks. If you need multiple changes, you can stack multiple SEARCH/REPLACE blocks within a single replace_in_file call.
3. For major overhauls or initial file creation, rely on **write_to_file**.
4. Once the file has been edited with either write_to_file or replace_in_file, the system will provide you with the final state of the modified file. Use this updated content as the reference point for any subsequent SEARCH/REPLACE operations, since it reflects any auto-formatting or user-applied changes.
By thoughtfully selecting between edit_file, replace_in_file, and write_to_file (in that order of preference), you can make your file editing process smoother, safer, and more efficient.`

export async function getEditingFilesSection(variant: PromptVariant, _context: SystemPromptContext): Promise<string> {
	const template = variant.componentOverrides?.[SystemPromptSection.EDITING_FILES]?.template || EDITING_FILES_TEMPLATE_TEXT

	return new TemplateEngine().resolve(template, {})
}
