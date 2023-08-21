import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const CustomAlert = ({ message, severity, duration = 6000, onClose }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

        // Call onClose if provided
        if (onClose && typeof onClose === "function") {
            onClose(event, reason);
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity={severity} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

CustomAlert.propTypes = {
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['error', 'info', 'warning', 'success']).isRequired,
    duration: PropTypes.number,
    onClose: PropTypes.func,
};

CustomAlert.defaultProps = {
    duration: 6000,
    onClose: null
};

export default CustomAlert;