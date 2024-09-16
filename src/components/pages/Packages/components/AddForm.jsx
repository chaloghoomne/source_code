import React, { useEffect, useState } from "react";
import { fetchDataFromAPI } from "../../../../Api/fetchData";
import { BASE_URL } from "../../../../Api/urls";
import { toast } from "react-toastify";

const AddForm = ({ handleActive }) => {
  const [headings, setHeadings] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [points, setPoints] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);

  const [formData, setFormData] = useState({
    country: "",
    heading: "",
    description: "",
    price: "",
    image: null,
    rating: "",
    showCoTraveller: "",
    tourTypes: [],
    documents: [],
    docHeading: "",
    docDescription: "",
    docPoints: [],
  });
  const [documents, setDocuments] = useState([]);

  console.log(formData, "select");
  const handlePointChange = (e, pointItem) => {
    if (e.target.checked) {
      // Add the point to selected points
      setSelectedPoints([...selectedPoints, pointItem.point]);
    } else {
      // Remove the point from selected points
      setSelectedPoints(
        selectedPoints.filter((point) => point !== pointItem.point)
      );
    }
  };

  console.log(documents);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}package-note-by-type/heading`
        );
        console.log(response, "response headings");
        if (response) {
          setHeadings(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}package-note-by-type/description`
        );
        console.log(response, "response descriptions");
        if (response) {
          setDescriptions(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}package-note-by-type/point`
        );
        console.log(response, "response point");
        if (response) {
          setPoints(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);

  // const handleDocumentChange = (index, e) => {
  //   const updatedDocuments = documents.map((item, i) =>
  //     i === index ? { ...item, [e.target.name]: e.target.value } : item
  //   );
  //   setDocuments(updatedDocuments);
  // };

  const handleRemoveDocument = (index) => {
    const updatedDocuments = documents.filter((item, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleTourTypeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTourTypes = [...formData.tourTypes];
    updatedTourTypes[index] = { ...updatedTourTypes[index], [name]: value };
    setFormData({ ...formData, tourTypes: updatedTourTypes });
  };

  const handleAddDocument = () => {
    setDocuments([...documents, { name: "", image: null }]);
  };

  const handleDocumentChange = (index, e) => {
    const updatedDocuments = documents.map((item, i) =>
      i === index ? { ...item, [e.target.name]: e.target.value } : item
    );
    setDocuments(updatedDocuments);
  };

  const handleDocumentImageChange = (index, e) => {
    const updatedDocuments = documents.map((item, i) =>
      i === index ? { ...item, image: e.target.files[0] } : item
    );
    setDocuments(updatedDocuments);
  };

  const handleTourTypeImageChange = (index, e) => {
    const updatedTourTypes = [...formData.tourTypes];
    updatedTourTypes[index] = {
      ...updatedTourTypes[index],
      image: e.target.files[0],
    };
    setFormData({ ...formData, tourTypes: updatedTourTypes });
  };

  const addTourType = () => {
    setFormData({
      ...formData,
      tourTypes: [...formData.tourTypes, { name: "", image: null }],
    });
  };

  const removeTourType = (index) => {
    const updatedTourTypes = formData.tourTypes.filter((_, i) => i !== index);
    setFormData({ ...formData, tourTypes: updatedTourTypes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData?.tourTypes?.length < 1) {
      toast.error(`Please Add at least One Visa Category`);
      return;
    }

    const data = new FormData();
    data.append("country", formData.country);
    data.append("heading", formData.heading);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);
    data.append("docHeading", formData.docHeading);
    data.append("docDescription", formData.docDescription);
    documents.forEach((item, index) =>
      data.append(`documents[${index}][name]`, item.name)
    );
    // data.append("showCoTraveller", formData.showCoTraveller);
    formData.tourTypes.forEach((tourType, index) => {
      data.append(`tourTypes[${index}][name]`, tourType.name);
      //  data.append(`tourTypes[${index}][tourTypes]`, tourType.image);
    });
    formData.tourTypes.forEach((item) => data.append("tourTypes", item.image));
    documents.forEach((item) => data.append("documents", item.image));
    selectedPoints.forEach((item) => data.append("docPoints", item));
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}add-place`,
        data
      );
      console.log(response);
      if (response) {
        toast.success(" Added successfully");
        handleActive("list");
      }
    } catch (error) {
      console.log(error);
      alert("Error In Adding ");
    }
  };

  const handleNext = () => {
    setFormData({ ...formData, documents: documents });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Heading
        </label>
        <input
          type="text"
          name="heading"
          value={formData.heading}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
          pattern="[0-9]*"
          // inputmode="numeric"
        />
      </div>
      <div className="">
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block bg-white p-1 px-2 rounded-md w-full"
          required
        />
      </div>
      {/* <div>
        <label className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div> */}
      {/* <div>
        <label className="block text-sm font-medium text-gray-700">
          Show Co-Traveller
        </label>
        <select
          name="showCoTraveller"
          value={formData.showCoTraveller}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select </option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div> */}
      <div>
        <h3
          style={{ textShadow: "2px 2px 4px rgba(66, 185, 245, 0.5)" }}
          className="text-2xl text-center drop-shadow-xl mt-8 font-medium text-gray-800"
        >
          Visa Categories
        </h3>
        {/* <h3 className="text-lg font-medium text-gray-700">Tour Types</h3> */}
        {formData.tourTypes.map((tourType, index) => (
          <div
            key={index}
            className="mt-4 p-4 border border-gray-300 rounded-md space-y-2"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Visa Category Name
              </label>
              <input
                type="text"
                name="name"
                value={tourType.name}
                onChange={(e) => handleTourTypeChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Visa Category Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleTourTypeImageChange(index, e)}
                className="mt-1 block w-full"
                required
              />
              {tourType.image && (
                <img
                  src={URL.createObjectURL(tourType.image)}
                  alt={tourType.name}
                  className="mt-2 w-20 h-20 object-cover"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => removeTourType(index)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTourType}
          className="mt-4 px-4 py-2 bg-[#11aaf6] text-white rounded-md"
        >
          Add Visa Category
        </button>
      </div>
      {/* <div>
        <h3
          style={{ textShadow: "2px 2px 4px rgba(66, 185, 245, 0.5)" }}
          className="text-2xl text-center drop-shadow-xl mt-8 font-medium text-gray-800"
        >
          Visa Documents
        </h3>
        <div className="space-y-2">
          {documents?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col w-full justify-between gap-5 space-y-2 my-2"
            >
              <input
                type="text"
                name="name"
                value={item.name}
                onChange={(e) => handleDocumentChange(index, e)}
                className="p-2 border w-[90%] border-gray-300 rounded-md"
                placeholder="Document Name"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleDocumentImageChange(index, e)}
                className="mt-1 block w-full"
                required
              />
              {item.image && (
                <img
                  src={URL.createObjectURL(item.image)}
                  alt={item.name}
                  className="mt-2 w-20 h-20 object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => handleRemoveDocument(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDocument}
            className="px-4 py-2 bg-[#11aaf6] text-white rounded-md"
          >
            Add Document
          </button>
        </div>
        <div className="flex justify-between">
          <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 text-black rounded-md"
        >
          Back
        </button>
          <button
            onClick={() => handleNext()}
            className="px-4 py-2 mt-5 bg-[#11aaf6] text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div> */}
      {/* <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Documents Heading
        </label>
        <select
          name="docHeading"
          value={formData.docHeading}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Heading</option>
          {headings?.map((country) => {
            return (
              <>
                <option value={country?.heading}>{country?.heading}</option>
              </>
            );
          })}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Documents Description
        </label>
        <select
          name="docDescription"
          value={formData.docDescription}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Description</option>
          {descriptions?.map((country) => {
            return (
              <>
                <option value={country?.description}>
                  {country?.description}
                </option>
              </>
            );
          })}
        </select>
      </div>
      <div>
        <h3 className="block text-sm font-medium text-gray-700">
          Select Points
        </h3>
        {points.map((pointItem, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`point-${index}`}
              name="docPoints"
              value={pointItem.point}
              onChange={(e) => handlePointChange(e, pointItem)}
              checked={selectedPoints.includes(pointItem.point)}
              className="mr-2"
            />
            <label htmlFor={`point-${index}`}>{pointItem.point}</label>
          </div>
        ))}
      </div> */}

      <button
        type="submit"
        className="px-4 py-2 bg-[#11aaf6] text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default AddForm;
