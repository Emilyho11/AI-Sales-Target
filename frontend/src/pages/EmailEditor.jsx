import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ContentContainer from '../components/ContentContainer';
import axios from 'axios';

const EmailEditor = () => {
  const [editorContent, setEditorContent] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleEmailChange = (event) => {
    setRecipientEmail(event.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/send-email', {
        to: recipientEmail,
        content: editorContent,
      });
      console.log('Email sent:', response.data);
      alert('Email sent successfully!');
    }
    catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  return (
    <ContentContainer>
      <div>
        <ReactQuill value={editorContent} onChange={handleEditorChange} />
        <input
          type="email"
          placeholder="Recipient's email"
          value={recipientEmail}
          onChange={handleEmailChange}
        />
        <button onClick={handleSave}>Save and Send</button>
      </div>
    </ContentContainer>
  );
};

export default EmailEditor;
