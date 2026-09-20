import React, { useState, useRef, useCallback } from 'react';
import { fetchAIResponse, fetchGeminiResponse } from '../../data/chatResponses';
import { getAssetUrl } from '../../utils/imageLoader';

const parseInlineCode = (text) => {
  const codeParts = text.split(/(`.*?`)/g);
  return codeParts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="inline-code">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const parseInlineMarkdown = (text) => {
  if (!text) return '';
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  return boldParts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerText = part.slice(2, -2);
      return <strong key={index}>{parseInlineCode(innerText)}</strong>;
    }
    const italicParts = part.split(/(\*.*?\*)/g);
    return italicParts.map((subPart, subIndex) => {
      if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2) {
        return <em key={`${index}-${subIndex}`}>{parseInlineCode(subPart.slice(1, -1))}</em>;
      }
      return <span key={`${index}-${subIndex}`}>{parseInlineCode(subPart)}</span>;
    });
  });
};

const parseMarkdownToReact = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      const itemText = trimmedLine.substring(2);
      listItems.push(
        <li key={`${lineIndex}-item`}>
          {parseInlineMarkdown(itemText)}
        </li>
      );
    } else {
      if (inList) {
        elements.push(
          <ul key={`${lineIndex}-ul`} className="chat-list">
            {listItems}
          </ul>
        );
        inList = false;
        listItems = [];
      }
      if (trimmedLine.length > 0) {
        elements.push(
          <p key={lineIndex} className="chat-paragraph">
            {parseInlineMarkdown(line)}
          </p>
        );
      } else {
        elements.push(<div key={lineIndex} className="chat-spacer" />);
      }
    }
  });

  if (inList) {
    elements.push(
      <ul key="final-ul" className="chat-list">
        {listItems}
      </ul>
    );
  }

  return elements;
};

export default function ChatCard() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! I'm Sanjay's AI assistant. Ask me anything about his projects, skills, or experience!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isBankai, setIsBankai] = useState(false);
  const [displayText, setDisplayText] = useState("Hey! I'm Sanjay's AI assistant. Ask me anything about his projects, skills, or experience!");
  const [bubbleStyle, setBubbleStyle] = useState({});
  const inputRef = useRef(null);
  const typingInterval = useRef(null);
  const chatBubbleRef = useRef(null);

  const typeWriter = useCallback((text, onComplete) => {
    const cleanedText = text.trim();
    let i = 0;
    setDisplayText('');
    if (typingInterval.current) clearInterval(typingInterval.current);

    typingInterval.current = setInterval(() => {
      const char = cleanedText.charAt(i);
      setDisplayText(prev => {
        const next = prev + char;
        setTimeout(() => {
          if (chatBubbleRef.current) {
            chatBubbleRef.current.scrollTop = chatBubbleRef.current.scrollHeight;
          }
        }, 0);
        return next;
      });
      i++;
      if (i >= cleanedText.length) {
        clearInterval(typingInterval.current);
        if (onComplete) onComplete();
      }
    }, 12);
  }, []);

  const updateBubble = useCallback((text) => {
    setBubbleStyle({ opacity: 0, transform: 'scale(0.8) translateY(10px)' });
    setIsBankai(false);

    setTimeout(() => {
      const cleaned = text.trim();
      if (cleaned === 'Zanka No Tachi !!!') {
        setIsBankai(true);
      }
      typeWriter(cleaned);
      setBubbleStyle({ opacity: 1, transform: 'scale(1) translateY(0)' });
    }, 300);
  }, [typeWriter]);

  const handleSend = useCallback(async () => {
    if (!inputRef.current) return;
    const val = inputRef.current.value.trim();
    if (!val || isTyping) return;

    inputRef.current.value = '';

    // Add user message to history
    setMessages(prev => [...prev, { role: 'user', text: val }]);

    // Check for easter egg first
    const easterEgg = fetchAIResponse(val);
    if (easterEgg) {
      setMessages(prev => [...prev, { role: 'ai', text: easterEgg }]);
      updateBubble(easterEgg);
      return;
    }

    setIsTyping(true);

    try {
      const response = await fetchGeminiResponse(val);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      updateBubble(response);
    } catch {
      const fallback = "Sorry, I'm having trouble connecting. Try again in a moment!";
      setMessages(prev => [...prev, { role: 'ai', text: fallback }]);
      updateBubble(fallback);
    } finally {
      setIsTyping(false);
    }
  }, [updateBubble, isTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const stopPropagation = (e) => e.stopPropagation();

  // Show the last few messages in the mini chat history
  const recentMessages = messages.slice(-4);

  return (
    <div className="card-container" id="chat-card-container" style={{ left: '2300px', top: '1850px' }}>
      <span className="card-label">CARD #04 &mdash; SANJAY AI</span>
      <div className={`chat-card${isTyping ? ' typing' : ''}`}>
        {/* Mascot */}
        <img src={getAssetUrl('Chat-image.png')} className="chat-character" alt="Sanjay AI" />

        <div className="chat-main">
          {/* Mini chat history */}
          <div className="chat-history-mini">
            {recentMessages.slice(0, -1).map((msg, i) => (
              <div key={i} className={`chat-mini-msg ${msg.role}`}>
                <span>{msg.role === 'user' ? '→ ' : ''}{msg.text.length > 50 ? msg.text.slice(0, 50) + '...' : msg.text}</span>
              </div>
            ))}
          </div>

          {/* Single Response Bubble */}
          <div className="chat-bubble" id="chat-bubble" style={bubbleStyle} ref={chatBubbleRef}>
            <div id="chat-text" className={isBankai ? 'bankai-active' : ''}>
              {parseMarkdownToReact(displayText)}
            </div>
          </div>
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="chat-input-field"
            id="chat-input-field"
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
            disabled={isTyping}
          />
          <div id="chat-typing-dot" className="chat-dot"></div>
          {isTyping && (
            <div className="chat-typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
        </div>

        {/* Gemini badge */}
        <div className="gemini-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6l3-6z"/>
          </svg>
          <span>Powered by Gemini</span>
        </div>
      </div>
    </div>
  );
}
