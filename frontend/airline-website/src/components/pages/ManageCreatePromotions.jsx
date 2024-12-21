import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { Button, TextField } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, FormatColorText, InsertPhoto } from '@mui/icons-material';
import { stateToHTML } from 'draft-js-export-html';

const CreatePromotion = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [descriptionLink, setDescriptionLink] = useState(null);

  const handleStyleClick = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Hàm save content và gửi lên server
  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState); // Chuyển nội dung thành HTML
  
    // Gửi nội dung HTML dưới dạng JSON
    fetch('/admin/create-html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Đảm bảo đúng header
      },
      body: JSON.stringify({ descriptionHTML: html }), // Gửi HTML vào body
    })
      .then(response => response.json())
      .then(data => {
        if (data.pageUrl) {
          setDescriptionLink(data.pageUrl); // Nhận URL của trang HTML
          console.log('File uploaded successfully:', data.pageUrl);
        } else {
          console.error('No URL received:', data);
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };
  
  return (
    <div>
      <h2>Đăng bài khuyến mãi</h2>

      <TextField
        label="Tiêu đề"
        fullWidth
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <TextField
        label="Ngày bắt đầu"
        type="date"
        fullWidth
        variant="outlined"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <TextField
        label="Ngày kết thúc"
        type="date"
        fullWidth
        variant="outlined"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <div style={{ marginBottom: '20px' }}>
        <Button onClick={() => handleStyleClick('BOLD')} variant="outlined" style={{ marginRight: '10px' }}>
          <FormatBold />
        </Button>
        <Button onClick={() => handleStyleClick('ITALIC')} variant="outlined" style={{ marginRight: '10px' }}>
          <FormatItalic />
        </Button>
        <Button onClick={() => handleStyleClick('UNDERLINE')} variant="outlined" style={{ marginRight: '10px' }}>
          <FormatUnderlined />
        </Button>
        <Button onClick={() => handleStyleClick('COLOR')} variant="outlined" style={{ marginRight: '10px' }}>
          <FormatColorText />
        </Button>
      </div>

      <div>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Nhập mô tả khuyến mãi tại đây..."
          style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}
        />
      </div>

      <Button onClick={saveContent} variant="contained" color="secondary" style={{ marginTop: '20px' }}>
        Lưu Mô Tả
      </Button>

      {descriptionLink && (
        <div style={{ marginTop: '20px', fontSize: '16px', backgroundColor: '#f0f0f0', padding: '10px' }}>
          <strong>Link mô tả của bạn: </strong>
          <a href={descriptionLink} target="_blank" rel="noopener noreferrer">{descriptionLink}</a>
        </div>
      )}
    </div>
  );
};

export default CreatePromotion;
