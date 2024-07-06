import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-okaidia.css';
import axios from 'axios';
import './App.css';

function App() {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = async () => {
    const payload = { language, code, input };
    try {
      const { data } = await axios.post('http://localhost:8000/run', payload);
      setOutput(data.output);
    } catch (error) {
      console.error(error.response);
      setOutput('An error occurred while running the code.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3">
        <h1 className="text-2xl font-bold">Code Sphere</h1>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row" style={{height: 'calc(100vh - 60px)'}}>
        {/* Left side: Code editor and Run button */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-800 p-4">
          <div className="mb-4 flex items-center">
            <label htmlFor="language" className="mr-2 text-white font-medium">Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="c">C</option>
            </select>
          </div>
          
          <div className="flex-grow overflow-auto" style={{ minHeight: '200px' }}>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => highlight(code, languages.clike)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                backgroundColor: '#282c34',
                color: '#abb2bf',
                borderRadius: '4px',
                minHeight: '100%',
              }}
              textareaClassName="editor-textarea"
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Run Code
          </button>
        </div>
        
        {/* Right side: Combined Input and Output */}
        <div className="w-full md:w-1/2 p-4 bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col">
          <div className="flex-grow flex flex-col">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Input</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white mb-4"
              placeholder="Enter input here..."
              rows="5"
            ></textarea>
            
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Output</h2>
            <pre className="bg-white p-4 rounded overflow-auto flex-grow border border-gray-300">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;