import { useState, useEffect } from "react";
import lensImage  from "../../assets/lens.png";
import loadingGif from "../../assets/loading.gif";
import { Box, TextField, Typography } from '@mui/material';
import { getAnswerFromQuesion } from '@/api-services/unified';
import CustomAlert from '../../components/alert'

function QnA() {
    const [prompt, updatePrompt] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState(undefined);
    const [alertState, setAlertState] = useState({ open: false, message: '' });
    const [hasSearched, setHasSearched] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);


    useEffect(() => {
        if (prompt != null && prompt.trim() === "") {
            setAnswer(undefined);
        }
    }, [prompt]);

    const sendPrompt = async (event) => {
        if (event.key !== "Enter") {
            return;
        }

        setHasSearched(true);

        try {
            setLoading(true);
    
            const response = await getAnswerFromQuesion(prompt);

            if (!response || !response.data) {
                switch(response.message) {
                    case "Invalid JSON format":
                        setAlertState({ open: true, message: "There was an issue processing your request. Please try again.", severity: "error" });
                        break;
                    case "Can't find question":
                        setAlertState({ open: true, message: "The provided question could not be found or processed.", severity: "warning" });
                        break;
                    case "Failed finding answer":
                        setAnswer(["Your question exists in our system, but we currently don't have an answer for it."]);
                        break;
                    case "Question does not exist in the system database":
                        setAnswer(["Question doesn't exist."]);
                        break;
                    default:
                        setAlertState({ open: true, message: "An unexpected error occurred. Please try again.", severity: "error" });
                }
                return;
            }
        
            setAnswer(response.data);
            setAnimationKey(prevKey => prevKey + 1);

        
        } catch (err) {
            console.error(err);
            setAlertState({ message: "An error occurred. Please try again later", severity: "Warning" });
        } finally {
            setLoading(false);
        }
    };

    function renderAnswersList(answers) {
        if (!hasSearched) { 
            return null;
        }

        if (!Array.isArray(answers) || answers.length === 0) {
            return null;
        }
    
        const typingDuration = 2;
        const isMultipleAnswers = answers.length > 1;
        return (
            <Box component="ul" key={animationKey} sx={{ listStyleType: 'none', paddingLeft: 0 }}>
                {answers.map((answer, index) => (
                    <Box 
                        component="li" 
                        key={answer.id || index} 
                        sx={{ 
                            marginLeft: '1em',
                            overflow: "hidden",
                            //borderRight: ".15em solid orange",
                            whiteSpace: "nowrap",
                            letterSpacing: ".15em",
                            animation: `typing ${typingDuration}s steps(40, end) ${index * typingDuration}s forwards`,
                            maxWidth: 0,
                            '@keyframes typing': {
                                from: { maxWidth: 0 },
                                to: { maxWidth: '100%' }
                            }
                        }}>
                        {isMultipleAnswers ? `${index + 1}. ` : ''}{answer}
                    </Box>
                ))}
            </Box>
        );
    }
    

    return (
        <div>
            <h1 style={{ color: "#243c64" }}>QnA</h1>
            {alertState.open && (
                <CustomAlert
                    message={alertState.message}
                    severity={alertState.severity}
                    onClose={() => setAlertState({ open: false, message: '', severity: 'success' })}
                />
            )}
            <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1} m={2} >
                <TextField
                    fullWidth
                    type="text"
                    placeholder="Ask me anything"
                    disabled={loading}
                    sx={{
                        display: "block",
                        height: 56,
                        border: 0,
                        borderRadius: 12,
                        fontSize: "1.2rem",
                        color: "#000",
                        backgroundPosition: "left 17px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "3.5%",
                        paddingLeft: 10,
                        py: 2,
                        '&::placeholder': {
                            lineHeight: "1.5em"
                        },
                        maxWidth: 1000,
                        backgroundImage: loading ? `url(${loadingGif})` : `url(${lensImage})`
                    }}
                    onChange={(e) => {
                        updatePrompt(e.target.value);
                        setAnswer(undefined);
                    }}
                
                    onKeyDown={(e) => sendPrompt(e)}
                />
                <Box
                    sx={{
                        minHeight: 115,
                        lineHeight: "1.5em",
                        letterSpacing: "0.1px",
                        padding: "10px 30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {renderAnswersList(answer)}
                </Box>
            </Box>
        </div>
        
    );
}

export default QnA;