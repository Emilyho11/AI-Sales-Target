import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ContentContainer from '../components/ContentContainer';
import { apiInstance } from "../../axiosConfig";
import { useLocation } from 'react-router-dom';

const EmailEditor = () => {
  const [editorContent, setEditorContent] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('Transform Your Practice with Clio');
  const location = useLocation();
  const { sender, recipientName, pitch } = location.state || { sender: "", recipientName: "there", pitch: "" };
  const [newEmail, setNewEmail] = useState(false);

  const formatPitchToHtml = (pitch) => {
    // Replace '**Heading**' with bolded HTML
    pitch = pitch.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Add <p> tags around paragraphs
    pitch = pitch.replace(/\n\n/g, "</p><p>"); // Separate double new lines as paragraph
    pitch = `<p>${pitch.replace(/\n/g, "<br>")}</p>`; // Add line breaks within paragraphs
    
    // Format numbered lists
    pitch = pitch.replace(/<li>.*<\/li>/g, "<ol>$&</ol>"); // Wrap the entire list in <ol>

    // If there is a "Subject" line, add it to the email subject
    const subjectRegex = /Subject: (.[^<]*)/; // Match the subject line
    const subjectMatch = pitch.match(subjectRegex);

    if (subjectMatch) {
      setEmailSubject(subjectMatch[1]);
      pitch = pitch.replace(subjectRegex, ''); // Remove the subject line from the pitch
    }
    
    return pitch;
  };

  useEffect(() => {
    setRecipientEmail(location.state?.recipientEmail || "emily.ho@clio.com"); // Initialize recipientEmail

    // Load the HTML template if it's not a new email
    if (!newEmail && !pitch) {
      const loadTemplate = async () => {
        try {
          const response = await apiInstance.get(`/email-template?name=${recipientName}`);
          setEditorContent(response.data);
        } catch (error) {
          console.error('Error loading email template:', error.message);
        }
      };
      loadTemplate();
    }
    else if (pitch) {
      const formattedPitch = formatPitchToHtml(pitch);
      setEditorContent(formattedPitch);
      setNewEmail(true);
    }
  }, [recipientName, location.state, newEmail, pitch]);

  // Track changes in ReactQuill for new email content
  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  const handleEmailChange = (event) => {
    setRecipientEmail(event.target.value);
  };

  const handleSubjectChange = (event) => {
    event.preventDefault();
    setEmailSubject(event.target.value);
  };

  const handleCreateNew = () => {
    setEditorContent('');
    setEmailSubject('');
    setNewEmail(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const emailData = {
      subject: emailSubject,
      text: editorContent,
      to: recipientEmail,
      from: "emily.ho@clio.com",
      name: recipientName,
    };

    // Print all values
    console.log('Email data:', emailData);

    try {
      const response = await apiInstance.post(`/send-email`, emailData);
      console.log('Email sent:', response.data);
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
      alert('Failed to send email');
    }
  };

  console.log('Email:', recipientEmail);

  return (
    <ContentContainer className="flex justify-center items-center">
      <div className='w-2/3'>
      <form onSubmit={handleSave}>
          <div className='flex'>
            <input
              type="email"
              placeholder="To:"
              value={recipientEmail}
              required
              onChange={handleEmailChange}
              className='p-2 my-2 border border-gray-300 bg-white rounded-lg focus:ring-blue-500'
            />
            <button
              type="button"
              className='p-2 my-2 bg-red-500 hover:bg-red-400 py-2 px-4 m-2 rounded-lg flex items-center justify-center w-[120px]'
              onClick={handleCreateNew}
            >
              Create New
            </button>
            <button 
              type="submit"
              className='p-2 my-2 bg-clio_color hover:bg-blue-400 py-2 px-4 m-2 rounded-lg flex items-center justify-center w-[120px]' 
            >
              Send
            </button>
          </div>
          <input
            type="text"
            placeholder="Subject:"
            value={emailSubject}
            required
            onChange={handleSubjectChange}
            className='p-2 mb-2 border border-gray-300 bg-white rounded-lg w-full focus:ring-blue-500'
          />
        </form>
        {newEmail ? (
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={handleEditorChange}
            className='email-container border p-4 bg-white rounded-lg'
          />
        ) : (
          <div
            contentEditable
            suppressContentEditableWarning
            className='html-render-container border p-4 bg-white rounded-lg'
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        )}
      </div>
    </ContentContainer>
  );
};

export default EmailEditor;
