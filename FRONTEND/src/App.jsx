import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [captionType, setCaptionType] = useState('descriptive')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCaption, setGeneratedCaption] = useState('')
  const fileInputRef = useRef(null)

  const captionTypes = [
    { value: 'descriptive', label: 'Descriptive', icon: '📝' },
    { value: 'aesthetic', label: 'Aesthetic', icon: '✨' },
    { value: 'funny', label: 'Funny', icon: '😄' },
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'poetic', label: 'Poetic', icon: '🌟' },
    { value: 'casual', label: 'Casual', icon: '💬' }
  ]

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleGenerateCaption = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }
  
    setIsGenerating(true);
    setGeneratedCaption('');
  
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('captionType', captionType);
  
      const response = await axios.post(
        'http://localhost:3000/api/post',
        formData,
        { withCredentials: true }
      );
  
      setGeneratedCaption(response.data.caption);
    } catch (error) {
      console.error('Error generating caption:', error);
  
      if (error.response?.status === 401) {
        alert('Please log in to generate captions.');
      } else {
        alert(error.response?.data?.message ?? 'Failed to generate caption.');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">AI Caption Generator</h1>
          <p className="subtitle">Transform your images with AI-powered captions</p>
        </header>

        <div className="content">
          {/* Image Upload Section */}
          <div className="upload-section">
            {!imagePreview ? (
              <div
                className="upload-area"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon">📸</div>
                <p className="upload-text">
                  <span className="upload-text-bold">Click to upload</span> or drag and drop
                </p>
                <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="file-input"
                />
              </div>
            ) : (
              <div className="image-preview-container">
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button className="remove-image-btn" onClick={handleRemoveImage}>
                    ✕
                  </button>
                </div>
                <button
                  className="change-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="file-input"
                />
              </div>
            )}
          </div>

          {/* Caption Type Selection */}
          <div className="caption-type-section">
            <h2 className="section-title">Choose Caption Style</h2>
            <div className="caption-type-grid">
              {captionTypes.map((type) => (
                <button
                  key={type.value}
                  className={`caption-type-btn ${captionType === type.value ? 'active' : ''}`}
                  onClick={() => setCaptionType(type.value)}
                >
                  <span className="caption-type-icon">{type.icon}</span>
                  <span className="caption-type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            className={`generate-btn ${isGenerating ? 'generating' : ''}`}
            onClick={handleGenerateCaption}
            disabled={!selectedImage || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Caption
              </>
            )}
          </button>

          {/* Generated Caption Display */}
          {generatedCaption && (
            <div className="caption-result">
              <h3 className="result-title">Generated Caption</h3>
              <p className="result-text">{generatedCaption}</p>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(generatedCaption)
                  alert('Caption copied to clipboard!')
                }}
              >
                📋 Copy Caption
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App