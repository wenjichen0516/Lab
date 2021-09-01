import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import appConfig from '../../config/app.config';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import common from '../../lib/common';
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

Modal.setAppElement('#root')

function PageChipSeq() {
    const [showPreLoader, setShowPreLoader] = useState(true);
    const [chipSeqList, setChipSeqList] = useState([]);
    const [reUpload, setReUpload] = useState(false);
    const [existIdList, setExistIdList] = useState([]);
    const [replaceId, setReplaceId] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [file, setFile] = useState([]);
    const url = `${appConfig.baseURL}/api/chipSeq`;



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
                let deleteURL = url + "chipSeq" + "/" + item.id;

                axios.delete(deleteURL)
                    .then((resp) => {
                        setShowPreLoader(false);
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        );
                        fetchChipSeq();
                    }).catch((error) => {
                        setShowPreLoader(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!'
                        })
                        console.log(`error: ${error.response.data.message}`);
                    })
            }
        });
    };

    const closeModal = () => {
        setModalShow(false);
        setFile(null);
        setReUpload(false);
        setExistIdList([]);
        setReplaceId();
    };

    const addModal = () => {
        setModalShow(true);
        setFile(null);
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
                headers: { 'Content-Type': 'multipart/form-data' },
            };

            axios.post(url + "/upload", formData, config)
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
                        closeModal();
                    }

                    fetchChipSeq();
                    setShowPreLoader(false);
                }).catch((error) => {
                    closeModal();
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
            selector: 'inventory.lab.code',
            sortable: true
        },
        {
            name: "Sample ID",
            selector: 'inventory.sampleID',
            sortable: true
        },
        {
            name: "Assay Type",
            selector: 'inventory.assayType.assayType',
            sortable: true
        },
        {
            name: "Experiment",
            selector: 'inventory.experiment',
            sortable: true
        },
        {
            name: "Species",
            selector: 'inventory.species.name',
            sortable: true
        },
        {
            name: "Strain",
            selector: 'inventory.strain.strain',
            sortable: true
        },
        {
            name: "Tissue",
            selector: 'inventory.tissue.tissue',
            sortable: true
        },
        {
            name: "Cell Line",
            selector: 'inventory.cellLine.cellLine',
            sortable: true
        },
        {
            name: "Tissue Processing",
            selector: 'inventory.tissueProcessing.tissueProcessing',
            sortable: true
        },
        {
            name: "Individual",
            selector: 'inventory.individual.individual',
            sortable: true
        },
        {
            name: "Sex",
            selector: 'inventory.sex.sex',
            sortable: true
        },
        {
            name: "Factory",
            selector: 'inventory.factory.factory',
            sortable: true
        },
        {
            name: "Antibody",
            selector: 'inventory.antibody.antibody',
            sortable: true
        },
        {
            name: "Condition",
            selector: 'inventory.condition.conditionName',
            sortable: true
        },
        {
            name: "Barcode Type",
            selector: 'inventory.barcode.type',
            sortable: true
        },
        {
            name: "Barcode",
            selector: 'inventory.barcode.barcode',
            sortable: true
        },
        {
            name: "# Raw Reads",
            selector: 'rawRead',
            sortable: true
        },
        {
            name: "# Mapped Reads",
            selector: 'mappedValue',
            sortable: true
        },
        {
            name: "% Mapped Reads",
            selector: 'mappedPercent',
            sortable: true
        },
        {
            name: "# Uniquely Mapped Reads",
            selector: 'uniqueMappedValue',
            sortable: true
        },
        {
            name: "% Uniquely Mapped Reads",
            selector: 'uniquePercent',
            sortable: true
        },
        {
            name: "PBC",
            selector: 'PBC',
            sortable: true
        },
        {
            name: "NRF",
            selector: 'NRF',
            sortable: true
        },
        {
            name: "NSC",
            selector: 'NSC',
            sortable: true
        },
        {
            name: "RSC",
            selector: 'RSC',
            sortable: true
        },
        {
            name: "# Peaks",
            selector: 'peaks',
            sortable: true
        },
        {
            name: "Frip",
            selector: 'frip',
            sortable: true
        },
        {
            name: "Technical Replicate",
            selector: 'techRep',
            sortable: true
        },
        {
            name: "Color",
            cell: (c) => {
                return (
                    <div>
                        <label style={{ backgroundColor: c.inventory.factory.color }} >{c.inventory.factory.color}</label>
                    </div>
                )
            }
        },
        {
            name: '',
            cell: (c) => {
                return (
                    <div className="form-group">
                        <button onClick={() => { deleteModal(c) }}
                            className="btn btn-default">Delete
                        </button>
                    </div>
                )
            }
        }
    ]

    const [filter, setFilter] = useState("");

    const fetchChipSeq = async () => {
        try {
            var res = await axios(url);
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.log(`error: ${error.response.data.message}`);
            }
            else {
                console.log(`error: ${error.message}`);
            }
        }

        setChipSeqList(res.data);
        setShowPreLoader(false);
    };

    useEffect(() => {
        fetchChipSeq();
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
                    <h1 className="QC">Chip-Seq Table</h1>
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
                                        <button type="button" className="btn btn-default" onClick={addModal} >Upload CSV</button>
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
                                <ChipSeqTable
                                    columns={columns}
                                    chipSeqList={chipSeqList}
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
                                            <label>Upload File <i>*Only accept csv file</i></label>
                                        </div>
                                        <div className="panel-body">
                                            <div className="form-horizontal">
                                                {reUpload ?
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
                                                        <button className="btn btn-primary" onClick={upload} >{reUpload ? "Re-Upload" : "Upload"}</button>
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

const ChipSeqTable = (props) => {
    const filteredItems = props.chipSeqList.filter(item =>
        (
            (item.inventory.lab && item.inventory.lab.code && item.inventory.lab.code.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.sampleID && item.inventory.sampleID.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.assayType && item.inventory.assayType.assayType && item.inventory.assayType.assayType.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.experiment && item.inventory.experiment.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.species && item.inventory.species.name && item.inventory.species.name.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.strain && item.inventory.strain.strain && item.inventory.strain.strain.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.tissue && item.inventory.tissue.tissue && item.inventory.tissue.tissue.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.cellLine && item.inventory.cellLine.cellLine && item.inventory.cellLine.cellLine.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.tissueProcessing && item.inventory.tissueProcessing.tissueProcessing && item.inventory.tissueProcessing.tissueProcessing.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.individual && item.inventory.individual.individual && item.inventory.individual.individual.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.sex && item.inventory.sex.sex && item.inventory.sex.sex.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.factory && item.inventory.factory.factory && item.inventory.factory.factory.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.antibody && item.inventory.antibody.antibody && item.inventory.antibody.antibody.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.condition && item.inventory.condition.conditionName && item.inventory.condition.conditionName.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.barcode && item.inventory.barcode.type && item.inventory.barcode.type.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.inventory.barcode && item.inventory.barcode.barcode && item.inventory.barcode.barcode.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.rawRead && item.rawRead.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.mappedValue && item.mappedValue.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.mappedPercent && item.mappedPercent.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.uniqueMappedValue && item.uniqueMappedValue.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.uniquePercent && item.uniquePercent.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.PBC && item.PBC.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.NRF && item.NRF.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.NSC && item.NSC.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.RSC && item.RSC.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.peaks && item.peaks.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.frip && item.frip.toLowerCase().includes(props.searchFilter.toLowerCase()))
            || (item.techRep && item.techRep.toLowerCase().includes(props.searchFilter.toLowerCase()))

        )
    )
    const [chipSeqSelectedRows, setChipSeqSelectedRows] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [template, setTemplate] = useState(appConfig.chipSeqBrowserType[0].template);
    const [selector, setSelector] = useState(appConfig.chipSeqSelector[0].value);
    const [textarea, setTextarea] = useState("");

    const handleRowSelected = useCallback(state => {
        setChipSeqSelectedRows(state.selectedRows);
    }, []);

    const handleCreateLink = () => {
        setModalShow(true);
    };

    const closeModal = () => {
        setModalShow(false);
        setTemplate(appConfig.chipSeqBrowserType[0].template);
        setSelector(appConfig.chipSeqSelector[0].value);
        setTextarea("");
    };

    const generateLink = () => {
        let result = "",
            colorPool = {},
            colorDB = [...appConfig.chipSeqColorDB];

        chipSeqSelectedRows.forEach(row => {
            let id = row.uniqueID,
                color = "",
                inventory = row.inventory,
                key = inventory[selector];

            if (key in colorPool) {
                color = colorPool[key];
            }
            else {
                color = colorDB.pop();

                // reset color DB is it's empty
                if (colorDB.length === 0) {
                    colorDB = [...appConfig.chipSeqColorDB];
                }

                colorPool[key] = color;
            }

            let rowResultFillID = template.replace("$ID", id);
            let rowReuslt = rowResultFillID.replace("$color", color);

            result = result + rowReuslt + "\n\n";
        });

        setTextarea(result);
    };

    const subHeaderComponent = useMemo(() => {
        return <>{
            chipSeqSelectedRows.length > 0 ?
                <button className="btn btn-primary" onClick={handleCreateLink} >Create Link</button>
                : null
        }</>
    }, [chipSeqSelectedRows]);

    return <>{
        props.chipSeqList.length > 0 &&
        <DataTable
            className="table table-bordered table-primary no-footer"
            noHeader={true}
            columns={props.columns}
            data={props.searchFilter.trim().length > 0 ? filteredItems : props.chipSeqList}
            highlightOnHover
            pagination={true}
            wrap={true}
            sortFunction={common.sortTable}
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            subHeader
            subHeaderComponent={subHeaderComponent}
            paginationRowsPerPageOptions={[10, 20, 40, 50, 100, 200, 1000]}
        />
    }
        <Modal
            isOpen={modalShow}
            //style={customStyles}
            contentLabel=""
        >
            <div className="panel">
                <button type="button" onClick={closeModal} className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div className="panel-heading">
                    <label>Generate genome browser link</label>
                </div>
                <div className="panel-body">
                    <div className="form-horizontal">
                        <div className="form-group">
                            <label htmlFor="status" className="col-sm-4 control-label">Browser type: </label>
                            <div className="col-lg-8 col-md-8 col-sm-8">
                                <Select
                                    options={appConfig.chipSeqBrowserType}
                                    defaultValue={appConfig.chipSeqBrowserType[0]}
                                    onChange={(e) => {
                                        setTemplate(e.template);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status" className="col-sm-4 control-label">Color type: </label>
                            <div className="col-lg-8 col-md-8 col-sm-8">
                                <Select
                                    options={appConfig.chipSeqSelector}
                                    defaultValue={appConfig.chipSeqSelector[0]}
                                    onChange={(e) => {
                                        setSelector(e.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status" className="col-sm-4 control-label">Link: </label>
                            <div className="col-lg-8 col-md-8 col-sm-8">
                                <textarea className="form-control" rows="10" value={textarea} disabled></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel-footer">
                    <div className="row">
                        <div className="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-12">
                            <div className="form-group" style={{ textAlign: "right" }}>
                                <button type="button" className="btn btn-primary" onClick={generateLink} >Generate</button>
                                <button type="button" className="btn btn-default" onClick={closeModal} >Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </>
};

export default React.memo(PageChipSeq)