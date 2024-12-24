import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import axios from "axios";

const ProductImage = ({
  imageFile,
  setImageFile,
  
  uploadedImageUrl,
  setUploadedUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling= false,
}) => {
  const inputRef = useRef(null);

  function handleChangeImage(event) {
   
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
    }
  }
 

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }





  async function uploadImageToCloudinary(){  
    setImageLoadingState(true);
    const data = new FormData();
    data.append('my_file', imageFile);
    const response = await axios.post(`https://erika.enagickangenwater.org/api/admin/products/upload-image`,data);

    
   
   
    if(response?.data?.succes) {setUploadedUrl(response.data.result.url);
      
     
      setImageLoadingState(false);
    }
  }

  useEffect(()=>{
    if(imageFile !==null) uploadImageToCloudinary()
  }, [imageFile])

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? '': ' max-w-md max-auto'}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? 'opacity-60' : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          ref={inputRef}
          onChange={handleChangeImage}
          className="hidden"
          disabled = {isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={` ${isEditMode ? " cursor-not-allowed": ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span> Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <FileIcon className=" w-8 text-primary mr-2 h-8 " />
            </div>
            <p className="text-sm font-medium"> {imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground "
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only"> Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImage;
