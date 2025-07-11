import React from 'react'

export default function PictureUpload() {
  const [file, setFile] = React.useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('/assets/default-avatar.png')
  const handleImageChange = (e) => {
    e.preventDefault()
    const reader = new FileReader()
    const newFile = e.target.files[0]
    reader.onloadend = () => {
      setFile(newFile)
      setImagePreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }
  // eslint-disable-next-line
  const handleSubmit = e => {
    e.preventDefault()
    // this.state.file is the file/image uploaded
    // in this function you can save the image (this.state.file) on form submit
    // you have to call it yourself
  }
  return (
    <div className="picture-container">
      <div className="picture">
        <img src={imagePreviewUrl} className="picture-src" alt="..." />
        <input type="file" onChange={(e) => handleImageChange(e)} />
      </div>
      <h6 className="description">Choose Picture</h6>
    </div>
  )
}
