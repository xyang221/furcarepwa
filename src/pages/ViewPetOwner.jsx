import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import PetOwnerEdit from "../components/modals/PetOwnerEdit";
import UserEdit from "../components/modals/UserEdit";
import PetOwnerTabs from "../components/PetOwnerTabs";
import Swal from "sweetalert2";

export default function ViewPetOwner() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [petownerdata, setPetownerdata] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
    address_id: null,
    user_id: null,
  });

  const [addressdata, setAddressdata] = useState({
    id: null,
    zipcode_id: null,
    barangay: "",
    zone: "",
  });

  const [userdata, setUserdata] = useState({
    id: null,
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });

  const [zipcode, setZipcode] = useState({
    id: null,
    area: "",
    province: "",
    zipcode: "",
  });

  const [appointment, setAppointment] = useState([]);

  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [zipcodeerror, setZipcodeerror] = useState(null);

  const [openuser, openuserchange] = useState(false);
  const [openPetowner, openPetownerchange] = useState(false);

  const closepopup = () => {
    openuserchange(false);
    openPetownerchange(false);
    getPetowner();
  };

  const getPetowner = () => {
    setPetownerdata({});
    setAddressdata({});
    setZipcode({});
    setErrors(null);
    setLoading(true);
    setSelectedZipcode(null);

    axiosClient
      .get(`/petowners/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPetownerdata(data);
        setAddressdata(data.address);
        setZipcode(data.address.zipcode);
        setUserdata(data.user);
        setSelectedZipcode(data.address.zipcode.zipcode);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onEdit = () => {
    getPetowner();
    setErrors(null);
    openPetownerchange(true);
    getZipcodeDetails(zipcode.zipcode);
  };

  const onEditUSer = () => {
    getPetowner();
    setErrors(null);
    openuserchange(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const updatePetowner = axiosClient.put(
      `/petowners/${petownerdata.id}`,
      petownerdata
    );
    const updateAddressPromise = axiosClient.put(
      `/addresses/${petownerdata.address_id}`,
      addressdata
    );

    Promise.all([updatePetowner, updateAddressPromise])
      .then(() => {
        Swal.fire({
          title: "Success",
          text: "Petowner information was successfully updated.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            setLoading(false);
            openPetownerchange(false);
            getPetowner();
          }
        });
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const onSubmitUser = (e) => {
    e.preventDefault();

    setErrors(null);
    axiosClient
      .patch(`/users/${petownerdata.user_id}`, userdata)
      .then(() => {
        openuserchange(false);
        Swal.fire({
          title: "Success",
          text: "User account was successfully updated.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            getPetowner();
          }
        });
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };
  const [services, setServices] = useState([]);

  const getServices = () => {
    axiosClient
      .get(`/services`)
      .then(({ data }) => {
        setServices(data.data);
      })
      .catch(() => {});
  };

  const getAppointment = () => {
    setAppointment([]);
    axiosClient
      .get(`/appointments/petowner/${id}/today`)
      .then(({ data }) => {
        setAppointment(data.services);
      })
      .catch(() => {
        setAppointment([]);
      });
  };

  useEffect(() => {
    getPetowner();
    getServices();
    getAppointment();
  }, []);

  const getZipcodeDetails = (query) => {
    if (query) {
      setZipcodeerror(null);

      axiosClient
        .get(`/zipcodedetails/${query}`)
        .then(({ data }) => {
          selectedZipcode(data.data.zipcode);
          setZipcode(data.data);
          setAddressdata((prevPetowner) => ({
            ...prevPetowner,
            zipcode_id: data.data.id,
          }));
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setZipcodeerror(response.data.message);
          }
        });
    }
  };

  const handleZipcodeChange = (event) => {
    setSelectedZipcode(zipcode.zipcode);
    setSelectedZipcode(event.target.value);
  };

  useEffect(() => {
    let timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setZipcodeerror(null);
      getZipcodeDetails(selectedZipcode);
    }, 2000);

    return () => clearTimeout(timerId);
  }, [selectedZipcode]);

  return (
    <Paper
      sx={{
        minWidth: "90%",
        padding: "10px",
        margin: "10px",
      }}
    >
      <Stack flexDirection="row">
        <Stack p={2}>
          <Typography variant="h5">
            Pet Owner Information
            <IconButton
              variant="contained"
              color="info"
              onClick={() => onEdit()}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Typography>
          <Typography>
            Name: {petownerdata.firstname} {petownerdata.lastname}
          </Typography>
          <Typography>
            Address: {addressdata.zone}, {addressdata.barangay}, {zipcode.area},{" "}
            {zipcode.province}, {zipcode.zipcode}
          </Typography>
          <Typography>Contact Number: +63{petownerdata.contact_num}</Typography>
        </Stack>

        <Stack p={2}>
          <Typography variant="h5">
            User Account{" "}
            <IconButton
              variant="contained"
              color="info"
              onClick={() => onEditUSer()}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Typography>
          <Typography>Email: {userdata.email} </Typography>
        </Stack>
      </Stack>

      {appointment && appointment.length > 0 && (
        <Typography
          p={1}
          sx={{ backgroundColor: "whitesmoke" }}
          variant="body1"
          fontWeight="bold"
        >
          Appointment Services:
          {services
            .filter((service) => appointment.includes(service.id))
            .map((filteredService) => (
              <span key={filteredService.id}> {filteredService.service}, </span>
            ))}
        </Typography>
      )}

      <PetOwnerEdit
        open={openPetowner}
        onClose={closepopup}
        onClick={closepopup}
        onSubmit={onSubmit}
        petowner={petownerdata}
        setPetowner={setPetownerdata}
        address={addressdata}
        setAddress={setAddressdata}
        errors={errors}
        loading={loading}
        isUpdate={id}
        zipcode={zipcode}
        selectedZipcode={selectedZipcode}
        handleZipcodeChange={handleZipcodeChange}
        zipcodeerror={zipcodeerror}
      />
      <UserEdit
        open={openuser}
        onClick={closepopup}
        onClose={closepopup}
        onSubmit={onSubmitUser}
        loading={loading}
        roles={[]}
        user={userdata}
        setUser={setUserdata}
        errors={errors}
        isUpdate={userdata.id}
      />

      <PetOwnerTabs petowner={petownerdata} />
    </Paper>
  );
}
