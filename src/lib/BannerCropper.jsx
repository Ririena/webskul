import React, { useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';

const BannerCropper = ({ image, onCropDone, onCropCancel }) => {
  const cropperRef = useRef(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [aspectRatio] = React.useState(3/2); // Aspect ratio of 1 for a round profile picture

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCrop = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imageElement = new Image();
    imageElement.src = image;
    imageElement.onload = () => {
      canvas.width = croppedArea.width;
      canvas.height = croppedArea.height;
      ctx.drawImage(
        imageElement,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height
      );
      const croppedImage = canvas.toDataURL('image/jpeg');
      onCropDone(croppedImage);
    };
  };

  return (
    <div className="relative w-full h-full">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        style={{ containerStyle: { width: '100%', height: '100%' } }}
      />
      <div className="absolute bottom-4 right-4 flex gap-4">
        <Button variant="outline" onClick={onCropCancel}>
          Cancel
        </Button>
        <Button variant="outline" onClick={handleCrop}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default BannerCropper;