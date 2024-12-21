import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { Button, TextField } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, FormatColorText, InsertPhoto } from '@mui/icons-material';
import { stateToHTML } from 'draft-js-export-html';

const EditorPage = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState("");

  // Hàm để thay đổi trạng thái của Editor
  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  // Hàm để xử lý các công cụ định dạng văn bản (bold, italic, underline)
  const handleBold = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };
  
  const handleItalic = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const handleUnderline = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  // Hàm lưu nội dung của editor dưới dạng HTML
  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState); // Chuyển nội dung sang HTML
    setHtmlContent(html);
    
    // Tạo file HTML và link tải
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Tạo liên kết và kích hoạt tải xuống
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor-content.html'; // Đặt tên cho file HTML
    a.click();
    URL.revokeObjectURL(url); // Giải phóng URL sau khi tải
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={handleBold} startIcon={<FormatBold />}>Bold</Button>
        <Button onClick={handleItalic} startIcon={<FormatItalic />}>Italic</Button>
        <Button onClick={handleUnderline} startIcon={<FormatUnderlined />}>Underline</Button>
        {/* Các công cụ khác có thể thêm vào đây */}
      </div>

      <div style={{ border: '1px solid #ccc', minHeight: '200px', marginBottom: '20px', padding: '10px' }}>
        <Editor 
          editorState={editorState} 
          onChange={handleEditorChange} 
        />
      </div>

      <Button variant="contained" color="primary" onClick={saveContent}>
        Save Content
      </Button>

      {/* Hiển thị nội dung HTML nếu cần thiết */}
      {htmlContent && (
        <div style={{ marginTop: '20px' }}>
          <TextField
            label="HTML Content"
            multiline
            rows={6}
            variant="outlined"
            fullWidth
            value={htmlContent}
            disabled
          />
        </div>
      )}
    </div>
  );
};

export default EditorPage;
