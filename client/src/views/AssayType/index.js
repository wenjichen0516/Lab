import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import appConfig from '../../config/app.config';
import axios from 'axios';
import Swal from 'sweetalert2';

Modal.setAppElement('#root')

function PageAssayType() {
    const [assayTypeList, setAssayTypeList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [modal, setModal] = useState({});
    const [assayType, setAssayType] = useState("");
    const [editFlag, setEditFlag] = useState(false);
    const url = `${appConfig.baseURL}/api/assayType`;

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

    const vaildInput = () => {
        let msg = "";

        if (assayType === null || assayType.trim().length === 0) {
            msg += "AssayType is required.";
        }

        return msg;
    };

    const closeModal = () => {
        setModalShow(false);
        setEditFlag(false);
        setAssayType("");
    };

    const addModal = () => {
        setModalShow(true);
        setModal({ assayType: "" });
        setAssayType("");
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
                        fetchAssayType();
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
                text: msg
            });
        }
        else {
            if (editFlag) {
                editURL = editURL + "/" + modal.id;

                axios.put(editURL, { assayType: assayType })
                    .then((resp) => {
                        Swal.fire('Updated!', '', 'success')
                        fetchAssayType();
                        closeModal();
                    }).catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!'
                        })
                        if (error.response && error.response.data && error.response.data.message) {
                            console.log(`error: ${error.response.data.message}`);
                        }
                        else {
                            console.log(`error: ${error.message}`);
                        }
                    })
            }
            else {
                axios.post(editURL, { assayType: assayType })
                    .then((resp) => {
                        Swal.fire('Saved!', '', 'success');
                        fetchAssayType();
                        closeModal();
                    }).catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!'
                        })
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
            name: "Assay Type",
            selector: 'assayType'
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
                            setAssayType(c.assayType);
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

    const AssayTypeTable = (props) => {
        const filteredItems = props.assayTypeList.filter(item =>
            (
                item.assayType && item.assayType.toLowerCase().includes(props.searchFilter.toLowerCase())
            )
        )

        return (
            props.assayTypeList.length > 0 &&
            <DataTable
                className="table table-bordered table-primary no-footer"
                noHeader={true}
                columns={props.columns}
                data={props.searchFilter.trim().length > 0 ? filteredItems : props.assayTypeList}
                highlightOnHover
                pagination={true}
                wrap={true}
                paginationRowsPerPageOptions={[10, 20, 40, 50, 100, 200, 1000]}
            />
        )
    };

    const fetchAssayType = () => {
        axios(url)
            .then((resp) => {
                let assayTypeList = resp.data;
                setAssayTypeList(assayTypeList);
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
        fetchAssayType();
    }, []);

    return (
        <div className="mainpanel" style={{ marginLeft: '5px' }}>
            <div className="row">
                <div className="pageheader">
                    <h1 className="QC">Assay Type Table</h1>
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
                                <AssayTypeTable
                                    columns={columns}
                                    assayTypeList={assayTypeList}
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
                                                    <label htmlFor="status" className="col-sm-4 control-label">AssayType</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <input type="text" className="form-control" onKeyUp={(e) => { setAssayType(e.target.value); }} placeholder="AssayType" defaultValue={modal.assayType} />
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

export default React.memo(PageAssayType)