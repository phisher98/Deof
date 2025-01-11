const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { source } = req.body;

      if (!source) {
        return res.status(400).json({ error: 'Source is required.' });
      }

      // Fetch the original script that contains the deobfuscation logic
      const originalScriptUrl = "https://raw.githubusercontent.com/Kohi-den/extensions-source/9328d12fcfca686becfb3068e9d0be95552c536f/lib/synchrony/src/main/assets/synchrony-v2.4.5.1.js";
      const originalScript = await fetch(originalScriptUrl).then(response => response.text());

      // Regex to find export {one as Deobfuscator, two as Transformer}
      const regex = /export\s*\{(.+?)\s*as\s*Deobfuscator,\s*(.+?)\s*as\s*Transformer\}\s*;/;
      const match = originalScript.match(regex);

      if (!match) {
        return res.status(500).json({ error: 'Could not find Deobfuscator and Transformer exports in the script.' });
      }

      const [_, deob, trans] = match;

      // Replace with appropriate Deobfuscator and Transformer script
      const synchronyScript = originalScript.replace(regex, `const Deobfuscator = ${deob}, Transformer = ${trans};`);

      // Deobfuscation logic
      const result = deobfuscateSource(synchronyScript, source);

      // Send back the result
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: 'Error during deobfuscation: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

// Dummy function to simulate deobfuscation (replace with actual logic)
function deobfuscateSource(script, source) {
  // Simulating the deobfuscation
  return `Deobfuscated version of: ${source}`;
}
