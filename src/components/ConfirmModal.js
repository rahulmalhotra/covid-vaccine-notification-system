/*
*	Author:- Rahul Malhotra
*	Description:- This is the re-usable component for confirmation modal
*	Created:- 29-05-2021
*	Last Updated:- 29-05-2021
*/
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

export default function ConfirmModal(props) {

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when confirm button is clicked
  */
  const handleConfirm = () => {
    if(props.onConfirm) {
        props.onConfirm();
    }
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when reject button is clicked
  */
  const handleReject = () => {
    if(props.onReject) {
        props.onReject();
    }
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when close button is clicked
  */
  const handleClose = () => {
      if(props.onClose) {
          props.onClose();
      }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="confirm-modal-dialog-title"
        aria-describedby="confirm-modal-dialog-description"
      >
        {/* Modal Title */}
        <DialogTitle id="confirm-modal-dialog-title">{props.heading}</DialogTitle>
        {/* Modal Body */}
        <DialogContent>
          <DialogContentText id="confirm-modal-dialog-description">
            {props.description}
          </DialogContentText>
        </DialogContent>
        {/* Modal Actions */}
        <DialogActions>
          <Button onClick={handleReject} color="primary">
            {props.rejectButtonText}
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            {props.confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// * Setting up propTypes
ConfirmModal.propTypes = {
    open: PropTypes.bool.isRequired,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string,
    confirmButtonText: PropTypes.string.isRequired,
    rejectButtonText: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
