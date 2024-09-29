import React, { useState } from "react";
import Modal from "react-modal";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import SoldBtn from "./SoldBtn";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    color: "white",
    backgroundColor: "#1d1d1d", // Dark background
    border: "none",
    borderRadius: "8px",
    padding: "50px",
    height: "500px",
    width: "500px",
    display: "flex", // Add flex display
    justifyContent: "start", // Center items horizontally

    flexDirection: "column", // Stack items vertically
    margin: "auto", // Center the modal
  },
};

const ReturnTable = ({ shoes }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);

  // Calculate total pages
  const totalPages = Math.ceil(shoes.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get current items
  const currentItems = shoes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (shoeData) => {
    setSelectedShoe(shoeData);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedShoe(null);
  };

  const handleSold = async () => {
    if (!selectedShoe) return;

    // Make the PUT request to update the shoe's availability
    try {
      const response = await fetch(`https://shoesyncv1.vercel.app/api/shoes/${selectedShoe._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newAvailability: "AVAIL" }),
      });

      if (response.ok) {
        // Close the modal
        closeModal();

        // Refresh the page
        window.location.reload(); // Reload the page
      } else {
        console.error("Failed to update shoe availability");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Table>
        <TableCaption>A list of inventory.</TableCaption>
        <TableCaption>
          <Pagination className="pagination-inventory">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  style={{ color: "white" }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                    style={{ color: "white" }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    handlePageChange(
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    color: "white",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>SKU NO.</TableHead>
            <TableHead>Shoes Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((shoeData) => (
            <TableRow className="dh-table-item" key={shoeData._id}>
              <TableCell className="font-medium">{shoeData.number}</TableCell>
              <TableCell>{shoeData.sku}</TableCell>
              <TableCell>{shoeData.name}</TableCell>
              <TableCell>{shoeData.size}</TableCell>
              <TableCell>₱{shoeData.price}</TableCell>
              <TableCell>{shoeData.location}</TableCell>
              <TableCell>{shoeData.owner}</TableCell>
              <TableCell className="text-center">
                <button onClick={() => openModal(shoeData)}>
                  <SoldBtn />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false} // Hide app to avoid screen reading issues
      >
        <h2 className="text-5xl font-bold mb-5">Are you sure?</h2>
        {selectedShoe && (
          <div className="my-4 text-xl font-semibold flex flex-col gap-2">
            <p>Name: {selectedShoe.name}</p>
            <p>Number: {selectedShoe.number}</p>
            <p>SKU: {selectedShoe.sku}</p>
            <p>Size: {selectedShoe.size} US</p>
          </div>
        )}
        <div className="flex justify-end space-x-4 absolute bottom-0 right-0 m-6">
          <button
            onClick={handleSold}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-500 transition-all 0.3s"
          >
            Yes, Mark as return
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-all 0.3s"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ReturnTable;
