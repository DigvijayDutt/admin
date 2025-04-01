import { useEffect, useState } from "react";
import axios from "axios";
import { Trash, PencilSimpleLine } from "@phosphor-icons/react";
import NavBar from "../assets/Navbar";
import SideBar from "../assets/SideBar";
import '../styles/CourseManage.css';

function FAQManage() {
    const [faqs, setFaqs] = useState([]);
    const [categories] = useState(['General', 'Technical', 'Payment', 'Account']);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("General");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingFaq, setEditingFaq] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/faqs");
                setFaqs(response.data);
            } catch (err) {
                console.error("Error fetching FAQs:", err);
            }
        };
        fetchFAQs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const faqData = {
                question,
                answer,
                category: selectedCategory
            };

            if (editingFaq) {
                // Update FAQ
                const response = await axios.put(
                    `http://localhost:5000/faqs/${editingFaq.id}`,
                    faqData
                );
                setFaqs(faqs.map(faq => 
                    faq.id === editingFaq.id ? response.data : faq
                ));
            } else {
                // Create FAQ
                const response = await axios.post(
                    "http://localhost:5000/faqs",
                    faqData
                );
                setFaqs([...faqs, response.data]);
            }

            resetForm();
        } catch (err) {
            alert(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    const deleteFAQ = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/faqs/${id}`);
            setFaqs(faqs.filter(faq => faq.id !== id));
        } catch (err) {
            alert(`Error deleting FAQ: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setSelectedCategory(faq.category);
    };

    const resetForm = () => {
        setEditingFaq(null);
        setQuestion("");
        setAnswer("");
        setSelectedCategory("General");
    };

    return (
        <>
            <SideBar />
            <div className="course-management">
                <NavBar />
                
                <header className="CMheader">
                    <h1>FAQ Management</h1>
                    <p>Manage frequently asked questions and answers</p>
                </header>

                <div className="container">
                    <form onSubmit={handleSubmit} className="course-form">
                        <h2>{editingFaq ? 'Edit FAQ' : 'Create FAQ'}</h2>
                        
                        <div className="form-group">
                            <label>Question</label>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Answer</label>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                required
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="form-select"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingFaq ? 'Update' : 'Create'}
                            </button>
                            {editingFaq && (
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="course-list">
                        <h2>FAQ List</h2>
                        
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Answer</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs
                                    .filter(faq => 
                                        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(faq => (
                                        <tr key={faq.id}>
                                            <td>{faq.question}</td>
                                            <td>{faq.answer}</td>
                                            <td>{faq.category}</td>
                                            <td>
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(faq)}
                                                >
                                                    <PencilSimpleLine />
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => deleteFAQ(faq.id)}
                                                >
                                                    <Trash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FAQManage;