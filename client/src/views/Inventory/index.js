import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import appConfig from '../../config/app.config';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import common from '../../lib/common';

Modal.setAppElement('#root')

function PageInventory() {
    const [showPreLoader, setShowPreLoader] = useState(true);
    const [reUpload, setReUpload] = useState(false);
    const [existIdList, setExistIdList] = useState([]);
    const [replaceId, setReplaceId] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const [antibodyList, setAntibodyList] = useState([]);
    const [assayTypeList, setAssayTypeList] = useState([]);
    const [barcodeList, setBarcodeList] = useState([]);
    const [cellLineList, setCellLineList] = useState([]);
    const [conditionList, setConditionList] = useState([]);
    const [factoryList, setFactoryList] = useState([]);
    const [labList, setLabList] = useState([]);
    const [sexList, setSexList] = useState([]);
    const [individualList, setIndividualList] = useState([]);
    const [speciesList, setSpeciesList] = useState([]);
    const [strainList, setStrainList] = useState([]);
    const [tissueList, setTissueList] = useState([]);
    const [tissueProcessingList, setTissueProcessingList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [fileModalShow, setFileModalShow] = useState(false);
    const [modal, setModal] = useState({});
    const [labID, setlabID] = useState("");
    const [sampleID, setSampleID] = useState("");
    const [assayTypeID, setAssayTypeID] = useState("");
    const [experiment, setExperiment] = useState("");
    const [speciesID, setSpeciesID] = useState("");
    const [strainID, setStrainID] = useState("");
    const [tissueID, setTissueID] = useState("");
    const [cellLineID, setCellLineID] = useState("");
    const [tissueProID, setTissueProID] = useState("");
    const [individualID, setIndividualID] = useState("");
    const [sexID, setSexID] = useState("");
    const [factoryID, setFactoryID] = useState("");
    const [antibodyID, setAntibodyID] = useState("");
    const [conditionID, setConditionID] = useState("");
    const [barcodeID, setBarcodeID] = useState("");
    const [barcode, setBarcode] = useState("");
    const [editFlag, setEditFlag] = useState(false);
    const [file, setFile] = useState([]);
    const url = `${appConfig.baseURL}/api/`;
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

    const clearInput = () => {
        setlabID(null);
        setSampleID(null);
        setAssayTypeID(null);
        setExperiment(null);
        setSpeciesID(null);
        setStrainID(null);
        setTissueID(null);
        setCellLineID(null);
        setTissueProID(null);
        setIndividualID(null);
        setSexID(null);
        setFactoryID(null);
        setAntibodyID(null);
        setConditionID(null);
        setBarcodeID(null);
        setBarcode("");
    };

    const setInput = (item) => {
        setlabID(findItem(labList, item.labID));
        setSampleID(item.sampleID);
        setAssayTypeID(findItem(assayTypeList, item.assayTypeID));
        setExperiment(item.experiment);
        setSpeciesID(findItem(speciesList, item.speciesID));
        setStrainID(findItem(strainList, item.strainID));
        setTissueID(findItem(tissueList, item.tissueID));
        setCellLineID(findItem(cellLineList, item.cellLineID));
        setTissueProID(findItem(tissueProcessingList, item.tissueProcessingID));
        setIndividualID(findItem(individualList, item.individualID));
        setSexID(findItem(sexList, item.sexID));
        setFactoryID(findItem(factoryList, item.factoryID));
        setAntibodyID(findItem(antibodyList, item.antibodyID));
        setConditionID(findItem(conditionList, item.conditionID));

        let barcode = findItem(barcodeList, item.barcodeID);
        setBarcodeID(barcode);
        setBarcode(barcode.barcode);
    };

    const closeModal = () => {
        setModalShow(false);
        setEditFlag(false);
        clearInput();
    };

    const closeFileModal = () => {
        setFileModalShow(false);
        setFile(null);
        setReUpload(false);
        setExistIdList([]);
        setReplaceId();
    };

    const addModal = () => {
        setModalShow(true);
        setModal({ inventory: "" });
        clearInput();
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
                setShowPreLoader(true);
                let deleteURL = url + "inventory" + "/" + item.id;

                axios.delete(deleteURL)
                    .then((resp) => {
                        setShowPreLoader(false);
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        );
                        fetchInventory();
                    }).catch((error) => {
                        setShowPreLoader(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong! It could be used in the QC table.'
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
        let editURL = url + "inventory";
        let msg = vaildInput();

        if (msg.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: msg + ' could not be empty!'
            });
        }
        else {
            setShowPreLoader(true);
            if (editFlag) {
                editURL = editURL + "/" + modal.id;

                axios.put(editURL, {
                    labID: labID ? labID.value : null,
                    sampleID: sampleID ? sampleID : "",
                    assayTypeID: assayTypeID ? assayTypeID.value : null,
                    experiment: experiment ? experiment : "",
                    speciesID: speciesID ? speciesID.value : null,
                    strainID: strainID ? strainID.value : null,
                    tissueID: tissueID ? tissueID.value : null,
                    cellLineID: cellLineID ? cellLineID.value : null,
                    tissueProID: tissueProID ? tissueProID.value : null,
                    individualID: individualID ? individualID.value : null,
                    sexID: sexID ? sexID.value : null,
                    factoryID: factoryID ? factoryID.value : null,
                    antibodyID: antibodyID ? antibodyID.value : null,
                    conditionID: conditionID ? conditionID.value : null,
                    barcodeID: barcodeID ? barcodeID.value : null
                })
                    .then((resp) => {
                        setShowPreLoader(false);
                        Swal.fire('Updated!', '', 'success')
                        fetchInventory();
                        closeModal();
                    }).catch((error) => {
                        setShowPreLoader(false);
                        let errMsg = "";

                        if (error.response && error.response.data && error.response.data.message) {
                            errMsg = `error: ${error.response.data.message}`;
                            console.log(errMsg);
                        }
                        else {
                            errMsg = `error: ${error.message}`;
                            console.log(errMsg);
                        }

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: errMsg
                        });
                    })
            }
            else {
                axios.post(editURL, {
                    labID: labID ? labID.value : null,
                    lab: labID ? labID.label : null,
                    sampleID: sampleID ? sampleID : "",
                    assayTypeID: assayTypeID ? assayTypeID.value : null,
                    experiment: experiment ? experiment : "",
                    speciesID: speciesID ? speciesID.value : null,
                    strainID: strainID ? strainID.value : null,
                    tissueID: tissueID ? tissueID.value : null,
                    cellLineID: cellLineID ? cellLineID.value : null,
                    tissueProID: tissueProID ? tissueProID.value : null,
                    individualID: individualID ? individualID.value : null,
                    sexID: sexID ? sexID.value : null,
                    factoryID: factoryID ? factoryID.value : null,
                    antibodyID: antibodyID ? antibodyID.value : null,
                    conditionID: conditionID ? conditionID.value : null,
                    barcodeID: barcodeID ? barcodeID.value : null
                })
                    .then((resp) => {
                        setShowPreLoader(false);
                        Swal.fire('Saved!', '', 'success');
                        fetchInventory();
                        closeModal();
                    }).catch((error) => {
                        setShowPreLoader(false);
                        if (error.response.data.message == "Validation error") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'The combination of Lab and SampleID already exists! Please double check your data!'
                            });
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!'
                            });
                        }

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

    const upload = () => {
        if (file) {
            setShowPreLoader(true);

            let formData = new FormData();
            formData.append('file', file);

            if (replaceId && replaceId.length > 0) {
                let replaceIdList = [];

                replaceId.forEach((item) => {
                    replaceIdList.push(item.value);
                })

                formData.append('replaceId', replaceIdList);
            }

            let config = {
                headers:{'Content-Type':'multipart/form-data'},
              }; 
            
            axios.post(url + "inventory/upload", formData, config)
                .then((resp) => {
                    Swal.fire({
                        title: 'Uploaded!',
                         icon: 'success',
                         text: resp.data.message
                    });

                    if (resp.data.existId) {
                        setReUpload(true);

                        let existIds = resp.data.existId;
                        let existIdList = existIds.map((item) => {
                            return { label: item, value: item }
                        });
                        setExistIdList(existIdList);
                    }
                    else {
                        closeFileModal();
                    }

                    fetchInventory();
                    setShowPreLoader(false);
                }).catch((error) => {
                    closeFileModal();
                    setShowPreLoader(false);
                    let errMsg = "";
    
                    if (error.response && error.response.data && error.response.data.message) {
                        errMsg = `error: ${error.response.data.message}`;
                        console.log(errMsg);
                    }
                    else {
                        errMsg = `error: ${error.message}`;
                        console.log(errMsg);
                    }
    
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: errMsg
                    });
                })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Please choose a csv to upload."
            });
        }
    };

    const columns = [
        {
            name: "Lab",
            selector: 'lab.code',
            sortable: true
        },
        {
            name: "Sample ID",
            selector: 'sampleID',
            sortable: true
        },
        {
            name: "Assay Type",
            selector: 'assayType.assayType',
            sortable: true
        },
        {
            name: "Experiment",
            selector: 'experiment',
            sortable: true
        },
        {
            name: "Species",
            selector: 'species.name',
            sortable: true
        },
        {
            name: "Strain",
            selector: 'strain.strain',
            sortable: true
        },
        {
            name: "Tissue",
            selector: 'tissue.tissue',
            sortable: true
        },
        {
            name: "Cell Line",
            selector: 'cellLine.cellLine',
            sortable: true
        },
        {
            name: "Tissue Processing",
            selector: 'tissueProcessing.tissueProcessing',
            sortable: true
        },
        {
            name: "Individual",
            selector: 'individual.individual',
            sortable: true
        },
        {
            name: "Sex",
            selector: 'sex.sex',
            sortable: true
        },
        {
            name: "Factory",
            selector: 'factory.factory',
            sortable: true
        },
        {
            name: "Antibody",
            selector: 'antibody.antibody',
            sortable: true
        },
        {
            name: "Condition",
            selector: 'condition.conditionName',
            sortable: true
        },
        {
            name: "Barcode Type",
            selector: 'barcode.type',
            sortable: true
        },
        {
            name: "Barcode",
            selector: 'barcode.barcode',
            sortable: true
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
                            setInput(c);
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

    const InventoryTable = (props) => {
        const filteredItems = props.inventoryList.filter(item =>
            (
                (item.lab && item.lab.code && item.lab.code.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.sampleID && item.sampleID.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.assayType && item.assayType.assayType && item.assayType.assayType.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.experiment && item.experiment.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.species && item.species.name && item.species.name.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.strain && item.strain.strain && item.strain.strain.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.tissue && item.tissue.tissue && item.tissue.tissue.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.cellLine && item.cellLine.cellLine && item.cellLine.cellLine.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.tissueProcessing && item.tissueProcessing.tissueProcessing && item.tissueProcessing.tissueProcessing.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.individual && item.individual.individual && item.individual.individual.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.sex && item.sex.sex && item.sex.sex.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.factory && item.factory.factory && item.factory.factory.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.antibody && item.antibody.antibody && item.antibody.antibody.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.condition && item.condition.conditionName && item.condition.conditionName.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.barcode && item.barcode.type && item.barcode.type.toLowerCase().includes(props.searchFilter.toLowerCase()))
                || (item.barcode && item.barcode.barcode && item.barcode.barcode.toLowerCase().includes(props.searchFilter.toLowerCase()))
            )
        )

        return (
            props.inventoryList.length > 0 &&
            <DataTable
                className="table table-bordered table-primary no-footer"
                noHeader={true}
                columns={props.columns}
                data={props.searchFilter.trim().length > 0 ? filteredItems : props.inventoryList}
                highlightOnHover
                pagination={true}
                wrap={true}
                sortFunction={common.sortTable}
                paginationRowsPerPageOptions={[10, 20, 40, 50, 100, 200, 1000]}
            />
        )
    };

    const vaildInput = () => {
        let msg = "";

        if (labID === null) {
            msg += "Lab, ";
        }
        if (assayTypeID === null) {
            msg += "Assay Type, ";
        }
        if (speciesID === null) {
            msg += "Species, ";
        }
        if (strainID === null) {
            msg += "Strain, ";
        }
        if (tissueID === null) {
            msg += "Tissue, ";
        }
        if (cellLineID === null) {
            msg += "Cell Line, ";
        }
        if (tissueProID === null) {
            msg += "Tissue Processing, ";
        }
        if (individualID === null) {
            msg += "Individual, ";
        }
        if (sexID === null) {
            msg += "Sex, ";
        }
        if (factoryID === null) {
            msg += "Factory, ";
        }
        if (antibodyID === null) {
            msg += "Antibody, ";
        }
        if (conditionID === null) {
            msg += "Condition, ";
        }
        if (barcodeID === null) {
            msg += "Barcode, ";
        }

        if (msg.trim().length > 0) {
            msg.slice(0, msg.length - 2)
        }

        return msg;
    };

    const findItem = (list, id) => {
        let result = { label: "", value: -1 };

        list.map((item) => {
            if (item.value == id) {
                result = item;
            }
        })

        return result
    }

    const fetchData = (url) => {
        return axios(url);
    };

    const fetchInventory = async () => {
        var res = await fetchData(url + "inventory");
        setInventoryList(res.data);
        setShowPreLoader(false);
    };

    const fetchAntibody = async () => {
        var res = await fetchData(url + "antibody");
        let antibodies = res.data;
        let antibodyList = antibodies.map((item) => {
            return { label: item.antibody, value: item.id }
        });
        setAntibodyList(antibodyList);
    };

    const fetchAssayType = async () => {
        var res = await fetchData(url + "assayType");
        let assayTypes = res.data;
        let assayTypesList = assayTypes.map((item) => {
            return { label: item.assayType, value: item.id }
        });
        setAssayTypeList(assayTypesList);
    };

    const fetchBarcode = async () => {
        var res = await fetchData(url + "barcode");
        let barcodes = res.data;
        let barcodeList = barcodes.map((item) => {
            return { label: item.type, value: item.id, barcode: item.barcode }
        });
        setBarcodeList(barcodeList);
    };

    const fetchCellLine = async () => {
        var res = await fetchData(url + "cellLine");
        let cellLines = res.data;
        let cellLinesList = cellLines.map((item) => {
            return { label: item.cellLine, value: item.id }
        });
        setCellLineList(cellLinesList);
    };

    const fetchCondition = async () => {
        var res = await fetchData(url + "condition");
        let conditions = res.data;
        let conditionList = conditions.map((item) => {
            return { label: item.conditionName, value: item.id }
        });
        setConditionList(conditionList);
    };

    const fetchFactory = async () => {
        var res = await fetchData(url + "factory");
        let factorys = res.data;
        let factoryList = factorys.map((item) => {
            return { label: item.factory, value: item.id }
        });
        setFactoryList(factoryList);
    };

    const fetchIndividual = async () => {
        var res = await fetchData(url + "individual");
        let individuals = res.data;
        let individualList = individuals.map((item) => {
            return { label: item.individual, value: item.id }
        });
        setIndividualList(individualList);
    };

    const fetchLab = async () => {
        var res = await fetchData(url + "lab");
        let labs = res.data;
        let labList = labs.map((item) => {
            return { label: item.code, value: item.id }
        })
        setLabList(labList);
    };

    const fetchSex = async () => {
        var res = await fetchData(url + "sex");
        let sexes = res.data;
        let sexList = sexes.map((item) => {
            return { label: item.sex, value: item.id }
        });
        setSexList(sexList);
    };

    const fetchSpecies = async () => {
        var res = await fetchData(url + "species");
        let species = res.data;
        let speciesList = species.map((item) => {
            return { label: item.code, value: item.id }
        });
        setSpeciesList(speciesList);
    };

    const fetchStrain = async () => {
        var res = await fetchData(url + "strain");
        let strains = res.data;
        let strainList = strains.map((item) => {
            return { label: item.strain, value: item.id }
        });
        setStrainList(strainList);
    };

    const fetchTissue = async () => {
        var res = await fetchData(url + "tissue");
        let tissues = res.data;
        let tissueList = tissues.map((item) => {
            return { label: item.tissue, value: item.id }
        });
        setTissueList(tissueList);
    };

    const fetchTissuePro = async () => {
        var res = await fetchData(url + "tissueProcessing");
        let tissueProcessings = res.data;
        let tissueProcessingList = tissueProcessings.map((item) => {
            return { label: item.tissueProcessing, value: item.id }
        });
        setTissueProcessingList(tissueProcessingList);
    };

    useEffect(() => {
        fetchInventory();
        fetchAntibody();
        fetchAssayType();
        fetchBarcode();
        fetchCellLine();
        fetchCondition();
        fetchFactory();
        fetchIndividual();
        fetchLab();
        fetchSex();
        fetchSpecies();
        fetchStrain();
        fetchTissue();
        fetchTissuePro();
    }, []);

    return (<>
        <div id="preloader" style={showPreLoader ? { opacity: "0.6" } : { display: "none" }}>
            <div id="status">
                <FontAwesomeIcon icon={faCog} className="fa-spin" />
            </div>
        </div>
        <div className="mainpanel" style={{ marginLeft: '5px' }}>
            <div className="row">
                <div className="pageheader">
                    <h1 className="QC">Inventory Table</h1>
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
                                        <button type="button" className="btn btn-default" onClick={ () => {setFileModalShow(true); }} >Upload CSV</button>
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
                                <InventoryTable
                                    columns={columns}
                                    inventoryList={inventoryList}
                                    searchFilter={filter}
                                />
                                <Modal
                                    isOpen={fileModalShow}
                                    style={customStyles}
                                    contentLabel=""
                                >
                                    <div className="panel">
                                        <button type="button" onClick={closeFileModal} className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        <div className="panel-heading">
                                            <label>Upload File <i>*Only accept csv file</i></label>
                                        </div>
                                        <div className="panel-body">
                                            <div className="form-horizontal">
                                                { reUpload ? 
                                                    <div className="form-group">
                                                        <label htmlFor="status" className="col-sm-4 control-label">Replace Ids: </label>
                                                        <div className="col-lg-8 col-md-8 col-sm-8">
                                                            <Select
                                                                options={existIdList}
                                                                isMulti
                                                                value={replaceId}
                                                                onChange={(e) => {
                                                                    setReplaceId(e);
                                                                }}
                                                            />
                                                        </div>
                                                    </div> : null
                                                }
                                                <div className="form-group">
                                                    <label htmlFor="csvFile" className="col-sm-4 control-label" >File</label>
                                                    <input type="file" className="form-control-file" accept="text/csv" id="csvFile" onChange={(e) => { setFile(e.target.files[0]); }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-footer">
                                            <div className="row">
                                                <div className="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-12">
                                                    <div className="form-group" style={{ textAlign: "right" }}>
                                                        <button className="btn btn-primary" onClick={upload} >{ reUpload ? "Re-Upload" : "Upload" }</button>
                                                        <button type="button" className="btn btn-default" onClick={closeFileModal} >Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                                <Modal
                                    isOpen={modalShow}
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
                                                    <label htmlFor="status" className="col-sm-4 control-label">Lab Code</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={labList}
                                                            value={labID}
                                                            onChange={(e) => {
                                                                setlabID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Sample ID</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        {editFlag ?
                                                            <input type="text" className="form-control" disabled
                                                                placeholder="Sample ID" defaultValue={modal.sampleID} />
                                                            :
                                                            <input type="text" className="form-control" onKeyUp={(e) => { setSampleID(e.target.value); }}
                                                                placeholder="Sample ID" defaultValue={modal.sampleID} />
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Assay Type</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={assayTypeList}
                                                            value={assayTypeID}
                                                            onChange={(e) => {
                                                                setAssayTypeID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Experiment</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <input type="text" className="form-control" onKeyUp={(e) => { setExperiment(e.target.value); }} placeholder="Experiment" defaultValue={modal.experiment} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Species Code</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={speciesList}
                                                            value={speciesID}
                                                            onChange={(e) => {
                                                                setSpeciesID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Strain</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={strainList}
                                                            value={strainID}
                                                            onChange={(e) => {
                                                                setStrainID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Tissue</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={tissueList}
                                                            value={tissueID}
                                                            onChange={(e) => {
                                                                setTissueID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">CellLine</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={cellLineList}
                                                            value={cellLineID}
                                                            onChange={(e) => {
                                                                setCellLineID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Tissue Processing</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={tissueProcessingList}
                                                            value={tissueProID}
                                                            onChange={(e) => {
                                                                setTissueProID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Individual</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={individualList}
                                                            value={individualID}
                                                            onChange={(e) => {
                                                                setIndividualID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Sex</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={sexList}
                                                            value={sexID}
                                                            onChange={(e) => {
                                                                setSexID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Factory</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={factoryList}
                                                            value={factoryID}
                                                            onChange={(e) => {
                                                                setFactoryID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Antibody</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={antibodyList}
                                                            value={antibodyID}
                                                            onChange={(e) => {
                                                                setAntibodyID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Condition</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={conditionList}
                                                            value={conditionID}
                                                            onChange={(e) => {
                                                                setConditionID(e);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Barcode Type</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <Select
                                                            options={barcodeList}
                                                            value={barcodeID}
                                                            onChange={(e) => {
                                                                setBarcodeID(e);
                                                                setBarcode(e.barcode);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="status" className="col-sm-4 control-label">Barcode</label>
                                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                                        <input type="text" className="form-control" placeholder="Barcode" value={barcode} disabled />
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
    </>);
}

export default React.memo(PageInventory)