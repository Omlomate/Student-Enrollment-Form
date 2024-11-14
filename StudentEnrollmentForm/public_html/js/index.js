 const connectionToken = "90934460|-31949229280365193|90957006";
                const dbName = "SCHOOL-DB";
                const relName = "STUDENT-TABLE";

                // Verifies if the primary key exists; displays data for update or prepares form for new entry
                function checkPrimaryKey() {
                    const rollNo = document.getElementById("rollNo").value;
                    if (rollNo) {
                        // Construct request string with helper function
                        const reqStr = createGET_BY_KEYRequest(connectionToken, dbName, relName, JSON.stringify({rollNo}));

                        $.ajax({
                            type: "POST",
                            url: "http://api.login2explore.com:5577/api/irl",
                            data: reqStr,
                            success: function (response) {
                                try {
                                    const parsedResponse = JSON.parse(response);
                                    if (parsedResponse.data) {
                                        const record = JSON.parse(parsedResponse.data).record; // Ensure this line parses correctly
                                        loadRecord(record);
                                        setFormForUpdate();
                                    } else {
                                        clearFormFields();
                                        setFormForNewEntry();
                                    }
                                } catch (error) {
                                    console.error("Error parsing response:", error);
                                    alert("Unexpected response format. Check console for details.");
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.error("Error fetching data:", textStatus, errorThrown);
                                alert("Error checking database. Please try again.");
                            }
                        });
                    } else {
                        resetForm();
                    }
                }


                // Saves new data into the database
                function saveData() {
                    const data = collectFormData();
                    if (!validateData(data)) {
                        alert("Please fill out all fields.");
                        return;
                    }
                    const reqStr = createPUTRequest(connectionToken, JSON.stringify(data), dbName, relName);
                    $.ajax({
                        type: "POST",
                        url: "http://api.login2explore.com:5577/api/iml",
                        data: reqStr,
                        success: function () {
                            alert("Record saved successfully.");
                            resetForm();
                        },
                        error: function () {
                            alert("Error saving data.");
                        }
                    });
                }

                function updateData() {
                    const rollNo = document.getElementById("rollNo").value;
                    const data = {
                        fullName: document.getElementById("fullName").value,
                        class: document.getElementById("class").value,
                        birthDate: document.getElementById("birthDate").value,
                        address: document.getElementById("address").value,
                        enrollmentDate: document.getElementById("enrollmentDate").value
                    };

                    // Validate data
                    if (!validateData(data)) {
                        alert("Please fill out all fields.");
                        return;
                    }

                    // Construct the update request in correct format
                    const updateRecord = {};
                    updateRecord[rollNo] = data;  // Use rollNo as the key

                    const reqString = {
                        token: connectionToken,
                        cmd: "UPDATE",
                        dbName: dbName,
                        rel: relName,
                        jsonStr: updateRecord  // Pass directly as an object, no need for JSON.stringify here
                    };

                    console.log("Request data:", reqString);  // Log the request for debugging

                    $.ajax({
                        type: "POST",
                        url: "http://api.login2explore.com:5577/api/iml", // Correct endpoint
                        data: JSON.stringify(reqString), // Convert the whole request to JSON string
                        success: function (response) {
                            console.log("Response from server:", response);
                            alert("Record updated successfully!");
                            resetForm();  // Reset form after successful update
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error("Error updating record:", textStatus, errorThrown);
                            alert("Error updating record. Please try again.");
                        }
                    });
                }





                // Resets the form to its default state, clearing fields and disabling controls
                function resetForm() {
                    document.getElementById("studentForm").reset();
                    document.getElementById("rollNo").disabled = false;
                    document.getElementById("fullName").disabled = true;
                    document.getElementById("class").disabled = true;
                    document.getElementById("birthDate").disabled = true;
                    document.getElementById("address").disabled = true;
                    document.getElementById("enrollmentDate").disabled = true;
                    document.getElementById("saveBtn").disabled = true;
                    document.getElementById("updateBtn").disabled = true;
                    document.getElementById("rollNo").focus();
                }

                // Validates data to ensure no fields are empty
                function validateData(data) {
                    return Object.values(data).every(field => field.trim() !== "");
                }

                // Collects form data into an object
                function collectFormData() {
                    return {
                        rollNo: document.getElementById("rollNo").value,
                        fullName: document.getElementById("fullName").value,
                        class: document.getElementById("class").value,
                        birthDate: document.getElementById("birthDate").value,
                        address: document.getElementById("address").value,
                        enrollmentDate: document.getElementById("enrollmentDate").value
                    };
                }

                // Loads a record into the form fields
                function loadRecord(record) {
                    document.getElementById("rollNo").value = record.rollNo;
                    document.getElementById("fullName").value = record.fullName;
                    document.getElementById("class").value = record.class;
                    document.getElementById("birthDate").value = record.birthDate;
                    document.getElementById("address").value = record.address;
                    document.getElementById("enrollmentDate").value = record.enrollmentDate;
                }

                // Prepares the form for updating an existing entry
                function setFormForUpdate() {
                    document.getElementById("rollNo").disabled = true;
                    document.getElementById("fullName").disabled = false;
                    document.getElementById("class").disabled = false;
                    document.getElementById("birthDate").disabled = false;
                    document.getElementById("address").disabled = false;
                    document.getElementById("enrollmentDate").disabled = false;
                    document.getElementById("saveBtn").disabled = true;
                    document.getElementById("updateBtn").disabled = false;
                    document.getElementById("fullName").focus();
                }

                // Prepares the form for a new entry
                function setFormForNewEntry() {
                    document.getElementById("rollNo").disabled = false;
                    document.getElementById("fullName").disabled = false;
                    document.getElementById("class").disabled = false;
                    document.getElementById("birthDate").disabled = false;
                    document.getElementById("address").disabled = false;
                    document.getElementById("enrollmentDate").disabled = false;
                    document.getElementById("saveBtn").disabled = false;
                    document.getElementById("updateBtn").disabled = true;
                }

                // Clears form fields for a new entry
                function clearFormFields() {
                    document.getElementById("fullName").value = "";
                    document.getElementById("class").value = "";
                    document.getElementById("birthDate").value = "";
                    document.getElementById("address").value = "";
                    document.getElementById("enrollmentDate").value = "";
                }
