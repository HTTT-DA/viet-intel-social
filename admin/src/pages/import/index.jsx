import { Grid, Typography, Button, Box, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import Papa from 'papaparse';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { importUser, importQuestion, importAnswer, exportErrorCSV } from '@/api-services/unified';
import CustomAlert from '../../components/alert'



function CsvImport() {
    const fileInputRef = useRef();
    const [csvFile, setCsvFile] = useState();
    const [fileName, setFileName] = useState();
    const [uploading, setUploading] = useState(false);
    const [alertState, setAlertState] = useState({ open: false, message: '' });
    const [selectedField, setSelectedField] = useState("");
    const [failedImportLines, setFailedImportLines] = useState([]);




    const fieldRequirements = {
        user: ['line_number', 'email', 'password', 'name', 'display_name', 'role', 'gender'],
        question: ['line_number', 'content', 'category_id', 'user_id'],
        answer: ['line_number', 'content', 'user_id', 'question_id'],
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
                case 'answer':
                    response = await importAnswer(csvFile);
                    break;
                default:
                    setAlertState({ open: true, message: "Invalid field selected", severity: "error" });
                    setUploading(false);
                    return;
            }
            
            if (response.status === 200) {
                if (response.data.length > 0) {
                    setFailedImportLines(response.data || []);
                    const exportResponse = await exportErrorCSV(response.data);
                    
                    if (exportResponse) {
                        const blob = new Blob([exportResponse], { type: 'text/csv' });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = 'error_lines.csv';
                        link.click();
                    } 
                    setAlertState({ open: true, message: "Successfully uploaded with errors", severity: "info" });

                } else if (response.data.length === 0) {
                    setAlertState({ open: true, message: "Successfully uploaded with no errors", severity: "success" });
                }
            } else if (response || response.status !== 200) {
                setAlertState({ open: true, message: "Error: " + response.message, severity: "error" });
            }
        } catch (error) {
            setAlertState({ open: true, message: "An error occurred: " + response.message, severity: "error" });
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
                >
                    {failedImportLines.length > 0 && (
                        <Typography variant="subtitle2" style={{ marginTop: 10 }}>
                            A CSV containing the error lines has been downloaded. Please review it for more details.
                        </Typography>
                    )}
                </CustomAlert>
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
                                        <MenuItem value={"answer"}>Answer</MenuItem>
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
