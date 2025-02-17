const WarningPopup = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="warning-popup">
            <p>{message}</p>
            <div className="popup-buttons">
                <button className="no-btn" onClick={onCancel}>No</button>
                <button className="yes-btn" onClick={onConfirm}>Yes</button>
            </div>
        </div>
    );
};

export default WarningPopup;