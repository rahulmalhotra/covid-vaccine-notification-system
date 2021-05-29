/*
*	Author:- Rahul Malhotra
*	Description:- This is the parent js file that consists of the whole code and components
*	Created:- 23-05-2021
*	Last Updated:- 25-05-2021
*/
import React from "react";
import {
  withStyles,
  TextField,
  Card,
  CardContent,
  Button,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
  FormHelperText
} from "@material-ui/core";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import {
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  Delete,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  Save,
  Search,
  ViewColumn,
  Notifications,
  Close,
  ArrowForward,
  Visibility,
  VisibilityOff
} from "@material-ui/icons";
import ConfirmModal from './components/ConfirmModal';

// * Icons used in material  table
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <Save {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

// * CSS Styles
const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
});

// * Cowin API Endpoints
const endpoints = {
  searchByDistrict: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict',
  searchByPincode: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin',
  vaccineBooking: 'https://selfregistration.cowin.gov.in/',
  states: 'https://cdn-api.co-vin.in/api/v2/admin/location/states',
  districts: 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/'
}

class App extends React.Component {

  // * Component level state
  state = {
    selectedState: "",
    states: [],
    selectedDistrict: "",
    districts: [],
    selectedVaccine: "all",
    vaccines: [
      {
        id: 1,
        name: "All",
        value: "all"
      },
      {
        id: 2,
        name: "Covaxin",
        value: "COVAXIN"
      },
      {
        id: 3,
        name: "Covishield",
        value: "COVISHIELD"
      },
      {
        id: 4,
        name: "Sputnik V",
        value: "SPUTNIK V"
      }
    ],
    minDose1: 1,
    minDose2: 1,
    selectedVaccinePrice: "both",
    prices: [
      {
        id: 1,
        name: "Both",
        value: "both",
      },
      {
        id: 2,
        name: "Free",
        value: "free",
      },
      {
        id: 3,
        name: "Paid",
        value: "paid",
      }
    ],
    selectedAge: "all",
    ages: [
      {
        id: 1,
        name: "All",
        value: "all",
      },
      {
        id: 2,
        name: "18+",
        value: 18,
      },
      {
        id: 3,
        name: "45+",
        value: 45,
      }
    ],
    setIntervalId: -1,
    vaccinesData: [],
    centreIdsToSkip: [],
    notify: false,
    flag: false,
    hasError: false,
    inDevelopment: false,
    hasSearched: false,
    initialized: false,
    showBookVaccineConfirmationModal: false,
    searchOptions: [
      {
        id: 1,
        name: "District",
        value: "district",
      },
      {
        id: 2,
        name: "Pincode",
        value: "pincode",
      }
    ],
    selectedSearchBy: 'district',
    searchAPIEndpoint: endpoints.searchByDistrict
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to fetch the list of states
  */
  fetchStates() {
    fetch(endpoints.states)
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        states: json.states,
      });
    })
    .catch((e) => this.logMessage(e));
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to fetch the list of districts
  */
  fetchDistricts(state) {
    const selectedState = state ? state : this.state.selectedState;
    fetch(
      endpoints.districts +
      selectedState
    )
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        districts: json.districts,
      });
    })
    .catch((e) => this.logMessage(e));
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This is the helper method to get date in dd-mm-yyyy format
  */
  getDateStringFromDate(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    return dd + "-" + mm + "-" + yyyy;
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This is the helper method to log debugs
  */
  logMessage(message) {
    if (this.state.inDevelopment) {
      console.log(message);
    }
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This is the helper method to return unique elements from an array
  */
  getUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to fetch vaccine centres based on the input
  */
  fetchVaccineCentres() {

    // * Checking if input is valid
    if(!this.validateInput()) {
      return;
    }

    // * Setting up the state for auto-notify search
    this.setState({
      flag: !this.state.flag,
    });

    // * Calculating current date and next date to get all vaccination centres for 2 weeks starting today
    let today = new Date();
    let currentDateString = this.getDateStringFromDate(today);
    today.setDate(today.getDate() + 7);
    let nextDateString = this.getDateStringFromDate(today);

    // * If notification is enabled, check for current and next week one by one
    if (this.state.notify) {
      let date;
      date = this.state.flag ? currentDateString : nextDateString;
      this.fetchVaccinesCentresByDate(date);
    }
    // * Otherwise check for both the weeks together
    else {
      this.fetchVaccinesCentresByDate(currentDateString, nextDateString);
    }
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to fetch the vaccine centres by date
  */
  fetchVaccinesCentresByDate(date1, date2) {
    let centres = [], baseEndpoint = this.state.searchAPIEndpoint;
    // * Setting up endpoint based on the value in search by combobox
    if(this.state.selectedSearchBy === 'pincode') {
      baseEndpoint += '?pincode=' + this.state.pincode;
    } else if(this.state.selectedSearchBy === 'district') {
      baseEndpoint += '?district_id=' + this.state.selectedDistrict;
    }
    fetch(
      baseEndpoint +
      "&date=" +
      date1
    )
    .then((res) => res.json())
    .then((json) => {
      if(json.centers) {
        centres = json.centers;
        if (date2) {
          fetch(
            baseEndpoint +
            "&date=" +
            date2
          )
          .then((res) => res.json())
          .then((json) => {
            if(json.centers) {
              centres = [...centres, ...json.centers];
              this.setVaccinesData(centres);
            } else if(json.error) {
              alert(json.error);
            }
          })
          .catch((error) => this.logMessage(error));
        } else {
          this.setVaccinesData(centres);
        }
      } else if(json.error) {
        alert(json.error);
      }
    })
    .catch((error) => this.logMessage(error))
    .finally(() => {
      this.setState({
        hasSearched: true
      });
    });
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to set vaccines data in data table
  */
  setVaccinesData(centres) {
    let that = this;
    let vaccineCentres = [];
    // * Check for each vaccine centre one by one
    centres.forEach((centre) => {
      let vaccineCentre = centre;
      // * If the selected filter is paid and the vaccine centre is having free vaccines, return
      if (
        that.state.selectedVaccinePrice === "paid" &&
        vaccineCentre.fee_type === "Free"
      ) {
        return;
      }
      // * If the selected filter is free and the vaccine centre is having paid vaccines, return
      else if (
        that.state.selectedVaccinePrice === "free" &&
        vaccineCentre.fee_type === "Paid"
      ) {
        return;
      }
      // * Checking all vaccine sessions for the current centre and filtering them based on applied filters
      let sessions = vaccineCentre.sessions;
      let currentVaccineSessions = sessions.filter((session) => {
        let condition = true;
        // * Add vaccine filter
        if (that.state.selectedVaccine !== "all") {
          condition = condition && session.vaccine === that.state.selectedVaccine;
          that.logMessage('Selected vaccine: ' + that.state.selectedVaccine);
        }
        // * Add age filter
        if (that.state.selectedAge !== "all") {
          condition = condition && session.min_age_limit === that.state.selectedAge;
        }
        // * Add minimum first dose filter
        if (that.state.minDose1 > 0) {
          condition = condition && session.available_capacity_dose1 >= that.state.minDose1;
          that.logMessage('Minimum Capacity 1st Dose: ' + that.state.minDose1);
        }
        // * Add minimum second dose filter
        if (that.state.minDose2 > 0) {
          condition = condition && session.available_capacity_dose2 >= that.state.minDose2;
          that.logMessage('Minimum Capacity 2nd Dose: ' + that.state.minDose2);
        }
        // * Add centre ids to skip filter
        if (that.state.centreIdsToSkip.length) {
          condition = condition && !that.state.centreIdsToSkip.includes(vaccineCentre.center_id);
          if (that.state.centreIdsToSkip.includes(vaccineCentre.center_id)) {
            that.logMessage('Skipped Vaccine Centre:' + vaccineCentre.name);
          }
        }
        return condition;
      });
      // * Updating vaccine centre sessions
      vaccineCentre.sessions = currentVaccineSessions;
      // * If we have sessions for the current vaccine centre, add it to the list of vaccine centres
      if (vaccineCentre.sessions.length)
        vaccineCentres = vaccineCentres.concat(vaccineCentre);
    });

    // * Checking all vaccine centres to setup table data
    let vaccinesData = [], price = 0, vaccineRecord;
    vaccineCentres.forEach((centre) => {

      // * Iterating all sessions one by one
      centre.sessions.forEach((session) => {

        // * Setting up vaccine price as 0 if vaccine is free
        if (centre.fee_type === "Free") {
          price = 0;
        } else {
          // * Getting vaccine price record if vaccine is paid
          vaccineRecord = centre.vaccine_fees && centre.vaccine_fees.length ? centre.vaccine_fees.find(
            (vaccineRecord) => vaccineRecord.vaccine === session.vaccine
          ) : { fee: "Not Available" };
          // * Setting up vaccine price
          if (vaccineRecord) {
            price = vaccineRecord.fee;
          }
        }

        // * Adding vaccine data to table
        vaccinesData.push({
          center_id: centre.center_id,
          name: centre.name,
          address: centre.address,
          type: centre.fee_type,
          date: session.date,
          vaccineName: session.vaccine,
          dose1Availability: session.available_capacity_dose1,
          dose2Availability: session.available_capacity_dose2,
          minAge: session.min_age_limit,
          price: price,
        });
      });
    });
    this.logMessage(vaccinesData);

    // * Setting up vaccines data
    this.setState({
      vaccinesData: vaccinesData,
    });
    this.logMessage(
      "Vaccination centres with vaccines: " + vaccineCentres.length
    );
    // * If the app is continuously searching for vaccines and it found vaccines, stop the service
    if (this.state.notify && vaccinesData.length) {
      // * Stopping vaccine search service
      this.clearNotificationSearch();
      // * Notify user about avaialble vaccines
      this.notifyMe(
        "Vaccines Available",
        "Vaccines are available at " + vaccineCentres.length + " centre(s)"
      );
    }
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when component is rendered
  */
  componentDidMount() {
    if(!this.state.initialized) {
      this.fetchStates();
      this.setState({
        initialized: true
      });
    }
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to send browser notifications
  */
  notifyMe(heading, body) {
    if (!window.Notification) {
      alert("Browser does not support notifications.");
    } else {
      // * Check if permission is already granted, show the notification
      if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          if(registrations && Array.isArray(registrations) && registrations.length) {
            registrations[0].showNotification(heading, {
              body: body
            });
          }
        });
      }

      // * Otherwise, request notification permission from user
      else {
        Notification.requestPermission()
        .then(permission => {
          if (permission === "granted") {
            this.notifyVaccineAvailability();
          } else {
            alert("Please allow notifications to proceed further");
          }
        })
        .catch(e => {
          this.logMessage(e);
        });
      }
    }
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when state is selected
  */
  selectState = event => {
    this.setState({ selectedState: event.target.value });
    this.fetchDistricts(event.target.value);
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when district is selected
  */
  selectDistrict = event => {
    this.setState({ selectedDistrict: event.target.value });
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when vaccine is selected
  */
  selectVaccine = event => {
    this.setState({ selectedVaccine: event.target.value });
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when minimum quantity of 1st dose is updated
  */
  setMinimumDose1 = event => {
    let value = event.target.value;
    // * If a value is entered, use that
    if(value) {
      this.setState({ minDose1: value });
    }
    // * If the field is empty, set the value to 0
    else {
      this.setState({ minDose1: 0 });
    }
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when minimum quantity of 2nd dose is updated
  */
  setMinimumDose2 = event => {
    let value = event.target.value;
    // * If a value is entered, use that
    if(value) {
      this.setState({ minDose2: value });
    }
    // * If the field is empty, set the value to 0
    else {
      this.setState({ minDose2: 0 });
    }
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when age is selected
  */
  selectAge = event => {
    this.setState({
      selectedAge: event.target.value,
    });
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when price is selected
  */
  selectVaccinePrice = event => {
    this.setState({
      selectedVaccinePrice: event.target.value,
    });
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to clear centre ids hidden from vaccine search results
  */
  clearCentreIdsToSkip() {
    this.setState({
      centreIdsToSkip: [],
    });
    this.fetchVaccineCentres();
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to setup notifications service for vaccines
  */
  notifyVaccineAvailability() {
    this.notifyMe(
      "Notifications Enabled",
      "We'll notify you when vaccines are available"
    );
    if (Notification.permission === "granted") {
      this.setState({
        notify: true,
      });
      let setIntervalId = setInterval(
        this.fetchVaccineCentres.bind(this),
        5000
      );
      this.setState({
        setIntervalId: setIntervalId,
      });
    }
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method will return true if state is selected, used for validation
  */
  stateSelected() {
    return this.state.selectedState ? true : false;
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method will return true if district is selected, used for validation
  */
  districtSelected() {
    return this.state.selectedDistrict ? true : false;
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to validate the input when search button is clicked
  */
  validateInput() {
    let isValid = true;
    if(this.state.selectedSearchBy === 'pincode') {
      isValid = this.pincodeEntered();
    } else if(this.state.selectedSearchBy === 'district') {
      isValid = this.stateSelected() && this.districtSelected();
    }
    if(!isValid) {
      this.setState({
        hasError: true
      });
    } else {
      this.setState({
        hasError: false
      });
    }
    return isValid;
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to clear/stop notification search service
  */
  clearNotificationSearch() {
    if(this.state.notify) {
      clearInterval(this.state.setIntervalId);
      this.setState({
        notify: false,
      });
    }
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when user confirms that he/she wants to book the slot
  */
  bookVaccineSlot() {
    window.open(endpoints.vaccineBooking, '_blank');
    this.closeBookVaccineModal();
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to display confirmation modal for vaccine booking
  */
  displayBookVaccineModal() {
    this.setState({
      showBookVaccineConfirmationModal: true
    });
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to close confirmation modal for vaccine booking
  */
  closeBookVaccineModal() {
    this.setState({
      showBookVaccineConfirmationModal: false
    });
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when a value is selected in searchBy field
  */
  selectSearchBy = event => {
    const value = event.target.value;
    // * Setting up the API endpoint
    if(value === 'pincode') {
      this.setState({
        searchAPIEndpoint: endpoints.searchByPincode
      });
    } else if(value === 'district') {
      this.setState({
        searchAPIEndpoint: endpoints.searchByDistrict
      });
    }
    // * Setting up the selected value
    this.setState({
      selectedSearchBy: value,
    });
    // * Clearing the vaccines data
    this.setState({
      vaccinesData: []
    });
    // * Reset hasSearched
    this.setState({
      hasSearched: false
    });
    // * Clear notification search
    this.clearNotificationSearch();
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method will return true if pincode is entered, used for validation
  */
  pincodeEntered() {
    return this.state.pincode ? true : false;
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to set pincode's value when pincode is updated by user
  */
  setPincode = event => {
    this.setState({
      pincode: event.target.value
    });
    // * Clear notification search
    this.clearNotificationSearch();
  }

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when minimum quantity of 1st dose text is focused
  */
  focusMinimumDose1 = event => {
    event.target.select();
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is called when minimum quantity of 2nd dose text is focused
  */
  focusMinimumDose2 = event => {
    event.target.select();
  };

  /*
  *	Author:- Rahul Malhotra
  *	Description:- This method is used to render the UI
  */
  render() {
    const { classes } = this.props;
    const {
      states,
      districts,
      vaccines,
      prices,
      ages,
      centreIdsToSkip,
      searchOptions,
      hasSearched,
      vaccinesData,
      notify,
      selectedSearchBy,
      pincode,
      hasError,
      selectedState,
      selectedDistrict,
      selectedAge,
      selectedVaccine,
      selectedVaccinePrice,
      minDose1,
      minDose2,
      showBookVaccineConfirmationModal
    } = this.state;
    let showHiddenVaccineCentersButton, notifyButton, clearNotifyButton;

    // * Setting up show hidden vaccination centres button
    if (centreIdsToSkip.length) {
      showHiddenVaccineCentersButton = (
        <FormControl className={classes.formControl}>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.clearCentreIdsToSkip.bind(this)}
            startIcon={<Visibility />}
          >
            Show Hidden Vaccination Centres
          </Button>
        </FormControl>
      );
    }

    // * Setting up notifications button
    if (
      hasSearched &&
      vaccinesData.length === 0 &&
      !notify &&
      (
        (
          selectedSearchBy === 'district' &&
          this.stateSelected() &&
          this.districtSelected()
        ) ||
        (
          selectedSearchBy === 'pincode' &&
          this.pincodeEntered()
        )
      )
    ) {
      notifyButton = (
        <FormControl className={classes.formControl}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.notifyVaccineAvailability.bind(this)}
            endIcon={<Notifications />}
          >
            Notify me when vaccines are available
          </Button>
        </FormControl>
      );
    }

    // * Setting up stop notifications button
    if (notify) {
      clearNotifyButton = (
        <FormControl className={classes.formControl}>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.clearNotificationSearch.bind(this)}
            endIcon={<Close />}
          >
            Stop Notifications
          </Button>
        </FormControl>
      )
    }

    // * Setting up the UI
  return (
      <div>
        <Card style={{ margin: '1rem' }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              COVID-19 Vaccine Notification System
            </Typography>
            {/* Form Inputs */}
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="searchBy-label">Search by</InputLabel>
              <Select
                labelId="searchBy-label"
                id="searchBy-input"
                value={selectedSearchBy}
                onChange={this.selectSearchBy}
                label="Search by"
                autoFocus
                >
                {searchOptions.map((searchOption) => (
                  <MenuItem key={searchOption.id} value={searchOption.value}>
                    {searchOption.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {
              (selectedSearchBy === 'pincode') && (
                <FormControl required variant="outlined" className={classes.formControl} error={pincode && !this.pincodeEntered()}>
                  <TextField
                    required
                    id="outlined-pincode"
                    label="Enter pincode"
                    variant="outlined"
                    value={pincode}
                    type="number"
                    onChange={this.setPincode}
                    error={hasError && !this.pincodeEntered()}
                    helperText={
                      hasError && !this.pincodeEntered() &&
                      (
                        "Please enter pincode"
                      )
                    }
                  />
                </FormControl>
              )
            }
            {
              (selectedSearchBy === 'district') && (
                <span>
                  <FormControl required variant="outlined" className={classes.formControl} error={hasError && !this.stateSelected()}>
                  <InputLabel id="state-label">Select state</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state-input"
                    value={selectedState}
                    onChange={this.selectState}
                    label="Select state"
                    error={hasError && !this.stateSelected()}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.state_id} value={state.state_id}>
                        {state.state_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {
                    hasError && !this.stateSelected() &&
                    (
                      <FormHelperText>Please select a state</FormHelperText>
                    )
                  }
                </FormControl>
                  <FormControl required variant="outlined" className={classes.formControl} error={hasError && !this.districtSelected()}>
                    <InputLabel id="district-label">Select district</InputLabel>
                    <Select
                      labelId="district-label"
                      id="district-input"
                      value={selectedDistrict}
                      onChange={this.selectDistrict}
                      label="Select district"
                      error={hasError && !this.districtSelected()}
                    >
                      {districts.map((district) => (
                        <MenuItem
                          key={district.district_id}
                          value={district.district_id}
                        >
                          {district.district_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {
                      hasError && !this.districtSelected() &&
                      (
                        <FormHelperText>Please select a district</FormHelperText>
                      )
                    }
                  </FormControl>
                </span>
              )
            }
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="vaccine-label">Select vaccine</InputLabel>
              <Select
                labelId="vaccine-label"
                id="vaccine-input"
                value={selectedVaccine}
                onChange={this.selectVaccine}
                label="Select vaccine"
              >
                {vaccines.map((vaccine) => (
                  <MenuItem key={vaccine.id} value={vaccine.value}>
                    {vaccine.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="price-label">Select price</InputLabel>
              <Select
                labelId="price-label"
                id="price-input"
                value={selectedVaccinePrice}
                onChange={this.selectVaccinePrice}
                label="Select price"
              >
                {prices.map((price) => (
                  <MenuItem key={price.id} value={price.value}>
                    {price.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="age-label">Minimum age</InputLabel>
              <Select
                labelId="age-label"
                id="age-input"
                value={selectedAge}
                onChange={this.selectAge}
                label="Minimum age"
              >
                {ages.map((age) => (
                  <MenuItem key={age.id} value={age.value}>
                    {age.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                id="outlined-min-vaccine-dose-1"
                label="Quantity required - 1st dose"
                variant="outlined"
                value={minDose1}
                type="number"
                onChange={this.setMinimumDose1}
                onFocus={this.focusMinimumDose1}
              />
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                id="outlined-min-vaccine-dose-2"
                label="Quantity required - 2nd dose"
                variant="outlined"
                value={minDose2}
                type="number"
                onChange={this.setMinimumDose2}
                onFocus={this.focusMinimumDose2}
              />
            </FormControl>
            <br />
            <FormControl className={classes.formControl}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.fetchVaccineCentres.bind(this)}
                startIcon={<Search />}
              >
                Search Vaccination Centres
              </Button>
            </FormControl>
            {showHiddenVaccineCentersButton}
            {notifyButton}
            {clearNotifyButton}
            <FormControl className={classes.formControl}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.displayBookVaccineModal.bind(this)}
                endIcon={<ArrowForward />}
              >
                Book Vaccination Slot
              </Button>
              <ConfirmModal open={showBookVaccineConfirmationModal} onConfirm={this.bookVaccineSlot.bind(this)} onReject={this.closeBookVaccineModal.bind(this)} onClose={this.closeBookVaccineModal.bind(this)} heading="Book Vaccination Slot?" description="Please make sure that you take a note of the center details before proceeding" confirmButtonText="Yes" rejectButtonText="No" />
            </FormControl>
          </CardContent>
        </Card>
        {/* Data Table */}
        <div style={{ maxWidth: "100%", margin: '1rem' }}>
          <MaterialTable
            icons={tableIcons}
            columns={[
              { title: "Date", field: "date" },
              { title: "Center Name", field: "name" },
              { title: "Center Address", field: "address" },
              { title: "Vaccine Name", field: "vaccineName" },
              { title: "Minimum Age Required", field: "minAge" },
              { title: "Price", field: "price" },
              { title: "1st Dose Availability", field: "dose1Availability", type: "numeric" },
              { title: "2nd Dose Availability", field: "dose2Availability", type: "numeric" }
            ]}
            data={vaccinesData}
            title="Vaccination Centres"
            options={{ selection: true }}
            actions={[
              {
                tooltip: "Remove centres from search results",
                icon: () => {
                  return <VisibilityOff />;
                },
                onClick: (event, centres) => {
                  // * Removing selected centres from search results
                  let currentCentreIdsToSkip = [...centreIdsToSkip];
                  centres.forEach((centre) =>
                    currentCentreIdsToSkip.push(centre.center_id)
                  );
                  // * Setting up unique centre ids to skip
                  this.setState({
                    centreIdsToSkip: currentCentreIdsToSkip.filter(this.getUnique),
                  });
                  // * Removing centres from search results
                  this.setState({
                    vaccinesData: vaccinesData.filter((vaccine) => !currentCentreIdsToSkip.includes(vaccine.center_id))
                  });
                },
              },
            ]}
          />
        </div>
        {/* Hit Counter */}
        <br />
        <center><b>Total Views Worldwide</b></center>
        <br />
        <center>
          <a href="https://www.hitwebcounter.com" target="_blank" rel="noreferrer">
            <img src="https://hitwebcounter.com/counter/counter.php?page=7816923&style=0005&nbdigits=9&type=page&initCount=0" title="Free Counter" Alt="web counter" border="0" />
        </a>
        </center>
        <br />
    </div>
  );
}
}

export default withStyles(styles)(App);