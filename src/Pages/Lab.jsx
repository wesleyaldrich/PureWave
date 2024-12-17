import './lab.css'; 

function Lab() {
    return (
        <div className="lab-page container-fluid">
            <h1 className="title firacode">LABORATORY</h1>
            <div className="buttons container-fluid row gurajada">
                <div className="button col-4">
                    <span className="iconHistory">+</span>
                    <a>ENHANCE YOUR AUDIO</a>
                </div>
            </div>

            <div className='container-upload cons'>
                <div className="upload-container">

                     <div className='container-icon iconn'>
                        <img src="upload.png" alt=""/>
                     </div>

                    <span>Choose a file or drag it here</span>
                    <span>Supported formats: .mp3, .wav</span>
                    <button className="upload-button">Upload Audio</button>
                </div>
            </div>

            
            {/* Tombol login/signup di sudut bawah kanan */}
            <div className="login-signup">
                LOGIN / SIGNUP
            </div>
        </div>
    );
}

export default Lab;
