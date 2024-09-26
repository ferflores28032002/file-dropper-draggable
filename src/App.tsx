import DropFileInput from "./components/Drop-file-input/DropFileInput";

interface FileType {
  name: string;
  size: number;
  type: string;
}

function App() {
  const onFileChange = (files: FileType[]) => {
    console.log(files);
  };

  return (
    <div className="box-file-dropper-draggable">
      <DropFileInput
        onFileChange={(files: FileType[]) => onFileChange(files)}
      />
    </div>
  );
}

export default App;
