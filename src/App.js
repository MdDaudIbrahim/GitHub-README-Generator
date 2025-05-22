import React, { useState, useEffect } from 'react';

// --- Icon Components (Inline SVG for simplicity) ---
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5c0-.9-.7-1.7-1.5-2.5C14.5 11.5 14 9 14 9c0-3 .5-4.5-2-4.5S8 6 8 9c0 0-.5 2.5-2.5 3.5C4.7 13.3 4 14.1 4 15v3.5c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5z"></path>
  </svg>
);
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);
const ClipboardCopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);
const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <path d="M12 2L9.88 7.12 4.06 7.94 8.03 12.31 7.26 18.12 12 15.56 16.74 18.12 15.97 12.31 19.94 7.94 14.12 7.12 12 2zM20 12l-2.12 5.12L12.06 17.94l-3.97 4.37-0.74-5.81L3 12l2.12-5.12L11.94 6.06l3.97-4.37 0.74 5.81L21 12z"/>
    </svg>
);


// --- README Generation Logic ---
const generateReadmeContent = (repoData, aiSuggestions) => {
  if (!repoData || !repoData.name) return "";

  const ownerLogin = repoData.owner?.login || 'username';
  const repoName = repoData.name || 'repository-name';
  const defaultBranch = repoData.default_branch || 'main';
  const repoUrl = repoData.html_url || `https://github.com/${ownerLogin}/${repoName}`;

  // --- Enhanced Badges ---
  const licenseBadge = repoData.license?.spdx_id
    ? `[![License: ${repoData.license.spdx_id}](https://img.shields.io/github/license/${ownerLogin}/${repoName}?style=flat-square)](${repoData.license.html_url || `https://opensource.org/licenses/${repoData.license.spdx_id}`})`
    : (repoData.license?.name ? `![License: ${repoData.license.name}](https://img.shields.io/badge/License-${encodeURIComponent(repoData.license.name)}-yellow?style=flat-square)` : '![License](https://img.shields.io/badge/License-N/A-lightgrey?style=flat-square)');
  
  const starsBadge = `[![Stargazers](https://img.shields.io/github/stars/${ownerLogin}/${repoName}?style=social)](${repoUrl}/stargazers)`;
  const forksBadge = `[![Forks](https://img.shields.io/github/forks/${ownerLogin}/${repoName}?style=social)](${repoUrl}/network/members)`;
  const issuesBadge = `[![Open Issues](https://img.shields.io/github/issues/${ownerLogin}/${repoName}?style=flat-square&color=critical)](${repoUrl}/issues)`;
  const contributorsBadge = `[![Contributors](https://img.shields.io/github/contributors/${ownerLogin}/${repoName}?style=flat-square&color=purple)](${repoUrl}/graphs/contributors)`;
  // Placeholder for build status - user needs to set this up with their CI/CD
  const buildStatusBadge = `[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://example.com/your-ci-cd-link) `;

  const allBadges = [starsBadge, forksBadge, licenseBadge, issuesBadge, contributorsBadge, buildStatusBadge].join(' ');
  
  const topicsBadges = (repoData.topics || [])
    .map(topic => `![Topic: ${topic}](https://img.shields.io/badge/${encodeURIComponent(topic)}-blueviolet?style=flat-square)`)
    .join(' ');

  // --- Language Distribution ---
  let languageDistributionSection = '';
  if (repoData.languageData && Object.keys(repoData.languageData).length > 0) {
    const totalBytes = Object.values(repoData.languageData).reduce((acc, bytes) => acc + bytes, 0);
    if (totalBytes > 0) {
      const percentages = Object.entries(repoData.languageData)
        .map(([lang, bytes]) => `* **${lang}**: ${((bytes / totalBytes) * 100).toFixed(2)}%`)
        .join('\n  ');
      languageDistributionSection = `\n\n  #### Language Distribution\n  ${percentages}`;
    } else {
      const langs = Object.keys(repoData.languageData).map(lang => `* **${lang}**: N/A (0 bytes)`).join('\n  ');
      languageDistributionSection = `\n\n  #### Language Distribution\n  ${langs}`;
    }
  } else if (repoData.language) {
    languageDistributionSection = `\n\n  #### Language Distribution\n  * **${repoData.language}**: 100% (Primary Language)`;
  }
  const mainLanguagesStr = repoData.language || (repoData.languageData ? Object.keys(repoData.languageData).join(', ') : 'Not specified');


  // --- AI Suggestions Integration ---
  const description = aiSuggestions?.ai_enhanced_description || repoData.description || "A brief description of your project.";
  
  let featuresSection = `## ✨ Key Features\n\n`;
  if (aiSuggestions?.ai_suggested_features && aiSuggestions.ai_suggested_features.length > 0) {
    featuresSection += aiSuggestions.ai_suggested_features.map(feature => `* ${feature}`).join('\n');
  } else {
    featuresSection += `* Feature 1: Describe a key feature of your project.\n* Feature 2: Highlight another cool aspect.\n* _(Add more specific features here!)_`;
  }

  let installationSection = `### Installation\n\nFollow these steps to get your development environment set up:`;
  if (aiSuggestions?.ai_installation_steps && aiSuggestions.ai_installation_steps.length > 0) {
    installationSection += `\n\n${aiSuggestions.ai_installation_steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`;
    installationSection += `\n\n_**(AI Suggested)** Remember to verify these steps. You might need to add repository cloning, directory navigation, or environment variable setup._\n\nFor example:\n\`\`\`bash\ngit clone ${repoUrl}\ncd ${repoName}\n# ... (AI suggested steps like npm install, pip install, etc.) ...\n# cp .env.example .env (if applicable)\n\`\`\``;
  } else {
    installationSection += `\n\n1.  **Clone the repository:**\n    \`\`\`bash\n    git clone ${repoUrl}\n    \`\`\`\n2.  **Navigate to the project directory:**\n    \`\`\`bash\n    cd ${repoName}\n    \`\`\`\n3.  **Install dependencies:**\n    \`\`\`bash\n    # Example for Node.js (npm or yarn)\n    npm install \n    # yarn install\n\n    # Example for Python\n    # pip install -r requirements.txt\n    \`\`\`\n4.  **Set up environment variables (if any):**\n    * Create a \`.env\` file (often by copying a \`.env.example\`).\n    * Fill in the necessary values in your \`.env\` file.`;
  }
  
  let builtWithSection = `## 🛠️ Technologies Used\n\nThis project is built with a combination of modern technologies and tools, including:\n\n`;
  if (aiSuggestions?.ai_identified_technologies && aiSuggestions.ai_identified_technologies.length > 0) {
    builtWithSection += `* **Core Technologies:** ${aiSuggestions.ai_identified_technologies.map(tech => `\`${tech}\``).join(', ')}\n`;
  }
  builtWithSection += `* **Main Programming Languages:** ${mainLanguagesStr}`;
  builtWithSection += languageDistributionSection; // Append the formatted language distribution
  builtWithSection += `\n\n* _(Feel free to add other specific libraries, frameworks, databases, or tools you've used!)_`;

  // --- Table of Contents ---
  const tocSections = [
    { title: "Key Features", id: "key-features" },
    { title: "Getting Started", id: "getting-started" },
    { title: "Technologies Used", id: "technologies-used" },
    { title: "Usage", id: "usage" },
    { title: "Roadmap", id: "roadmap" },
    { title: "Contributing", id: "contributing" },
    { title: "License", id: "license" },
    { title: "Contact", id: "contact" },
    { title: "Acknowledgements", id: "acknowledgements" }
  ];
  const tableOfContents = `## 📋 Table of Contents\n\n${tocSections.map(sec => `* [${sec.title}](#${sec.id.toLowerCase().replace(/\s+/g, '-')})`).join('\n')}`;


  // --- Roadmap Section ---
  const roadmapItems = [
    "**Advanced Feature X:** Implement the next major functionality.",
    "**UI/UX Enhancements:** Improve the user interface and experience.",
    "**Performance Optimization:** Focus on speed and efficiency.",
    "**Comprehensive Testing:** Increase test coverage for robustness.",
    "**Detailed Documentation:** Expand and refine project documentation."
  ];
  const roadmapSection = `## 🛣️ Roadmap\n\nWe have exciting plans for the future! Here's a glimpse of what's next:\n\n${roadmapItems.map(item => `- [ ] ${item}`).join('\n')}\n\nSee the [open issues](${repoUrl}/issues) for a full list of proposed features and known issues. Your suggestions are welcome!`;

  // --- Contributing Section ---
  const contributingSteps = [
    "**Fork the Project**",
    "**Create your Feature Branch:** `git checkout -b feature/YourAmazingFeature`",
    "**Commit your Changes:** `git commit -m 'Add: YourAmazingFeature'` (Follow conventional commit messages if possible)",
    "**Push to the Branch:** `git push origin feature/YourAmazingFeature`",
    "**Open a Pull Request** against the `${defaultBranch}` branch."
  ];
  const contributingSection = `## 🤝 Contributing\n\nContributions are the backbone of the open-source community and are **greatly appreciated**! If you have a suggestion to make this project better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".\n\nDon't forget to give the project a star ⭐ if you find it useful! Thank you!\n\n${contributingSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nPlease make sure to update tests as appropriate.`;

  // --- Acknowledgements Section ---
  const acknowledgementItems = [
    "[Awesome Resource 1](https://example.com/resource)",
    "Inspiration from [Project X](https://example.com/projectx)",
    "Gratitude to the open-source community.",
    "_(Add any other acknowledgements here)_"
  ];
  const acknowledgementsSection = `## 🙏 Acknowledgements\n\nA big thank you to all the resources and individuals who made this project possible:\n\n${acknowledgementItems.map(item => `* ${item}`).join('\n')}`;


  return `<!-- 
Optional: Add your project logo or a captivating banner image here!
<p align="center">
  <a href="${repoUrl}">
    <img src="URL_TO_YOUR_LOGO_OR_BANNER" alt="${repoData.name} Logo" width="YOUR_DESIRED_WIDTH" height="YOUR_DESIRED_HEIGHT">
  </a>
</p> 
-->

<h1 align="center">${repoData.name}</h1>

<p align="center">
  ${description}
  ${aiSuggestions?.ai_enhanced_description ? "<br/><em><small>(This description was enhanced by AI. Please review and edit.)</small></em>" : ""}
</p>

<p align="center">
  ${allBadges}
</p>

${topicsBadges ? `<p align="center">\n  ${topicsBadges}\n</p>\n` : ''}

---

${tableOfContents}

---

${featuresSection}

---

## 🚀 Getting Started

To get a local copy up and running, please follow these simple steps.

### Prerequisites

Ensure you have the following tools installed on your system:

* Node.js (e.g., v18.x or higher) - _(Specify version if critical)_
* npm (e.g., v9.x or higher) / yarn (e.g., v1.22.x or higher)
* Git
* _(Add any other essential prerequisites, like a database system, Docker, specific browser versions, etc.)_

Example installation for Node.js & npm:
\`\`\`bash
# Check if Node.js and npm are installed
node -v
npm -v
# If not, download from https://nodejs.org/
\`\`\`

${installationSection}

---

${builtWithSection}

---

## 🔧 Usage

Provide instructions and examples for use. Include code snippets or screenshots if helpful.
This section should guide a user on how to effectively use your project after installation.

**Example:**
\`\`\`javascript
// Illustrate how to use a core function or start the application
// import { coreFunction } from './src/myModule'; // Adjust path as needed

async function main() {
  console.log("Starting ${repoData.name}...");
  // const result = await coreFunction({ param1: 'value1' });
  // console.log('Project Output:', result);

  // For a web server example:
  // const app = require('./server'); // or import if using ES modules
  // const PORT = process.env.PORT || 3000;
  // app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));
}

main();
\`\`\`
_(If AI provided usage examples, integrate them here. Otherwise, write your own detailed usage instructions.)_

<!-- 
### 🖼️ Screenshots
<p align="center">
  <img src="URL_TO_SCREENSHOT_1" alt="Screenshot 1" width="45%">
  &nbsp; &nbsp; &nbsp; &nbsp;
  <img src="URL_TO_SCREENSHOT_2" alt="Screenshot 2" width="45%">
</p>
_Caption for screenshots._ 
-->

---

${roadmapSection}

---

${contributingSection}

---

## 📜 License

This project is distributed under the **${repoData.license?.name || "Not Specified License"}**. 
${repoData.license?.html_url ? `See \`LICENSE.txt\` or [click here](${repoData.license.html_url}) for more information.` : (repoData.license?.spdx_id ? `See the [${repoData.license.spdx_id} License details](https://opensource.org/licenses/${repoData.license.spdx_id}) for more information.` : 'Please refer to the LICENSE file in the repository for full details.')}

---

## 📞 Contact

Your Name / Organization - [@your_twitter_handle](https://twitter.com/your_twitter_handle) - your.email@example.com

Project Link: [${repoUrl}](${repoUrl})

Got questions or want to collaborate? Feel free to reach out!

---

${acknowledgementsSection}

`;
};


// --- Main App Component ---
export default function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [readmeContent, setReadmeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const parseGitHubUrl = (url) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/);
    if (match && match[1] && match[2]) {
      return { owner: match[1], repo: match[2].replace('.git', '') };
    }
    return null;
  };

  // Function to fetch content of a specific file from GitHub API
  const fetchFileContent = async (owner, repo, path) => {
    try {
      const fileApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const response = await fetch(fileApiUrl, {
        headers: { Accept: 'application/vnd.github.v3.raw' } // Get raw content
      });
      if (!response.ok) {
        if (response.status === 404) console.warn(`File not found: ${path}`);
        else console.warn(`Failed to fetch ${path}: ${response.status}`);
        return null;
      }
      return await response.text();
    } catch (e) {
      console.warn(`Error fetching file ${path}:`, e);
      return null;
    }
  };
  
  // Function to fetch root directory listing
  const fetchRootDirListing = async (owner, repo) => {
    try {
      const dirApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;
      const response = await fetch(dirApiUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch root dir listing: ${response.status}`);
        return [];
      }
      const data = await response.json();
      return data.map(item => `${item.name} (${item.type})`).slice(0, 20); // Get names and types of first 20 items
    } catch (e) {
      console.warn(`Error fetching root dir listing:`, e);
      return [];
    }
  };

  const callGeminiApi = async (promptText) => {
    setLoadingMessage('Analyzing repository with AI...');
    const apiKey = ""; // Canvas will inject this
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiSchema = {
        type: "OBJECT",
        properties: {
          "ai_enhanced_description": { "type": "STRING", description: "An AI-generated, improved description of the project (max 2-3 sentences) based on its files and metadata." },
          "ai_suggested_features": {
            "type": "ARRAY",
            "items": { "type": "STRING" },
            description: "A list of 2-4 key features (each a short phrase) suggested by AI based on the repository content."
          },
          "ai_installation_steps": {
            "type": "ARRAY",
            "items": { "type": "STRING" },
            description: "AI-suggested installation commands or steps (e.g., 'Run `npm install`') based on detected project files."
          },
          "ai_identified_technologies": {
              "type": "ARRAY",
              "items": { "type": "STRING" },
              description: "A list of 2-5 key technologies or frameworks (e.g., 'React', 'Express.js', 'MongoDB') AI identified beyond just programming languages."
          }
        },
        required: ["ai_enhanced_description", "ai_suggested_features", "ai_installation_steps", "ai_identified_technologies"]
      };

    const payload = {
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiSchema,
        temperature: 0.3, // Lower temperature for more factual/grounded suggestions
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini API Error:", response.status, errorBody);
        throw new Error(`Gemini API request failed with status ${response.status}. ${errorBody}`);
      }
      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const rawJsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(rawJsonText);
      } else {
        console.error("Unexpected Gemini API response structure:", result);
        throw new Error("Failed to parse AI suggestions from Gemini response.");
      }
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      throw err; // Re-throw to be caught by handleGenerateReadme
    }
  };


  const handleGenerateReadme = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      setReadmeContent('');
      return;
    }
    const parsedUrl = parseGitHubUrl(repoUrl);
    if (!parsedUrl) {
      setError("Invalid GitHub repository URL format. Example: https://github.com/owner/repository");
      setReadmeContent('');
      return;
    }

    setIsLoading(true);
    setError('');
    setReadmeContent('');
    setLoadingMessage('Fetching repository data from GitHub...');

    try {
      const repoApiUrl = `https://api.github.com/repos/${parsedUrl.owner}/${parsedUrl.repo}`;
      const repoResponse = await fetch(repoApiUrl);
      if (!repoResponse.ok) { 
        if (repoResponse.status === 404) throw new Error(`Repository not found at ${repoApiUrl}.`);
        if (repoResponse.status === 403) { const d = await repoResponse.json(); throw new Error(`GitHub API rate limit exceeded. ${d.message || ''}`);}
        throw new Error(`Failed to fetch repository data (Status: ${repoResponse.status}).`);
      }
      const repoData = await repoResponse.json();

      setLoadingMessage('Fetching language data...');
      let languageData = {};
      if (repoData.languages_url) {
        const langResponse = await fetch(repoData.languages_url);
        if (langResponse.ok) languageData = await langResponse.json();
        else console.warn(`Could not fetch language data (Status: ${langResponse.status})`);
      }
      
      setLoadingMessage('Fetching repository contents (README, package files)...');
      const existingReadmeContent = await fetchFileContent(parsedUrl.owner, parsedUrl.repo, 'README.md') || 
                                    await fetchFileContent(parsedUrl.owner, parsedUrl.repo, 'readme.md') ||
                                    await fetchFileContent(parsedUrl.owner, parsedUrl.repo, 'Readme.md');
      const packageJsonContent = await fetchFileContent(parsedUrl.owner, parsedUrl.repo, 'package.json');
      const requirementsTxtContent = await fetchFileContent(parsedUrl.owner, parsedUrl.repo, 'requirements.txt');
      const composerJsonContent = await fetchFileContent(parsedUrl.owner, parsedUrl.repo, 'composer.json');
      const gemfileContent = await fetchFileContent(parsedUrl.owner, parsedUrl.repo, 'Gemfile');
      
      setLoadingMessage('Fetching root directory listing...');
      const rootDirListing = await fetchRootDirListing(parsedUrl.owner, parsedUrl.repo);

      // Construct prompt for Gemini
      let promptText = `Analyze the following GitHub repository information to help generate a README.md file.
Repository Name: ${repoData.name}
Repository Description: ${repoData.description || "Not provided."}
Primary Language: ${repoData.language || "Not specified."}
Topics: ${(repoData.topics || []).join(', ') || "None"}

Existing README.md content (if any, summarized or truncated if long):
${existingReadmeContent ? existingReadmeContent.substring(0, 1000) + (existingReadmeContent.length > 1000 ? "..." : "") : "No existing README found."}

package.json content (if any):
${packageJsonContent ? packageJsonContent.substring(0, 500) + (packageJsonContent.length > 500 ? "..." : "") : "Not found."}

requirements.txt content (if any):
${requirementsTxtContent ? requirementsTxtContent.substring(0, 500) + (requirementsTxtContent.length > 500 ? "..." : "") : "Not found."}

composer.json content (if any):
${composerJsonContent ? composerJsonContent.substring(0, 500) + (composerJsonContent.length > 500 ? "..." : "") : "Not found."}

Gemfile content (if any):
${gemfileContent ? gemfileContent.substring(0, 500) + (gemfileContent.length > 500 ? "..." : "") : "Not found."}

Root directory file listing (partial):
${rootDirListing.join('\n') || "Could not fetch."}

Based on ALL the information above, provide the following in JSON format matching the specified schema:
1.  ai_enhanced_description: A concise, engaging project description (2-3 sentences).
2.  ai_suggested_features: 2-4 key features of the project, as short phrases.
3.  ai_installation_steps: A few key installation commands/steps (e.g., "Run \\\`npm install\\\` if package.json detected", "Run \\\`pip install -r requirements.txt\\\` if requirements.txt detected").
4.  ai_identified_technologies: 2-5 key technologies or frameworks used (e.g., React, Django, Spring Boot), beyond just the primary language.
Focus on information derivable from the provided text. If some information isn't clear, make reasonable inferences or state that.
`;
      
      const aiSuggestions = await callGeminiApi(promptText);
      
      const fullRepoData = { ...repoData, languageData };
      const generatedContent = generateReadmeContent(fullRepoData, aiSuggestions);
      setReadmeContent(generatedContent);

    } catch (err) {
      console.error("Error in handleGenerateReadme:", err);
      setError(err.message || "Failed to generate README. Check the console for details.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleCopyToClipboard = () => { 
    if (!readmeContent) return;
    const textArea = document.createElement('textarea');
    textArea.value = readmeContent;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy text. Please try manually.');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <GithubIcon />
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-400">AI-Enhanced README Generator</h1>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">
          Enter a GitHub repository URL. We'll fetch its data and use AI to help generate a comprehensive README.md.
        </p>
      </header>

      <div className="w-full max-w-2xl bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 mb-8">
        <h2 className="text-xl font-semibold text-sky-300 mb-1">Repository URL</h2>
        <p className="text-xs text-slate-400 mb-4">e.g., https://github.com/facebook/react</p>
        <div className="flex items-center space-x-3">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <LinkIcon /> </div>
                <input type="url" id="repoUrl" value={repoUrl} onChange={(e) => { setRepoUrl(e.target.value); if (error) setError('');}}
                  placeholder="Enter GitHub repository URL"
                  className="w-full p-3 pl-10 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors" />
            </div>
        </div>
        <button onClick={handleGenerateReadme} disabled={isLoading}
          className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {loadingMessage || 'Generating...'}
            </>
          ) : ( <> <SparklesIcon /> Generate AI-Enhanced README </> )}
        </button>
      </div>
      
      {error && ( 
        <div className="w-full max-w-2xl bg-red-500/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center" role="alert">
          <AlertTriangleIcon /> <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {readmeContent && !isLoading && !error && ( 
        <div className="w-full max-w-4xl bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-sky-300">Generated README.md</h2>
            <button onClick={handleCopyToClipboard}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-sm transition-colors duration-150 ease-in-out flex items-center text-sm">
              <ClipboardCopyIcon /> {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
          </div>
          <textarea value={readmeContent} onChange={(e) => setReadmeContent(e.target.value)}
            className="w-full h-[600px] p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-y"
            placeholder="README content will appear here..." spellCheck="false" />
        </div>
      )}
       {!readmeContent && !isLoading && !error && ( 
         <div className="w-full max-w-4xl text-center text-slate-500 mt-8">
            <FileTextIcon className="mx-auto h-12 w-12 mb-2" />
            <p>Enter a GitHub repository URL above and click "Generate AI-Enhanced README" to get started.</p>
         </div>
       )}
      
      <footer className="w-full max-w-4xl mt-12 text-center text-slate-500 text-xs">
        <p>README Generator v1.3.1 (Markdown Fixes)</p>
        <p>Uses public GitHub API & Gemini API. Rate limits may apply. Always review and customize AI-generated content.</p>
      </footer>
    </div>
  );
}
