import React, { useState } from 'react';
import { ProductImage } from '../../types';
import { UploadCloud, X, Star, MoveUp, MoveDown } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('Configure VITE_CLOUDINARY_CLOUD_NAME no arquivo .env');
    }

    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Configure VITE_CLOUDINARY_UPLOAD_PRESET no arquivo .env para habilitar upload unsigned do Cloudinary');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'nexerp/products');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Falha ao enviar imagem: ${error}`);
    }

    const data = await response.json() as { secure_url?: string };

    if (!data.secure_url) {
      throw new Error('Cloudinary não retornou a URL da imagem.');
    }

    return data.secure_url;
  };

  const simulateCloudinaryUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const uploadedImages: ProductImage[] = [];

      for (let index = 0; index < fileArray.length; index += 1) {
        const file = fileArray[index];
        const url = await uploadToCloudinary(file);
        uploadedImages.push({
          id: `img-${Date.now()}-${index}`,
          url,
          name: file.name,
          isMain: images.length === 0 && index === 0,
          order: images.length + index,
        });

        setUploadProgress(Math.min(95, 10 + ((index + 1) / fileArray.length) * 80));
      }

      onChange([...images, ...uploadedImages]);
      setUploadProgress(100);
      toast.success(`${fileArray.length} imagem(ns) enviada(s) com sucesso para o Cloudinary.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro no upload da imagem';
      toast.error(message);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 600);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      void simulateCloudinaryUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void simulateCloudinaryUpload(e.target.files);
    }
  };

  const handleRemove = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
      filtered[0].isMain = true;
    }
    onChange(filtered);
  };

  const handleSetMain = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isMain: img.id === id,
    }));
    onChange(updated);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;

    copy.forEach((img, i) => (img.order = i));
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />

        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Arraste imagens aqui ou <span className="text-blue-600 dark:text-blue-400 underline">clique para selecionar</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Suporta PNG, JPG, WEBP e GIF. Upload real via Cloudinary.
            </p>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-1.5 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex justify-between text-xs font-semibold text-blue-700 dark:text-blue-300">
            <span>Enviando para o Cloudinary...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Imagens Cadastradas ({images.length}):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-900 shadow-xs"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {img.isMain && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-md shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Principal
                  </span>
                )}

                <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                  {!img.isMain && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-7 h-7 bg-white/90 text-amber-600 hover:bg-amber-500 hover:text-white"
                      title="Definir como Principal"
                      onClick={() => handleSetMain(img.id)}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </Button>
                  )}

                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-7 h-7 bg-white/90 text-slate-800 hover:bg-slate-200"
                    disabled={index === 0}
                    title="Mover para Cima"
                    onClick={() => handleMoveOrder(index, 'up')}
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-7 h-7 bg-white/90 text-slate-800 hover:bg-slate-200"
                    disabled={index === images.length - 1}
                    title="Mover para Baixo"
                    onClick={() => handleMoveOrder(index, 'down')}
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="danger"
                    className="w-7 h-7"
                    title="Remover"
                    onClick={() => handleRemove(img.id)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
