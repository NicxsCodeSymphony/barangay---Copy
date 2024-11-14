import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionModal from "./transaction";  // Import the TransactionModal
import { toast } from "sonner";

const PrintTemplateCert = ({ resident, printType, handleClose }) => {
  const currentDate = new Date().toLocaleDateString();

  const [barangay, setBarangay] = useState(null);
  const [official, setOfficial] = useState(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const fetchBarangay = async () => {
    const res = await axios.get("http://localhost/barangay/backend/barangay/fetch.php");
    const off = await axios.get("http://localhost/barangay/backend/official/fetchOfficial.php");
    setOfficial(off.data[0]);
    setBarangay(res.data[0]);
  };

  useEffect(() => {
    fetchBarangay();
  }, []);

  const handlePrint = () => {
    const mockTransaction = {
      resident_id: parseInt(resident.resident_id),
      resident_name: `${resident.first_name} ${resident.last_name}`,
      certificate: "Barangay Certification",
      payment_fee: 100.0,
    };

    setTransactionDetails(mockTransaction);
    setTransactionModalVisible(true);
  };

  // Handle modal confirmation (saving transaction details)
  const handleModalConfirm = async (updatedTransactionDetails) => {
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token);

    try {
      const res = await axios.post("http://localhost/barangay/backend/transaction/add.php", {
        resident_id: updatedTransactionDetails.resident_id,
        transaction_code: updatedTransactionDetails.transaction_code,
        payment_method: updatedTransactionDetails.payment_method,
        certificate: updatedTransactionDetails.certificate,
        payment_fee: updatedTransactionDetails.payment_fee,
        payment_status: "Pending",
        issue_by: parseToken,
      });

      if (res.data.status === "success") {
        setTransactionDetails(null); // Clear transaction details
      } else {
        toast.error("Failed to add transaction.");
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
      toast.error("An error occurred while adding the transaction.");
    }

    setTransactionModalVisible(false);
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleModalClose = () => {
    setTransactionModalVisible(false);
  };

  const renderContent = () => {
    return (
      <>
        <div className="font-bold">
          <p className="mb-5">TO WHOM MAY IT CONCERN</p>
          <p>
            This is to certify that <strong>{resident ? resident.gender === "Male" ? "Mr." : resident?.civil_status === "Married" ? "Mrs." : "Ms." : ""} {resident.first_name} {resident.last_name}</strong>, a resident of Barangay {barangay?.barangay_name}, {barangay?.municipality}, {barangay?.province} for {resident?.age}
            {resident.residence_years} years, is a qualified availee of RA 11261 or the First Time Jobseekers Act of 2019.
          </p>
          <p className="mt-2">
            I further certify that the holder/bearer was informed in his/her rights, including the duties and responsibilities accorded by RA 11261 through the Oath of Undertaking he/she has signed and executed in the presence of our Barangay Official/s.
          </p>
          <p className="mt-2">
            Signed this <strong>{new Date().getDate()}</strong> day of{" "}
            <strong>{new Date().toLocaleString("default", { month: "long" })}, {new Date().getFullYear()}</strong>, at Barangay Combado, Tabogon, Cebu, Philippines.
          </p>
          <p className="mt-2">
            This certification is valid until <strong>{new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleString("default", { month: "long" })} {new Date().getFullYear() + 1}</strong> (one year from the date of issuance).
          </p>
        </div>
      </>
    );
  };

  useEffect(() => {
    // Dynamically add print styles to the document head
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        .buttons {
          display: none;
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .container {
          width: 100%;
          height: 100%;
          padding: 1cm;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img
          className="relative left-20"
          src={`http://localhost/barangay/backend/barangay/${barangay?.image}`}
          alt="Barangay Logo"
          style={styles.image}
        />
        <div style={styles.headerText}>
          Republic of the Philippines
          <br />
          Province of {barangay?.province}
          <br />
          Municipality of {barangay?.municipality}
          <br />
          <strong className="uppercase text-[12px]">Barangay {barangay?.barangay_name}</strong>
        </div>
        <img
          className="relative right-20"
          src="http://localhost/barangay/backend/barangay/uploads/seal.png"
          alt="Barangay Seal"
          style={styles.image}
        />
      </div>

      <div style={styles.office}>OFFICE OF THE PUNONG BARANGAY</div>

      <div style={styles.certificateTitle}>
        BARANGAY CERTIFICATION
        <br />
        <span style={{ fontSize: "11.5px", fontFamily: "inherit", fontWeight: "bold" }}>
          (First Time Job Seekers Assistant Act-RA 11261)
        </span>
      </div>

      <div style={styles.content}>{renderContent()}</div>

      <div style={styles.signature}>
        <p>
          <strong className="uppercase">{official?.first_name} {official?.last_name}</strong>
          <br />
          <span style={{ fontSize: "10px" }}>PUNONG BARANGAY</span>
        </p>
        <p className="mt-1">Date: ______________</p>

        <p className="mt-10 mb-4">Witnessed by:</p>

        <p>
          <strong>JESSIE B. LOBITAÑA</strong>
          <br />
          <span style={{ fontSize: "10px" }}>BARANGAY KAGAWAD</span>
        </p>
        <p className="mt-1">Date: ________________</p>
      </div>

      {/* Buttons */}
      <div style={styles.buttons}>
        <button style={styles.printButton} onClick={handlePrint}>
          Print
        </button>
        <button style={styles.closeButton} onClick={handleClose}>
          Close
        </button>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        show={transactionModalVisible}
        transactionDetails={transactionDetails}
        onConfirm={handleModalConfirm}
        onClose={handleModalClose}
      />
    </div>
  );
};

const styles = {
  container: {
    width: "21.59cm",
    height: "27.94cm",
    paddingTop: "1cm",
    paddingBottom: "1cm",
    paddingLeft: "2cm",
    paddingRight: "2cm",
    fontFamily: "Times New Roman, Times, serif",
    overflow: "hidden",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "2.75cm",
    height: "2.75cm",
  },
  headerText: {
    flexGrow: 1,
    textAlign: "center",
    fontSize: "12px",
    lineHeight: "1.5",
  },
  office: {
    fontFamily: "'Ink Free', cursive",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "20px",
    textAlign: "center",
  },
  certificateTitle: {
    fontFamily: "'inherit'",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "20px",
    textAlign: "center",
  },
  content: {
    marginTop: "40px",
    fontFamily: "Calibri, sans-serif",
    fontSize: "12px",
    lineHeight: "1.6",
    textAlign: "justify",
  },
  signature: {
    marginTop: "50px",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
  },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    marginTop: "30px",
  },
  buttons: {
    textAlign: "center",
    marginTop: "20px",
  },
  printButton: {
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    marginRight: "10px",
    borderRadius: "5px",
  },
  closeButton: {
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default PrintTemplateCert;
