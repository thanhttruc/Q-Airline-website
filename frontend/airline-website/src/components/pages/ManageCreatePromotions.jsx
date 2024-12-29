import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, AtomicBlockUtils } from 'draft-js';
import { Button, TextField, Popover } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, FormatColorText, InsertPhoto } from '@mui/icons-material';
import { stateToHTML } from 'draft-js-export-html';
import { v4 as uuidv4 } from 'uuid';
import { SketchPicker } from 'react-color'; // Import SketchPicker từ react-color

const CreatePromotion = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState(''); // Lưu URL ảnh
  const [imagePreview, setImagePreview] = useState(null); // Hiển thị ảnh thu nhỏ
  const [descriptionLink, setDescriptionLink] = useState(null); // Lưu link mô tả
  const [anchorEl, setAnchorEl] = useState(null); // Điều khiển hiển thị bảng chọn màu
  const [color, setColor] = useState('#000000'); // Màu mặc định cho chữ

  // Hàm xử lý khi chọn kiểu chữ (Bold, Italic, Underline)
  const handleStyleClick = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Hàm xử lý khi chọn màu sắc chữ
  const handleColorClick = (event) => {
    setAnchorEl(event.currentTarget); // Hiển thị bảng chọn màu
  };

  // Hàm xử lý khi chọn màu trong bảng chọn
  const handleColorChange = (color) => {
    setColor(color.hex); // Cập nhật màu khi người dùng chọn
    const colorStyle = `COLOR-${color.hex.replace('#', '')}`; // Tạo kiểu màu inline
    setEditorState(RichUtils.toggleInlineStyle(editorState, colorStyle)); // Áp dụng màu vào editor
  };

  // Đóng bảng chọn màu khi click ra ngoài
  const handleClose = () => {
    setAnchorEl(null);
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

  // Hàm chuyển nội dung EditorState thành HTML
  const convertToHTML = (contentState) => {
    return stateToHTML(contentState);  // Dùng thư viện để chuyển thành HTML
  };

  // Hàm lưu mô tả và lấy URL bài viết
  const saveEditorContent = async () => {
    const contentState = editorState.getCurrentContent();
    const descriptionHTML = convertToHTML(contentState);  // Chuyển nội dung thành HTML

    // Tạo bài viết mới, lấy ID từ UUID hoặc bất kỳ cách tạo ID khác
    const postId = uuidv4();  // Giả sử bạn sử dụng uuid để tạo ID bài viết
    const postUrl = `http://localhost:3002/post/${postId}`;  // URL bài viết

    // Lưu URL của bài viết
    setDescriptionLink(postUrl);

    // Giả sử bạn lưu thông tin bài viết vào database (có thể dùng backend thực sự ở đây)
    localStorage.setItem(postId, JSON.stringify({ title, content: descriptionHTML, id: postId }));

    // Thông báo cho người dùng biết đã tạo thành công
    alert("Mô tả đã được lưu và URL bài viết đã được tạo.");
  };

  // Hàm tạo bài khuyến mãi
  const handleCreatePromotion = async () => {
    if (!descriptionLink) {
      alert("Vui lòng lưu mô tả trước!");
      return;
    }

    const promotionData = {
      title,
      description: descriptionLink, // Gửi URL mô tả thay vì HTML
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
          style={{ border: '1px solid #ccc', padding: '10px', minHeight: '500px' }}
        />
      </div>

      {/* Hiển thị bảng chọn màu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <SketchPicker color={color} onChange={handleColorChange} />
      </Popover>

      {/* Hiển thị URL mô tả dưới dạng không thể chỉnh sửa */}
      {descriptionLink && (
        <div style={{ marginTop: '20px', fontSize: '16px', backgroundColor: '#f0f0f0', padding: '10px', color: '#555' }}>
          <strong>Link mô tả của bạn: </strong>
          <span>{descriptionLink}</span>
        </div>
      )}

      {/* Nút Save cho Editor */}
      <Button onClick={saveEditorContent} variant="contained" color="secondary" style={{ padding: '12px 24px', marginRight: '16px' }} >
        Lưu Mô Tả
      </Button>

      {/* Nút Create Promotion */}
      <Button onClick={handleCreatePromotion} variant="contained" color="primary" style={{ padding: '12px 24px' }}>
        Đăng bài
      </Button>
    </div>
  );
};

export default CreatePromotion;
