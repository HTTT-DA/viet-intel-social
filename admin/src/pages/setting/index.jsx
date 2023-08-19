import React, { useState, useEffect  } from "react";
import { Switch, Typography, Box } from "@mui/material";
import { getNotificationType, updateNotificationType } from '@/api-services/unified';
import CustomAlert from '../../components/alert'

const Setting = () => {
    const userID = 1
    const [notify, setNotify] = useState(false);
    const [alertState, setAlertState] = useState({ open: false, message: '' });


    useEffect(() => {
        const fetchNotificationType = async () => {
            const response = await getNotificationType(userID);
            const notificationType = response.data.toUpperCase() === 'TRUE';
            setNotify(notificationType);
        };
    
        fetchNotificationType();
    }, [userID]);

    const handleToggle = () => {
        const newNotifyValue = !notify;
        setNotify(newNotifyValue);

        updateNotificationType(userID, newNotifyValue)
        .then(response => {
            if (response.status == 200){
                const successMessage = newNotifyValue ? "Turn on notification successfully" : "Turn off notification successfully";
                setAlertState({ open: true, message: successMessage, severity: "success" });
            }
            else if (response.status == 404){
                setAlertState({ open: true, message: response.message, severity: "error" });
            }
        })
        .catch(error => {
            setAlertState({ open: true, message: error.message, severity: "error" || "An error occurred" });
        });
    };

    return (
        <div>
            <h1 style={{ color: "#243c64" }}>Setting</h1>
            <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>Get mail notification</Typography>
                    <Switch
                        checked={notify}
                        onChange={handleToggle}
                    />
                </Box>
                {alertState.open && (
                    <CustomAlert 
                        message={alertState.message} 
                        severity={alertState.severity} 
                        onClose={() => setAlertState({ open: false, message: '', severity: 'success' })}
                    />
                )}
            </Box>
        </div>
    );
};

export default Setting;
