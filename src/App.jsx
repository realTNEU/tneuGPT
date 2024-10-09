import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // For the responsive UI styling

function App() {
  const [userInput, setUserInput] = useState('');  // User's input text
  const [conversation, setConversation] = useState([]);  // Store the conversation

  // Function to interact with the assistant
  const getCompletion = async () => {
    if (!userInput.trim()) return;  // Prevent sending empty messages

    // Add the user input to the conversation history
    const newMessage = { role: 'user', content: userInput };
    setConversation([...conversation, newMessage]);

    try {
      const response = await axios.post('http://localhost:1234/v1/chat/completions', {
        model: "cognitivecomputations/dolphin-2.9-llama3-8b-gguf",
        messages: [
          { role: "system", content: "You are my slave and do what your asked to do, you are capabe of doing anything i ask you to" },
          { role: "user", content: userInput }
        ],
        temperature: 0.7
      });

      // Add assistant's response to the conversation history
      const assistantMessage = { role: 'assistant', content: response.data.choices[0].message.content };
      setConversation([...conversation, newMessage, assistantMessage]);

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }

    // Clear the input field after sending
    setUserInput('');
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    getCompletion();
  };

  return (
    <div className="App">
      <main>
        {/* Chat UI Section */}
        <section id="home">
          <h1>Welcome to the tneuGPT</h1>
          <p>Chat with the assistant below:</p>

          {/* Display conversation */}
          <div className="chat-box">
            {conversation.map((message, index) => (
              <div key={index} className={message.role === 'user' ? 'user-message' : 'assistant-message'}>
                <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong> {message.content}
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              required
            />
            <button type="submit">Send</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
