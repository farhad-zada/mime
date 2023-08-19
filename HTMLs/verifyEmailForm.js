module.exports = (url) => {
  const html = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        text-align: center;
        padding: 20px;
      }
      h2 {
        color: #333;
      }
      p {
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <h2>Verify email</h2>
    <p>You can use this link for verify your accaount</p> 
    <p class="verification-code"><a href="${url}">${url}<a></p>
  <img src="https://static.vecteezy.com/system/resources/thumbnails/022/645/609/small/skull-devil-cyborg-samurai-face-3d-rendering-generate-ai-photo.jpeg" alt="">
  
  </body>
  </html>
  `
  return html
}
