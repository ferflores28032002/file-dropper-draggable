import { useRef, useState } from "react";

import { toast, ToastContainer } from "react-toastify";

import { ImageConfig } from "../../Config/imageConfig";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

import "react-toastify/dist/ReactToastify.css";
import "./drop-file-input.css";

interface DropFileInputProps {
  onFileChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  multiple?: boolean;
}

const defaultAcceptedFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const DropFileInput: React.FC<DropFileInputProps> = (props) => {
  const {
    onFileChange,
    maxFiles = 8,
    multiple = true,
    acceptedFileTypes = defaultAcceptedFileTypes,
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [fileList, setFileList] = useState<File[]>([]);

  const onDragEnter = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add("dragover");
    }
  };

  const onDragLeave = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };

  const onDrop = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);

    if (newFiles.length > 0) {
      const filteredFiles = newFiles.filter((newFile) => {
        const isDuplicate = fileList.some(
          (file) => file.name === newFile.name && file.type === newFile.type
        );

        if (isDuplicate) {
          toast.error(`El archivo ${newFile.name} ya fue agregado.`);
          return false;
        }

        if (!acceptedFileTypes.includes(newFile.type)) {
          toast.error(`Tipo de archivo no permitido: ${newFile.name}.`);
          return false;
        }

        return true;
      });

      if (fileList.length + filteredFiles.length > maxFiles) {
        toast.error(`Solo puedes subir hasta ${maxFiles} archivos.`);
      } else {
        const updatedList = [...fileList, ...filteredFiles];
        setFileList(updatedList);
        onFileChange(updatedList);
      }
    }

    e.target.value = "";
  };

  const fileRemove = (file: File) => {
    const updatedList = fileList.filter((item) => item !== file);
    setFileList(updatedList);
    onFileChange(updatedList);
  };

  const getImageSrc = (type: string) => {
    const fileType = type.split("/")[1];
    if (fileType && fileType in ImageConfig) {
      return ImageConfig[fileType as keyof typeof ImageConfig];
    }
    return ImageConfig["default"];
  };

  return (
    <div>
      <ToastContainer /> {/* Contenedor de toast */}
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="upload" />
          <p>Seleciona o arrastra los archivos aquí</p>
        </div>
        <input type="file" onChange={onFileDrop} multiple={multiple} />
      </div>
      {fileList.length > 0 && (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">
            Archivos seleccionados ({fileList.length})
          </p>
          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img src={getImageSrc(item.type)} alt="type-file" />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropFileInput;
