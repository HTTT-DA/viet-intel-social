import { Grid, Typography, Button, Box, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import Papa from 'papaparse';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { importUser, importQuestion } from '@/api-services/unified';
import CustomAlert from '../../components/alert'



function CsvImport() {
    const fileInputRef = useRef();
    const [csvFile, setCsvFile] = useState();
    const [fileName, setFileName] = useState();
    const [uploading, setUploading] = useState(false);
    const [alertState, setAlertState] = useState({ open: false, message: '' });
    const [selectedField, setSelectedField] = useState("");

    const fieldRequirements = {
        user: ['id', 'email', 'password', 'name', 'display_name', 'role', 'gender'],
        question: ['id', 'content', 'category_id', 'user_id'],
        answer: ['id', 'content', 'reference', 'image', 'user_id', 'question_id'],
    };

    const requiredFields = fieldRequirements[selectedField] || [];

    const handleFileChosen = (file) => {
        setCsvFile(file);
        setFileName(file.name);
        const fileReader = new FileReader();
        fileReader.readAsText(file);
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChosen(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFieldChange = (event) => {
        setSelectedField(event.target.value);
    };

    const handleImport = async () => {
        if (!csvFile) {
            setAlertState({ open: true, message: "No file selected", severity: "warning" });
            return;
        }
    
        if (!selectedField) {
            setAlertState({ open: true, message: "No field selected", severity: "warning" });
            return;
        }
    
        setUploading(true);
    
        let response;
        try {
            switch (selectedField) {
                case 'user':
                    response = await importUser(csvFile);
                    break;
                case 'question':
                    response = await importQuestion(csvFile);
                    break;
                default:
                    setAlertState({ open: true, message: "Invalid field selected", severity: "error" });
                    setUploading(false);
                    return;
            }
    
            if (response && response.status === 200) {
                setAlertState({ open: true, message: "Successfully uploaded", severity: "success" });
            } else {
                setAlertState({ open: true, message: "Error uploading", severity: "error" });
            }
        } catch (error) {
            setAlertState({ open: true, message: "An error occurred", severity: "error" });
        }

        setUploading(false);

    };
    


    return (
        <div>
            <h1 style={{ color: "#243c64" }}>Import</h1>
            {alertState.open && (
                <CustomAlert
                    message={alertState.message}
                    severity={alertState.severity}
                    onClose={() => setAlertState({ open: false, message: '', severity: 'success' })}
                />
            )}
            <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1}>
                <Grid container spacing={1}>
                    <Grid item xs={6} sm={6}>
                        <Grid container spacing={1} p={1} m={0.5}>
                            <Grid item xs={6} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="field-select-label">Choose field</InputLabel>
                                    <Select
                                        labelId="field-select-label"
                                        id="field-select"
                                        value={selectedField}
                                        onChange={handleFieldChange}
                                    >
                                        <MenuItem value={"user"}>User</MenuItem>
                                        <MenuItem value={"question"}>Question</MenuItem>
                                        <MenuItem value={"question"}>Answer</MenuItem>
                                    </Select>
                                </FormControl>   
                            </Grid> 
                            <Grid item xs={12} sm={12} p={1} m={2}>
                                {selectedField &&<Typography variant="h6">Make sure your csv file has these required fields</Typography>}
                                    <ul>
                                        {requiredFields.map(field => (
                                            <li key={field}>{field}</li>
                                        ))}
                                    </ul>
                            </Grid>
                        </Grid>    
                    </Grid>
                    <Grid item xs={5} sm={5} m={1} mx={4}>
                        <Box
                            style={{
                                border: '2px dashed #ccc',
                                borderRadius: '5px',
                                padding: 2,
                                textAlign: 'center',
                                cursor: 'pointer',
                                minHeight: '150px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column'
                            }}
                            onClick={handleClick}
                            onDrop={handleFileDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {!fileName && <Typography>Drop your file CSV here or click to choose</Typography>}
                            {fileName && <Typography>{fileName}</Typography>}
                        </Box>
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            accept=".csv"
                            onChange={(e) => handleFileChosen(e.target.files[0])}
                        />
                        <Box
                        display="flex"
                        justifyContent="flex-end"
                        m={2}
                        p={1}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleImport}
                            >
                                Import
                            </Button>
                        </Box>
                    </Grid>
                </Grid>                
            </Box>
        </div>
    );
}

export default CsvImport;
