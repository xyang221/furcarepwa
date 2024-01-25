import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Button, Divider, Skeleton, Tab, Typography } from "@mui/material";
import axiosClient from "../axios-client";
import Consultation from "../pages/Services/Consultation";
import ServiceAvail from "../pages/Services/ServiceAvail";
import Deworming from "../pages/Services/Deworming";
import TestResults from "../pages/Services/TestResults";
import {
  Apartment,
  Block,
  ContentCut,
  ControlPointDuplicate,
  FolderCopy,
  Healing,
  Home,
  LocalHospital,
  MedicalServices,
  Medication,
  Vaccines,
} from "@mui/icons-material";
import Vaccination from "../pages/Services/Vaccination";
import Admissions from "../pages/Admissions";
import Medicines from "../pages/Services/Medicines";
import OtherTestResults from "../pages/Services/4DXTestResults";

export default function ServiceCatBtns() {
  const [servicesCat, setServicesCat] = useState([]);
  const [services, setServices] = useState([]);
  const [value, setValue] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = () => {
    setLoading(true);
    axiosClient
      .get("/services/modified")
      .then(({ data }) => {
        setServices(data.data);
        const uniqueCategories = Array.from(
          new Set(data.data.map((service) => service.category.category))
        );
        setServicesCat(uniqueCategories);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error fetching data:", error);
        setLoading(false);
      });
  };

  const categoryIcons = {
    Consultation: <MedicalServices />,
    "Home Service": <Home />,
    Boarding: <Apartment />,
    Grooming: <ContentCut />,
    Surgery: <Healing />,
    Vaccination: <Vaccines />,
    Deworming: <Vaccines />,
    Tests: <FolderCopy />,
    Medicines: <Medication />,
    "Tick/Flea Treatment": <Medication />,
    Admission: <LocalHospital />,
    Others: <ControlPointDuplicate />,
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setValue("0");
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            display: "flex",
            flexDirection: "row",
            ml: 1,
            mt: 1,
          }}
        >
          <Box>
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />{" "}
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
          </Box>
          <Box>
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
          </Box>
          <Box>
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
          </Box>
          <Box>
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
            <Skeleton
              sx={{ bgcolor: "grey.300", mb: 2, mr: 2 }}
              variant="rounded"
              width={"225px"}
              height={"35px"}
            />
          </Box>
        </Box>
      )}
      {!loading && (
        <Box sx={{ width: "100%", typography: "body1" }}>
          {servicesCat.map((category, index) => (
            <Button
              key={index}
              onClick={() => handleCategoryClick(category)}
              variant="contained"
              size="small"
              startIcon={categoryIcons[category]}
              sx={{ margin: 1, height: "35px", width: "225px" }}
            >
              {category}
            </Button>
          ))}

          {selectedCategory && (
            <Box
              sx={{ width: "100%", borderColor: "divider", marginTop: "10px" }}
            >
              <Divider />
              <TabContext value={value}>
                <Box sx={{ maxWidth: { xs: 320, sm: 1000 } }}>
                  <Typography
                    variant="h6"
                    align="center"
                    p={0.5}
                    sx={{
                      backgroundColor: "black",
                      width: "100%",
                      color: "white",
                    }}
                  >
                    {selectedCategory}
                  </Typography>
                  <TabList
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="lab API tabs"
                  >
                    {services
                      .filter(
                        (service) =>
                          service.category.category === selectedCategory
                      )
                      .map((service, idx) => (
                        <Tab
                          key={idx}
                          label={service.service}
                          value={idx.toString()}
                          onClick={() => setValue(idx.toString())}
                          icon={
                            service.isAvailable === 0 ? (
                              <Block color="error" fontSize="inherit" />
                            ) : null
                          }
                        />
                      ))}
                  </TabList>
                </Box>
                {services
                  .filter(
                    (service) => service.category.category === selectedCategory
                  )
                  .map((service, idx) => (
                    <TabPanel key={idx} value={idx.toString()}>
                      {service.service == "Consultation" && (
                        <Consultation sid={service.id} />
                      )}
                      {service.service == "Home Service" && (
                        <ServiceAvail title="Home Service" sid={service.id} />
                      )}
                      {service.service == "Boarding" && (
                        <ServiceAvail title="Boarding" sid={service.id} />
                      )}
                      {service.service == "Grooming" && (
                        <ServiceAvail title="Grooming" sid={service.id} />
                      )}
                      {service.service == "Surgery" && (
                        <ServiceAvail title="Surgery" sid={service.id} />
                      )}
                      {service.service == "DHLPPI" && (
                        <Vaccination sid={service.id} sname={service.service} />
                      )}
                      {service.service == "BRONCHICINE" && (
                        <Vaccination sid={service.id} sname={service.service} />
                      )}
                      {service.service == "HEARTWORM" && (
                        <Vaccination sid={service.id} sname={service.service} />
                      )}
                      {service.service == "RABIES" && (
                        <Vaccination sid={service.id} sname={service.service} />
                      )}
                      {service.service == "TRICAT" && (
                        <Vaccination sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Deworming" && (
                        <Deworming sid={service.id} />
                      )}
                      {service.service == "CBC" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "BLOOD CHEM" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "PARVO TEST" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "DISTEMPER" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "EHRLICHIA" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "HEARTWORM" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "4DX" && (
                        <OtherTestResults
                          sid={service.id}
                          sname={service.service}
                        />
                      )}
                      {service.service == "Ultrasound" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Vaginal Smear Test" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Fecalysis" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Urinalysis" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Xray" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Progesterone Test" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Pregnancy Test" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Flu Test" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Leptospirosis Test" && (
                        <TestResults sid={service.id} sname={service.service} />
                      )}
                      {service.service == "Medicine" && (
                        <Medicines title="Medicines" sid={service.id} />
                      )}
                      {service.service == "Tick/Flea Treatment" && (
                        <ServiceAvail
                          title="Tick/Flea Treatment"
                          sid={service.id}
                        />
                      )}
                      {service.service == "Admission" && (
                        <Admissions sid={service.id} />
                      )}
                    </TabPanel>
                  ))}
              </TabContext>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
