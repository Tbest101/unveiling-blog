import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const quillRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', data.url);
      } catch (err) {
        console.error('Image upload failed', err);
        alert('Failed to upload image.');
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Uncategorized',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    content: '',
    published: false
  });

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      navigate('/admin');
      return;
    }
    
    if (!isNew) {
      fetch(`/api/posts?admin=true`)
        .then(res => res.json())
        .then(data => {
          const post = data.find(p => p._id === id || p.id === id);
          if (post) setFormData(post);
        });
    }
  }, [id, isNew, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Get the latest content from the editor
    const currentContent = quillRef.current.getEditor().root.innerHTML;
    const updatedFormData = { ...formData, content: currentContent };

    // Auto-extract first image from content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentContent;
    const firstImg = tempDiv.querySelector('img');
    
    if (firstImg) {
      updatedFormData.image = firstImg.getAttribute('src');
    }

    const url = isNew ? '/api/posts' : `/api/posts/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData)
      });
      
      if (res.ok) {
        navigate('/admin/dashboard');
      } else {
        const errorData = await res.json();
        alert(`Failed to save: ${errorData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save post. Please check if the server is running.');
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '800px' }}>
      <Link to="/admin/dashboard" style={{ display: 'inline-block', marginBottom: '2rem' }}>← Back to Dashboard</Link>
      <h2>{isNew ? 'Create New Post' : 'Edit Post'}</h2>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Title</label>
          <input 
            type="text" name="title" value={formData.title} onChange={handleChange} required
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--glass-bg)', color: 'var(--text-main)' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--glass-bg)', color: 'var(--text-main)' }}
            >
              <option value="Uncategorized">Select Category</option>
              <option value="MEMORIES FROM CHILDHOOD">MEMORIES FROM CHILDHOOD</option>
              <option value="PARENTING">PARENTING</option>
              <option value="RELATIONSHIPS">RELATIONSHIPS</option>
              <option value="GROWTH">GROWTH</option>
              <option value="FAITH">FAITH</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Date</label>
            <input 
              type="text" name="date" value={formData.date} onChange={handleChange} required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--glass-bg)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
           <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Content</label>
           <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
             <ReactQuill 
               ref={quillRef}
               theme="snow" 
               value={formData.content} 
               onChange={(val) => setFormData(prev => ({...prev, content: val}))} 
               modules={modules}
               style={{ height: '350px', border: 'none', color: 'var(--text-main)' }}
             />
           </div>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" name="published" checked={formData.published} onChange={handleChange} 
              style={{ transform: 'scale(1.2)' }}
            />
            Publish immediately (uncheck to keep as draft)
          </label>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>Save Post</button>
      </form>
    </div>
  );
};

export default Editor;
