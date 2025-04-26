import OpenAI from 'openai';

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyzes code using OpenAI's API
 * @param code The code to analyze
 * @param filename The name of the file (for context)
 * @returns Object containing analysis results
 */
export async function analyzeCode(code: string, filename: string): Promise<{ analysis: string }> {
  try {
    // Determine language based on file extension
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    const language = getLanguageFromExtension(extension);
    
    // Prepare the prompt for GPT
    const prompt = `
      Analyze the following ${language} code from file ${filename}:
      
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Please provide a comprehensive analysis including:
      1. A brief summary of what the code does
      2. Code quality assessment
      3. Potential bugs or issues
      4. Performance considerations
      5. Security considerations (if applicable)
      6. Suggested improvements
      
      Format your response in markdown for readability.
    `;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an expert code reviewer and software engineer. Analyze code thoroughly but concisely. Focus on practical improvements." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });
    
    // Extract and return the analysis
    const analysis = response.choices[0]?.message?.content || 
      "Sorry, I couldn't analyze this code. Please try again with a different file.";
    
    return { analysis };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to analyze code with OpenAI');
  }
}

// Helper function to determine language from file extension
function getLanguageFromExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    'js': 'JavaScript',
    'jsx': 'JavaScript (React)',
    'ts': 'TypeScript',
    'tsx': 'TypeScript (React)',
    'py': 'Python',
    'java': 'Java',
    'c': 'C',
    'cpp': 'C++',
    'cs': 'C#',
    'go': 'Go',
    'rb': 'Ruby',
    'php': 'PHP',
    'html': 'HTML',
    'css': 'CSS',
    'json': 'JSON',
    'md': 'Markdown',
    'sql': 'SQL',
    'sh': 'Shell',
    'bat': 'Batch',
    'ps1': 'PowerShell',
    'yml': 'YAML',
    'yaml': 'YAML',
    'xml': 'XML',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'rs': 'Rust',
  };
  
  return languageMap[extension] || 'code';
}