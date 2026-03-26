// Judge0 API is a service for code execution


//  const JUDGE0_API = "https://judge0-extra-ce1.p.rapidapi.com/submissions/batch?base64_encoded=true";  ---> its for judge0 extra ce RapidApi
const JUDGE0_API = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" ,id:63},
  python: { language: "python", version: "3.10.0" ,id:71},
  java: { language: "java", version: "15.0.2" ,id:62},
};


/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }


    /*
    const response = await fetch(JUDGE0_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "d7f54ac382mshfe9ef0a63b04307p1009bejsn7fcd40e91331", // 🔴 put your key here
        "X-RapidAPI-Host": "judge0-extra-ce1.p.rapidapi.com",
      },
      body: JSON.stringify({
    submissions: [
      {
        language_id: languageConfig.id,
        source_code: encodeBase64(code)
      }
    ]
  }),
    }); */

    const response = await fetch(JUDGE0_API,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      source_code: code,
      language_id: languageConfig.id
    })
  }
);



    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    const output = data.stdout || "";
    const stderr = data.stderr || data.compile_output || "";


    if (stderr) {
      return {
        success: false,
        output: output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}


function encodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}


/**
 * 
 * function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}
 */

