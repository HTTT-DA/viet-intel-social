import React, { useState, useEffect  } from "react";
import { Switch, Typography, Box } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { getNotificationType, updateNotificationType } from '@/api-services/unified';


const Setting = () => {
    const userID = 3
    const [notify, setNotify] = useState(false);

    useEffect(() => {
        const fetchNotificationType = async () => {
            const response = await getNotificationType(userID);
            const notificationType = response.data.toUpperCase() === 'TRUE';
            setNotify(notificationType);
        };
    
        fetchNotificationType();
    }, [userID]);

    const handleToggle = () => {
        setNotify(!notify);
        updateNotificationType(userID, !notify)
        .then(response => {
            alert(response.message);
        })
        .catch(error => {
            console.log(error);
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
                {notify && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <AlertTitle>Info</AlertTitle>
                        Notification turned on
                    </Alert>
                )}
                {!notify && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <AlertTitle>Info</AlertTitle>
                        Notification turned off
                    </Alert>
                )}
            </Box>
        </div>
    );
};

export default Setting;
