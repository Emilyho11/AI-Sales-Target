import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ContentContainer from '../components/ContentContainer';
import axios from 'axios';

const EmailEditor = ({ sender }) => {
  const [editorContent, setEditorContent] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleEmailChange = (event) => {
    setRecipientEmail(event.target.value);
  };

  const handleSave = async () => {
    const emailData = {
      subject: "TESTING Subject",
      text: editorContent,
      to: recipientEmail,
      from: "emily.ho@clio.com",
    };
  
    try {
      const response = await axios.post(`http://localhost:3000/api/send-email`, emailData);
      console.log('Email sent:', response.data);
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
      alert('Failed to send email');
    }
  };

  return (
    <ContentContainer>
      <div>
        <div className='flex gap-6'>
          <input
            type="email"
            placeholder="Recipient's email"
            value={recipientEmail}
            onChange={handleEmailChange}
            className='p-2 my-4 border border-gray-300 bg-white rounded-lg'
          />
          <button 
            className='p-2 my-4 bg-clio_color hover:bg-blue-400 py-2 px-4 m-2 rounded-lg flex items-center justify-center' 
            onClick={handleSave}
          >
            Save and Send
          </button>
        </div>
        <ReactQuill
          theme="snow"
          value={editorContent}
          onChange={handleEditorChange}
          className='h-96'
        />
      </div>
    </ContentContainer>
  );
};

export default EmailEditor;
