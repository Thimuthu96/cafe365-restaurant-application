import React, {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  TextField,
  CircularProgress
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { collection, addDoc, query } from "firebase/firestore";
import { db } from "../../../services/firebase-config";
import { toast } from "react-toastify";

const AddTableDialog = (props) => {

  const theme1 = createTheme({
    palette: {
      secondary: {
        main: "#0E9E52",
      },
    },
  });

  const { open, onClose, title, fetchDataFunc } = props;
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dbRef = collection(db, "table");

  const handleChange = (event) => {
    setTableNumber(event.target.value);
  };

  const handleBlur = (event) => {
    const inputValue = event.target.value;

    if (!inputValue) {
      setError(true);
      setHelperText('Table number is required.');
    }else {
      setError(false);
      setHelperText('');
    }
  };

  const handleFunc = async () => {
    if(tableNumber != ''){
      //data
      const data = {
        TableNumber: tableNumber,
        Status: 'available',
      };

      setIsLoading(true);
      try{
        addDoc(dbRef, data);
        toast.success("Table added successfully!", {
          position: "bottom-right",
        });
        setIsLoading(false);
        onClose();
        fetchDataFunc();
      }catch(err){
        console.log(`Something went wrong : ${err}`);
        toast.error("Something went wrong!", {
          position: "bottom-right",
        });
        setIsLoading(false);
      }
    }
    else{
      console.log('#####');
      console.log('Validation error');
    }
  };

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{padding:2}}>
        <TextField
                id="outlined-basic"
                name="tabelNumber"
                label="Enter Table Number"
                variant="outlined"
                size="small"
                color="success"
                onChange={handleChange}
                onBlur={handleBlur}
                error={error}
                value={tableNumber}
                helperText={helperText}
              />
          {/* {desc} */}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>{
          setTableNumber('');
          onClose();
        }} color="success">
          Cancel
        </Button>
        <Button
          onClick={handleFunc}
          variant="contained"
          color="success"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="success" />
          ) : (
            'Add Table'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTableDialog;
