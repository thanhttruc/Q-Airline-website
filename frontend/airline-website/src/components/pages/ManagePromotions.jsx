import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, AtomicBlockUtils } from 'draft-js';
import { Button, TextField } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, FormatColorText, InsertPhoto } from '@mui/icons-material';

const CreatePromotion = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState(''); // Lưu URL ảnh
  const [imagePreview, setImagePreview] = useState(null); // Hiển thị ảnh thu nhỏ
  const [descriptionLink, setDescriptionLink] = useState(null); // Lưu link mô tả

  // Hàm xử lý khi chọn kiểu chữ (Bold, Italic, Underline)
  const handleStyleClick = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Hàm xử lý khi thay đổi màu sắc chữ
  const handleColorClick = () => {
    const color = prompt("Nhập mã màu (ví dụ: #ff0000):");
    if (color) {
      setEditorState(RichUtils.toggleInlineStyle(editorState, `color-${color}`));
    }
  };

  // Hàm chèn ảnh vào mô tả
  const handleInsertImage = (imageUrl) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithImage = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: imageUrl });
    const entityKey = contentStateWithImage.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    setEditorState(newEditorState);
  };

  // Hàm xử lý khi nhập URL ảnh
  const handleInsertImageURL = () => {
    const url = prompt("Nhập URL ảnh:");
    if (url) {
      setImage(url);  // Lưu URL ảnh
      setImagePreview(url);  // Cập nhật ảnh thu nhỏ
      handleInsertImage(url); // Chèn ảnh vào mô tả
      alert("Ảnh URL đã được tải thành công!");
    }
  };

  // Hàm xử lý khi kéo thả ảnh
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileUrl = reader.result; // Đọc ảnh và tạo URL
        setImage(fileUrl);  // Lưu ảnh dưới dạng Base64
        setImagePreview(fileUrl); // Lưu hình ảnh thu nhỏ
        handleInsertImage(fileUrl); // Chèn ảnh vào mô tả

        // Thông báo ảnh tải lên thành công
        alert("Ảnh tải lên thành công!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm tạo link mô tả (Giả lập link không thể thay đổi)
  const createDescriptionLink = (contentState) => {
    const descriptionUrl = 'http://localhost:3002/admin/promotion' + new Date().getTime(); // Tạo link mô tả ngẫu nhiên
    setDescriptionLink(descriptionUrl); // Lưu link mô tả
    return descriptionUrl;
  };

  // Hàm lưu bài khuyến mãi
  const handleSave = async () => {
    const contentState = editorState.getCurrentContent();
    const descriptionURL = createDescriptionLink(contentState); // Tạo link mô tả

    const promotionData = {
      title,
      description: descriptionURL, // Gửi URL mô tả thay vì HTML
      start_date: startDate,
      end_date: endDate,
      image: image,  // Gửi ảnh dưới dạng URL
    };

    try {
      const response = await fetch('/admin/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Khuyến mãi đã được đăng thành công!');
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert('Lỗi khi gửi yêu cầu.');
      console.error(error);
    }
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

      {/* Khu vực kéo thả hoặc nhập URL ảnh */}
      <div 
        style={{
          border: '1px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px',
          minHeight: '100px',
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()} // Cho phép kéo thả
      >
        <Button variant="outlined" onClick={handleInsertImageURL} style={{ marginBottom: '10px' }}>
          Nhập URL ảnh
        </Button>
        <div>Hoặc kéo thả ảnh vào đây</div>
      </div>

      {/* Hiển thị ảnh thu nhỏ */}
      {imagePreview && (
        <div>
          <h4>Hình ảnh tải lên:</h4>
          <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginBottom: '20px' }} />
        </div>
      )}

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

      <div style={{ marginBottom: '20px', border: '1px dashed #ccc', padding: '10px' }}>
        <h3>Mô tả</h3>

        <div>
          <Button onClick={() => handleStyleClick('BOLD')} variant="outlined" style={{ marginRight: '10px' }}>
            <FormatBold />
          </Button>
          <Button onClick={() => handleStyleClick('ITALIC')} variant="outlined" style={{ marginRight: '10px' }}>
            <FormatItalic />
          </Button>
          <Button onClick={() => handleStyleClick('UNDERLINE')} variant="outlined" style={{ marginRight: '10px' }}>
            <FormatUnderlined />
          </Button>
          <Button onClick={handleColorClick} variant="outlined" style={{ marginRight: '10px' }}>
            <FormatColorText />
          </Button>
          <Button onClick={handleInsertImageURL} variant="outlined" style={{ marginRight: '10px' }}>
            <InsertPhoto />
          </Button>
        </div>

        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Nhập mô tả khuyến mãi tại đây..."
          style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}
        />
      </div>

      {/* Hiển thị URL mô tả */}
      {descriptionLink && (
        <div style={{ marginTop: '20px', fontSize: '16px' }}>
          <strong>Link mô tả của bạn: </strong>
          <a href={descriptionLink} target="_blank" rel="noopener noreferrer">{descriptionLink}</a>
        </div>
      )}

      <Button onClick={handleSave} variant="contained" color="primary">
        Đăng bài
      </Button>
    </div>
  );
};

export default CreatePromotion;
