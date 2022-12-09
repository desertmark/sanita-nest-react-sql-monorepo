import { Box, Button, TextField, Typography as Text } from "@mui/material";
import React, {
  ChangeEventHandler,
  FC,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

export interface FileFiledPorps {
  label?: string;
  emptyText?: string;
  buttonText?: string;
  onChange: (files: FileList) => void;
  accept?: string;
  ref?: any;
}

export const FileField: FC<FileFiledPorps> = forwardRef(
  (
    {
      emptyText = "Ningun archivo seleccionado",
      buttonText = "Seleccionar",
      onChange,
      accept,
      label,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>(emptyText);

    useImperativeHandle(ref, () => ({
      reset() {
        if (inputRef?.current) {
          inputRef.current.value = "";
        }
        setFileName(emptyText);
      },
    }));
    return (
      <Box display="flex" flexDirection="column">
        <Box display="flex" style={{ gap: 16 }}>
          <TextField
            size="small"
            disabled={true}
            value={fileName}
            style={{ width: 300 }}
          />
          <input
            type="file"
            hidden
            ref={inputRef}
            onChange={(e) => {
              setFileName(e.target.files?.[0]?.name || emptyText);
              onChange!(e.target.files!);
            }}
            accept={accept}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => inputRef.current?.click()}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    );
  }
);

// export const FileField: FC<FileFiledPorps> = ({
//   emptyText = "Ningun archivo seleccionado",
//   buttonText = "Seleccionar",
//   onChange,
//   accept,
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [fileName, setFileName] = useState<string>(emptyText);
//   return (
//     <Box display="flex" style={{ gap: 16 }}>
//       <TextField
//         size="small"
//         disabled={true}
//         value={fileName}
//         style={{ width: 300 }}
//       />
//       <input
//         type="file"
//         hidden
//         ref={inputRef}
//         onChange={(e) => {
//           setFileName(e.target.files?.[0]?.name || emptyText);
//           onChange!(e.target.files!);
//         }}
//         accept={accept}
//       />
//       <Button
//         variant="contained"
//         size="small"
//         onClick={() => inputRef.current?.click()}
//       >
//         {buttonText}
//       </Button>
//     </Box>
//   );
// };
