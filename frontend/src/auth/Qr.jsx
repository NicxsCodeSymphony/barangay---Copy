import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QRCodeScanner = () => {
  const [qrResult, setQrResult] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [timer, setTimer] = useState(3); 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const navigate = useNavigate(); 
  const [qrScanned, setQrScanned] = useState(false); 
  const [token, setToken] = useState(null);
  const [cameraPermissionError, setCameraPermissionError] = useState(false); 

  const [auth, setAuth] = useState(null);

  const fetch = async (token) => {
    if (!token) return;

    try {
      const res = await axios.get('http://localhost/barangay/backend/official/fetchOfficialById.php?official_id=' + token);
      const data = res.data;
      if (data) {
        setAuth(data.qr_code); // Set the auth QR code
      }
    } catch (err) {
      console.error('Error fetching official data:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('qr');
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch(token); // Fetch official data when token changes
    }
  }, [token]);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera: ', err);
        if (err.name === 'NotAllowedError') {
          setCameraPermissionError(true); 
        } else {
          alert('An error occurred while trying to access the camera.');
        }
      }
    };

    setupCamera();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let countdown; 

    if (qrScanned) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            console.log("QR scan success within 5 seconds!");
            setQrScanned(false);
            setTimer(3);
            if (token) {
              localStorage.setItem('token', JSON.stringify(token));
            }
            localStorage.removeItem('qr');
            window.location.href = "/admin/dashboard";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdown); 
    };
  }, [qrScanned]);

  useEffect(() => {
    const detectQRCode = () => {
      if (!scanning) return;

      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { videoWidth, videoHeight } = video;

        if (videoWidth > 0 && videoHeight > 0) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;

          ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

          try {
            const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);
            const code = window.jsQR(imageData.data, videoWidth, videoHeight);

            if (code) {
              if (code.data === auth) {
                setQrScanned(true);
              }
              return;
            } else {
              setQrResult(null);
            }
          } catch (err) {
            console.error('Error detecting QR code:', err);
          }
        }
      }

      requestAnimationFrame(detectQRCode);
    };

    detectQRCode(); 
  }, [scanning, auth]);  // Add auth to the dependency array for detecting QR codes

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center text-white max-w-4xl w-full p-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold mb-6">QR Code Scanner</h1>
        {/* Show an error message if camera permission is denied */}
        {cameraPermissionError ? (
          <div className="text-red-500 mb-4">
            <p>Camera access was denied. Please enable camera access in your browser settings.</p>
          </div>
        ) : null}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="100%"
          height="auto"
          className="rounded-lg border-2 border-gray-500"
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} width="800" height="600" />
        
        {qrScanned && (
          <div className="mt-6 bg-teal-600 text-white rounded-md p-4">
            <h2 className="text-xl font-medium">QR Code Scanned!</h2>
            <p>Processing... {timer} seconds left.</p>
          </div>
        )}

        {qrResult && (
          <div className="mt-6 bg-green-600 text-white rounded-md p-4">
            <h2 className="text-xl font-medium">QR Code Result:</h2>
            <p>{qrResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;
