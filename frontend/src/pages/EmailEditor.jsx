import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ContentContainer from '../components/ContentContainer';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const EmailEditor = () => {
  const [editorContent, setEditorContent] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const location = useLocation();
  const { sender, recipientName } = location.state || { sender: "", recipientEmail: "emily.ho@clio.com", recipientName: "there" };

  useEffect(() => {
    setRecipientEmail(location.state?.recipientEmail || "emily.ho@clio.com"); // Initialize recipientEmail
    // Load the HTML template
    const loadTemplate = async () => {
      try {
        // Pass the name as a query parameter
        const response = await axios.get(`http://localhost:3000/api/email-template?name=${recipientName}`);
        setEditorContent(response.data);
      } catch (error) {
        console.error('Error loading email template:', error.message);
      }
    };
    loadTemplate();
  }, [recipientName, location.state]);

  const handleEditorChange = (event) => {
    setEditorContent(content);
    setEditorContent(event.target.innerHTML);
  };

  const handleEmailChange = (event) => {
    setRecipientEmail(event.target.value);
  };

  const handleSave = async () => {
    const emailData = {
      subject: emailSubject || "Transform Your Practice with Clio",
      text: editorContent,
      to: recipientEmail,
      from: "emily.ho@clio.com",
      name: recipientName,
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
    <ContentContainer className="flex justify-center items-center">
      <div className='w-2/3'>
        <div className='flex gap-4'>
          <input
            type="email"
            placeholder="To:"
            value={recipientEmail}
            onChange={handleEmailChange}
            className='p-2 my-2 border border-gray-300 bg-white rounded-lg focus:ring-blue-500'
          />
          <button 
            className='p-2 my-2 bg-clio_color hover:bg-blue-400 py-2 px-4 m-2 rounded-lg flex items-center justify-center' 
            onClick={handleSave}
          >
            Save and Send
          </button>
        </div>
        <input
          type="text"
          placeholder="Subject:"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className='p-2 mb-2 border border-gray-300 bg-white rounded-lg w-full focus:ring-blue-500'
        />
        {/* <ReactQuill
          theme="snow"
          value={editorContent}
          onChange={handleEditorChange}
          className='h-96'
        /> */}
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={handleEditorChange} // Track changes in content
          dangerouslySetInnerHTML={{ __html: editorContent }}
          className='html-render-container border p-4 bg-white rounded-lg' 
        />
      </div>
    </ContentContainer>
  );
};

export default EmailEditor;
