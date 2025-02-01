import { useEffect, useState } from "react";
import axios from "axios";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch documents from API
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/documents`)
      .then((res) => setDocuments(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle form submission (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing document (PUT request)
        const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/documents/${editingId}`, {
          title,
          content,
        });

        // Update the UI
        setDocuments(documents.map((doc) => (doc._id === editingId ? res.data : doc)));
        setEditingId(null);
      } else {
        // Create new document (POST request)
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/documents`, {
          title,
          content,
        });

        // Update UI with the new document
        setDocuments([...documents, res.data]);
      }

      // Clear input fields
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/documents/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id)); // Remove from UI
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Handle Edit
  const handleEdit = (doc) => {
    setEditingId(doc._id);
    setTitle(doc.title);
    setContent(doc.content);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-bold text-center mb-5">📄 Documents</h1>

      {/* Form to Add/Edit Document */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {editingId ? "Update Document" : "Add Document"}
        </button>
      </form>

      {/* Display Documents */}
      <ul className="mt-5 space-y-4">
        {documents.map((doc) => (
          <li key={doc._id} className="p-4 border rounded-md shadow-sm bg-gray-100">
            <h3 className="text-xl font-semibold">{doc.title}</h3>
            <p className="text-gray-700">{doc.content}</p>

            <div className="mt-3 flex space-x-3">
              <button
                onClick={() => handleEdit(doc)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
              >
                ✏ Edit
              </button>
              <button
                onClick={() => handleDelete(doc._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
              >
                🗑 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Documents;
