import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../Packages/components/Pagination";
import { fetchDataFromAPI } from "../../../Api/fetchData";
import { BASE_URL } from "../../../Api/urls";

Modal.setAppElement("#root"); // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

const Users = ({ data }) => {
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [bookingsModalIsOpen, setBookingsModalIsOpen] = useState(false);
  const [fieldModalIsOpen, setFieldModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [users, setUsers] = useState([]);
  console.log(selectedBookings, "selectedBookings");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}users?page=${currentPage}`
        );
        console.log(response, "response partners");
        if (response) {
          setUsers(response.data);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, [currentPage]);

  const openImageModal = (image) => {
    setSelectedImage(image);
    setImageModalIsOpen(true);
  };

  const openBookingsModal = async (id) => {
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}user-visa-orders`,
        { id: id }
      );
      console.log(response, "response data");
      if (response) {
        setSelectedBookings(response.data);
      }
    } catch (error) {
      console.log(error);
    }

    setBookingsModalIsOpen(true);
  };

  const openFieldModal = (field) => {
    setSelectedField(field);
    setFieldModalIsOpen(true);
  };

  const closeModal = () => {
    setImageModalIsOpen(false);
    setBookingsModalIsOpen(false);
    setFieldModalIsOpen(false);
  };

  const truncateText = (text, length = 20) => {
    if (!text) {
      return (
        <span
          className="text-red-500 cursor-pointer"
          onClick={() => openFieldModal("Not Updated")}
        >
          Not Updated
        </span>
      );
    }
    if (text.length <= length) return text;
    return (
      <span className="cursor-pointer" onClick={() => openFieldModal(text)}>
        {text.substring(0, length)}...
      </span>
    );
  };

  return (
    <div className="relative p-5 bg-slate-300 w-full h-full">
      <div className="w-full max-h-[85%] overflow-auto min-h-[85%] ">
        <table className="min-w-full divide-y overflow-auto divide-gray-200">
          <thead className="bg-[#11aaf6] text-center">
            <tr className="text-center">
              {[
                "S No",
                "Name",
                "Gender",
                "Phone",
                "Email",
                "Passport Number",
                "Passport Expiry",
                "Occupation",
                "Address",
                "Image",

                "Bookings",
                "Delete",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 min-w-32 bg-[#11aaf6] text-xs font-medium text-white uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-center divide-gray-200">
            {users?.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-1 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {truncateText(
                    `${user?.firstName || ""} ${user?.lastName || ""}`
                  )}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {truncateText(user?.gender)}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {truncateText(user?.phoneNumber)}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {truncateText(user?.email)}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {truncateText(user?.passportNumber)}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {truncateText(user?.passportExpiry?.slice(0, 10))}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {truncateText(user?.occupation)}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {truncateText(
                    `${user?.addressLineOne || ""} ${
                      user?.addressLineTwo || ""
                    }`
                  )}
                </td>
                <td className="px-6 py-1 items-center flex justify-center whitespace-nowrap">
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => openImageModal(user?.image)}
                  />
                </td>

                <td className="px-6 py-1 items-center pl-12 justify-center whitespace-nowrap">
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => openBookingsModal(user?._id)}
                  />
                </td>
                <td className="px-6 py-1 items-center  flex justify-center whitespace-nowrap">
                  <FaTrash className="cursor-pointer text-red-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={imageModalIsOpen}
        onRequestClose={closeModal}
        height={300}
        width={300}
        contentLabel="Image Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="">
          ❌
        </button>
        <img
          src={selectedImage}
          alt="User"
          className="w-full h-full object-cover"
        />
      </Modal>

      {/* Bookings Modal */}
      <Modal
        isOpen={bookingsModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Bookings Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div>
          {/* <button onClick={closeModal} className="close-modal-btn">
            ❌
          </button> */}
        </div>
        <table className="min-w-full divide-y overflow-auto divide-gray-200">
          <thead className="bg-[#11aaf6] text-center">
            <tr className="text-center">
              {[
                "Booking ID",
                "Booking Date",
                "Status",
                "Insurance",
                "Travellers Count",
                "Country",
                "Application Type",
                "Total Amount",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 min-w-32 bg-[#11aaf6] text-xs font-medium text-white uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-center divide-gray-200">
            {selectedBookings?.map((booking, index) => (
              <tr key={index}>
                <td className="px-6 py-1 whitespace-nowrap">{booking?._id}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {booking?.createdAt?.slice(0, 10)}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {booking?.status}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {booking?.insurance ? (
                    <span className="text-green-500"> Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {booking?.travellersCount}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {booking?.country}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {booking?.applicationType}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {Math.floor(booking?.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>

      {/* Field Modal */}
      <Modal
        isOpen={fieldModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Field Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="close-modal-btn">
          ❌
        </button>
        <div className="p-5">
          <p>{selectedField}</p>
        </div>
      </Modal>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Users;