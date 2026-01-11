
import React from 'react';

interface ImageCanvasProps {
  image: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  isProcessing: boolean;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ image, onUpload, label, isProcessing }) => {
  return (
    <div className="relative group w-full aspect-square max-w-md mx-auto bg-white rounded-[3rem] p-4 shadow-xl shadow-pink-100 border-8 border-white overflow-hidden transition-all hover:scale-[1.02]">
      {!image ? (
        <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-pink-50 transition-colors rounded-[2rem]">
          <div className="text-6xl mb-4 float">📸</div>
          <span className="text-lg font-bold text-gray-500">{label}</span>
          <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={isProcessing} />
        </label>
      ) : (
        <div className="relative h-full w-full rounded-[2rem] overflow-hidden">
          <img src={image} alt="Selected" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="bg-white/90 px-6 py-2 rounded-full cursor-pointer font-bold text-pink-500 shadow-md">
              Change Photo
              <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={isProcessing} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;
