import React, { useState } from "react";
import PrintTemplateResidency from "./printTemplate/residency";
import PrintTemplateCert from "./printTemplate/cert";
// import IDTemplate from "./printTemplate/IDTemplate";
// import ClearanceTemplate from "./printTemplate/ClearanceTemplate";

const PrintModal = ({ isModalOpen, setIsModalOpen, resident }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedDocument(null); 
  };

  const handlePrint = () => {
    if (!selectedDocument) {
      console.log("No document type selected.");
      return;
    }

    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  if (!resident) return null;

  const renderDocumentTemplate = () => {
    switch (selectedDocument) {
      case "residency":
        return <PrintTemplateResidency resident={resident} handleClose={handleClose} />;
      case "certificate":
        return <PrintTemplateCert resident={resident} handleClose={handleClose} />;
      // case "id":
      //   return <IDTemplate resident={resident} handleClose={handleClose} />;
      // case "clearance":
      //   return <ClearanceTemplate resident={resident} handleClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center ${isModalOpen ? "" : "hidden"} z-0`}
    >
      <div className="bg-white p-6 w-1/2 rounded-lg shadow-xl relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          X
        </button>

        <div className="mt-4">
          {!selectedDocument && (
            <div>
              <button
                onClick={() => setSelectedDocument("residency")}
                className="block w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Print Barangay Residency
              </button>
              <button
                onClick={() => setSelectedDocument("certificate")}
                className="block w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Print Barangay Certificate
              </button>
              <button
                onClick={() => setSelectedDocument("id")}
                className="block w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Print Barangay ID
              </button>
              <button
                onClick={() => setSelectedDocument("clearance")}
                className="block w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Print Barangay Clearance
              </button>
            </div>
          )}

          {selectedDocument && (
            <div>
              <p className="text-lg font-medium mb-2">You are about to print:</p>
              <p className="text-xl font-bold mb-4">
                {selectedDocument === "residency"
                  ? "Barangay Residency"
                  : selectedDocument === "certificate"
                  ? "Barangay Certificate"
                  : selectedDocument === "id"
                  ? "Barangay ID"
                  : "Barangay Clearance"}
              </p>

              <button
                onClick={handlePrint}
                className="block w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Print {selectedDocument === "residency"
                  ? "Barangay Residency"
                  : selectedDocument === "certificate"
                  ? "Barangay Certificate"
                  : selectedDocument === "id"
                  ? "Barangay ID"
                  : "Barangay Clearance"}
              </button>
            </div>
          )}
        </div>

        {selectedDocument && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 w-[100vh] h-[100vh] rounded-lg">
              {renderDocumentTemplate()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintModal;
