import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import appConfig from '../../config/app.config';
import axios from 'axios';
import Swal from 'sweetalert2';

Modal.setAppElement('#root')

function PageSpecies() {
    const [speciesList, setSpeciesList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [modal, setModal] = useState({});
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [editFlag, setEditFlag] = useState(false);
    const url = `${appConfig.baseURL}/api/species`;

    const customStyles = {
        content: {
            top: '40%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '60%'
        }
    };
    const closeModal = () => {
        setModalShow(false);
        setEditFlag(false);
        setName("");
        setCode("");
    };

    const addModal = () => {
        setModalShow(true);
        setModal({ code: "", name: "" })
        setName("");
        setCode("");
    };

    const vaildInput = () => {
        let msg = "";

        if (name === null || name.trim().length === 0) {
            msg += "Species Name, ";
        }
        if (code === null || code.trim().length === 0) {
            msg += "Species Code, ";
        }

        if (msg.trim().length > 0) {
            msg.slice(0, msg.length - 2)
        }

        return msg;
    };

    const deleteModal = (item) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let deleteURL = url + "/" + item.id;

                axios.delete(deleteURL)
                    .then((resp) => {
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        );
                        fetchSpecies();
                    }).catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong! It could be used in the inventory table.'
                        })
                        if (error.response && error.response.data && error.response.data.message) {
                            console.log(`error: ${error.response.data.message}`);
                        }
                        else {
                            console.log(`error: ${error.message}`);
                        }
                    })
            }
        });
    };

    const save = () => {
        let editURL = url;
        let msg = vaildInput();

        if (msg.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: msg + ' could not be empty!'
            });
        }
        else {
            if (editFlag) {
                editURL = editURL + "/" + modal.id;

                axios.put(editURL, { code: code, name: name })
                    .then((resp) => {
                        Swal.fire('Updated!', '', 'success')
                        fetchSpecies();
                        closeModal();
                    }).catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!'
                        });
                        if (error.response && error.response.data && error.response.data.message) {
                            console.log(`error: ${error.response.data.message}`);
                        }
                        else {
                            console.log(`error: ${error.message}`);
                        }
                    })
            }
            else {
                axios.post(editURL, { code: code, name: name })
                    .then((resp) => {
                        Swal.fire('Saved!', '', 'success');
                        fetchSpecies();
                        closeModal();
                    }).catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!'
                        });
                        if (error.response && error.response.data && error.response.data.message) {
                            console.log(`error: ${error.response.data.message}`);
                        }
                        else {
                            console.log(`error: ${error.message}`);
                        }
                    })
            }
        }
    };

    const columns = [
        {
            name: "Code",
            selector: 'code'
        },
        {
            name: "Name",
            selector: 'name'
        },
        {
            name: '',
            cell: (c) => {
                return (
                    <div className="form-group">
                        <button onClick={() => {
                            setModalShow(true);
                            setEditFlag(true);
                            setModal(c);
                            setCode(c.code);
                            setName(c.name);
                        }}
                            className="btn btn-default">Edit
                        </button>
                        <button onClick={() => { deleteModal(c) }}
                            className="btn btn-default">Delete
                        </button>
                    </div>
                )
            }
        }
    ]

    const [filter, setFilter] = useState("");

    const SpeciesTable = (props) => {
        const filteredItems = props.speciesList.filter(item =>
            (
                (item.code && item.code.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.name && item.name.toLowerCase().includes(props.searchFilter.toLowerCase()))
            )
        )

        return (
            props.speciesList.length > 0 &&
            <DataTable
                className="table table-bordered table-primary no-footer"
                noHeader={true}
                columns={props.columns}
                data={props.searchFilter.trim().length > 0 ? filteredItems : props.speciesList}
                highlightOnHover
                pagination={true}
                wrap={true}
                paginationRowsPerPageOptions={[10, 20, 40, 50, 100, 200, 1000]}
            />
        )
    };

    const fetchSpecies = () => {
        axios(url)
            .then((resp) => {
                let speciesList = resp.data;
                setSpeciesList(speciesList);
            }).catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {
                    console.log(`error: ${error.response.data.message}`);
                }
                else {
                    console.log(`error: ${error.message}`);
                }
            })
    };

    useEffect(() => {
        fetchSpecies();
    }, []);

    return (
        <div className="mainpanel" style={{ marginLeft: '5px' }}>
            <div className="row">
                <div className="pageheader">
                    <h1 className="QC">Species Table</h1>
                </div>
            </div>
            <div className="contentpanel">
                <div className="row" style={{ margin: '20px 0px 35px 0px' }}>
                    <div className="col-md-12">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <div className="panel-title">
                                    <div><span></span></div>
                                </div>
                            </div>
                            <div className="panel-body" data-ng-init="Show()">
                                <form className="form-inline">
                                    <div className="form-group">
                                        <input type="text" className="form-control" style={{ marginLeft: '5px' }} placeholder="Search" onKeyUp={(e) => { setFilter(e.target.value) }} />
                                        <button type="button" className="btn btn-default" onClick={addModal} >Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ margin: '10px 0px 35px 0px' }}>
                    <div className="col-md-12">
                        <div className="panel panel-default">
                            <div className="panel-body table-responsive">
                                <SpeciesTable
                                    columns={columns}
                                    speciesList={speciesList}
                                    searchFilter={filter}
                                />
                                <Modal
                                    isOpen={modalShow}
                                    style={customStyles}
                                    contentLabel=""
                                >
                                    <div className="panel">
                                        <button type="button" onClick={closeModal} className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        <div className="panel-heading">
                                            <label>Modal</label>
                                        </div>
                                        <div className="panel-body">
                                            <div className="form-horizontal">
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Code</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <input type="text" className="form-control" onKeyUp={(e) => { setCode(e.target.value); }} placeholder="Code" defaultValue={modal.code} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Name</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <input type="text" className="form-control" onKeyUp={(e) => { setName(e.target.value); }} placeholder="Name" defaultValue={modal.name} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-footer">
                                            <div className="row">
                                                <div className="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-12">
                                                    <div className="form-group" style={{ textAlign: "right" }}>
                                                        <button className="btn btn-primary" onClick={save} >{editFlag ? "Edit" : "Save"}</button>
                                                        <button type="button" className="btn btn-default" onClick={closeModal} >Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default React.memo(PageSpecies)