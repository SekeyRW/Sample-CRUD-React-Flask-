import {useEffect, useState} from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {toast} from "react-toastify";
import {Button, Modal} from "react-bootstrap";
import {socket} from "./Utils/SocketInstance";

function Home() {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({});

    const [showAddModal, setAddModal] = useState(false);
    const [showAddConfrimModal, setAddConfirmModal] = useState(false);
    const [isModifying, setModifying] = useState(false);

    const [update_id, setUpdateId] = useState('')
    const [showEditModal, setEditModal] = useState(false);
    const [showEditConfrimModal, setEditConfirmModal] = useState(false);

    const [deleteDataId, setDeleteDataId] = useState(null);
    const [deleteDataName, setDeleteDataName] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const pageCount = Math.ceil(total / pageSize);
    const handlePageChange = ({selected}) => {
        setPageNumber(selected);
    };

    {/* Mao ning icall ni frontend kay backend using axios */
    }
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/posts?page=${pageNumber + 1}&page_size=${pageSize}`, {})
            .then(response => {
                setData(response.data.data)
                setTotal(response.data.total);
            })
            .catch(error => {
                console.log(error)
            })
    }, [pageNumber, pageSize])

    {/* Mao ning mag handle sa ADD NEW DATA */
    }

    function confirmAddPost(event) {
        event.preventDefault()
        setModifying(true)

        const formData = new FormData(event.target);

        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
        };
        setFormData(data);
        setAddConfirmModal(true);
    }

    function handleAddPost() {
        axios.post(`${process.env.REACT_APP_API_URL}/add/post`, formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                toast.success(response.data.message)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setModifying(false)
                setAddModal(false)
                setFormData({})
            })
    }

    {/* Mao ning mag handle sa EDIT DATA */
    }

    function confirmEditData(event) {
        event.preventDefault()
        setModifying(true)

        const formData = new FormData(event.target);

        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
        };
        setFormData(data);
        setEditConfirmModal(true);
    }

    function handleEditData() {
        axios.put(`${process.env.REACT_APP_API_URL}/update/post/${update_id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                toast.success(response.data.message)
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setModifying(false)
                setEditModal(false)
                setUpdateId('')
            })
    }

    {/* Mao ning mag handle sa DELETE DATA */
    }

    function confirmDeleteData(id, title) {
        setDeleteDataId(id);
        setDeleteDataName(`${title}`);
        setShowDeleteModal(true);
    }

    function handleDeleteData(id) {
        fetch(`${process.env.REACT_APP_API_URL}/delete/post/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                toast.success('Post removed successfully.');
            })
            .catch(error => {
                console.error(error);
            });
    }

    {/* Mao Ning Para sa SocketIO */
    }
    useEffect(() => {
        socket.on('post_added', (newData) => {
            setData(prevData => [newData, ...prevData]);
        });
        socket.on('post_updated', (newData) => {
            setData((prevData) => prevData.map(data => data.id === newData.id ? newData : data))
        });
        socket.on('post_deleted', (id) => {
            setData((prevData) => prevData.filter(post => post.id !== id));
        });

        return () => {
            socket.off('post_added');
            socket.off('post_updated');
            socket.off('post_deleted');
        };
    }, []);


    return (
        <>
            <div className="container">
                <h3>POSTS</h3>
                <div className="card shadow border-primary mb-3 mx-4">
                    <div className="card-header">
                        <p className="text-primary m-0 fw-bold d-inline">Posts</p>
                        <button className="btn btn-primary text-end float-end btn-sm" onClick={() => {
                            setAddModal(true)
                        }}>Add New Post
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className='col-md'>
                                <select className="form-control" value={pageSize} onChange={e => {
                                    setPageSize(Number(e.target.value));
                                    setPageNumber(0); // Reset the page number when the page size changes
                                }}>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive table mt-2" id="dataTable" role="grid"
                             aria-describedby="dataTable_info">
                            <table className="table my-0" id="dataTable">
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center"><strong>No results found.</strong></td>
                                    </tr>
                                ) : (
                                    data.map((data) => (
                                        <tr key={data.id}>
                                            <td>{data.title}</td>
                                            <td>{data.description}</td>
                                            <td>
                                                <td>
                                                    <button className="btn btn-warning btn-sm me-2" onClick={() => {
                                                        setUpdateId(data.id)
                                                        setFormData({
                                                            title: data.title,
                                                            description: data.description,
                                                        });
                                                        setEditModal(true)
                                                    }}><i className='fas fa-edit'></i></button>
                                                    <button className="btn btn-danger btn-sm"
                                                            onClick={() => confirmDeleteData(data.id, data.title)}>
                                                        <i
                                                            className='fas fa-trash-alt'></i></button>
                                                </td>
                                            </td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>
                        <ReactPaginate
                            pageCount={pageCount}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            onPageChange={handlePageChange}
                            containerClassName="pagination justify-content-center mt-3"
                            activeClassName="active"
                            pageLinkClassName="page-link"
                            previousLinkClassName="page-link"
                            nextLinkClassName="page-link"
                            breakLinkClassName="page-link"
                            pageClassName="page-item"
                            previousClassName="page-item"
                            nextClassName="page-item"
                            breakClassName="page-item"
                            disabledClassName="disabled"
                        />
                    </div>
                </div>
            </div>

            <Modal
                size="lg"
                show={showAddModal}
                onHide={() => setAddModal(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Add New Post
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={confirmAddPost}>
                        <label className="form-label">Title</label>
                        <input className="form-control" type="text" name="title" id="title"
                               placeholder="Enter Title"
                               required/>
                        <label className="form-label">Description</label>
                        <textarea className='form-control' name='description' id='description' required></textarea>
                        <div className="align-content-end">
                            <button className="btn btn-primary float-end mt-3" disabled={isModifying}
                            >{isModifying ? <i className="fa fa-spinner fa-spin"></i> : "Add"}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showAddConfrimModal} onHide={() => setAddConfirmModal(false)} backdrop='static'>
                <Modal.Header>
                    <Modal.Title>Confirm Post Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Description:</strong> {formData.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setAddConfirmModal(false);
                        setModifying(false);
                    }
                    }>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setAddConfirmModal(false);
                        handleAddPost();
                    }}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                size="lg"
                show={showEditModal}
                onHide={() => setEditModal(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Edit Post Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={confirmEditData}>
                        <label className="form-label">Title</label>
                        <input className="form-control" type="text" name="title" id="title"
                               value={formData.title}
                               onChange={(e) => setFormData({...formData, title: e.target.value})}
                               required/>
                        <label className="form-label">Description</label>
                        <textarea className="form-control" name="description" id="description"
                                  value={formData.description}
                                  required
                                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                        <div className="align-content-end">
                            <button className="btn btn-primary float-end mt-3" disabled={isModifying}
                            >{isModifying ? <i className="fa fa-spinner fa-spin"></i> : "Update"}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditConfrimModal} onHide={() => setEditConfirmModal(false)} backdrop='static'>
                <Modal.Header>
                    <Modal.Title>Confirm Post Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Description:</strong> {formData.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setEditConfirmModal(false);
                        setModifying(false);
                    }
                    }>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setEditConfirmModal(false);
                        handleEditData();
                    }}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop='static'>
                <Modal.Header>
                    <Modal.Title>Delete Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete {deleteDataName}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => {
                        handleDeleteData(deleteDataId);
                        setShowDeleteModal(false);
                    }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Home