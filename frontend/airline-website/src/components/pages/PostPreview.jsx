import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';  // Import AuthContext

const PostPreview = () => {
  const { id } = useParams();  // Lấy ID từ URL
  const { user, dispatch, loading, error } = useContext(AuthContext); // Sử dụng useContext để lấy giá trị từ AuthContext
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!user) {
      const adminUser = { username: 'admin00', password: 'admin00' };
      dispatch({ type: 'LOGIN_SUCCESS', payload: adminUser });
      console.log('Đăng nhập tự động với tài khoản admin00');
    }

    // Lấy bài viết từ localStorage hoặc sessionStorage
    const storedPost = localStorage.getItem(id) || sessionStorage.getItem(id);

    if (storedPost) {
      setPost(JSON.parse(storedPost));  // Lưu trữ bài viết vào state
    } else {
      console.error("Không tìm thấy bài viết.");
    }
  }, [id, user, dispatch]); // Thêm user và dispatch vào dependency array

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Không tìm thấy bài viết!</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{post.title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          minHeight: '300px',
        }}
      />
    </div>
  );
};

export default PostPreview;
