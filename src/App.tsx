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
    <div className="box">
      <h2 className="header">React drop files input</h2>
      <DropFileInput
        onFileChange={(files: FileType[]) => onFileChange(files)}
      />
    </div>
  );
}

export default App;
