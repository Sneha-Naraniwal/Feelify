const API_URL = "http://localhost:3000/api/run";

const LANGUAGE_VERSIONS = {
  javascript: "javascript",
  python: "python",
  java: "java",
};

/**
 * Execute code via the JDoodle backend proxy.
 * @param {string} language
 * @param {string} code
 * @returns {Promise<{success: boolean, output?: string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    if (!LANGUAGE_VERSIONS[language]) {
      return { success: false, error: `Unsupported language: ${language}` };
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: LANGUAGE_VERSIONS[language],
        code: code,
      }),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP error! status: ${response.status}` };
    }

    const data = await response.json();

    // JDoodle returns statusCode 200 for success, non-200 for errors
    // Also check if the output contains compilation/runtime error indicators
    const output = data.output || "";
    const statusCode = data.statusCode;

    // JDoodle uses statusCode !== 200 for execution errors
    if (statusCode && statusCode !== 200) {
      return {
        success: false,
        output: "",
        error: output || "Code execution failed",
      };
    }

    // Check for common error patterns in output (compilation errors, exceptions)
    const errorPatterns = [
      /^error:/im,
      /^exception in thread/im,
      /^traceback \(most recent call last\)/im,
      /^syntaxerror:/im,
      /^nameerror:/im,
      /^typeerror:/im,
      /^referenceerror:/im,
      /compilation error/im,
      /^file ".*", line \d+/im,
    ];

    const hasError = errorPatterns.some((pattern) => pattern.test(output));

    if (hasError) {
      return {
        success: false,
        output: "",
        error: output,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Execution failed: ${error.message}`,
    };
  }
}