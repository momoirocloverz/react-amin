import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Upload,
    Input,
    Button,
    Table,
    Space,
    message,
    Pagination,
    Modal,
    Select,
    Collapse,
    Popconfirm,
    Checkbox,
    Cascader,
} from 'antd';
const { Option } = Select;
const { Panel } = Collapse;

const WorkBenchAccountPage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [leftSerach, setLeftSerach] = useState('');
    const [listData, setListData] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageNormalUrl, setImageNormalUrl] = useState('');
    const [idForEdit, setIdForEdit] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [imgPre, setImgPre] = useState(
        'https://pinghu-szgzt-img.zjsszxc.com/',
    );
    const [fileList, setFileList] = useState([]);
    const [fileNormalList, setFileNormalList] = useState([]);
    const [showNew, setShowNew] = useState(false);
    const [showEditNormal, setShowEditNormal] = useState(false);
    const [showEditPermission, setShowEditPermission] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pagesize, setPagesize] = useState(10);
    const [total, setTotal] = useState(0);
    const [roleList, setRoleList] = useState([]);
    const [SZBOptions1, setSZBOptions1] = useState([]);
    const [SZB1Default, setSZB1Default] = useState([]);
    const [SZB2Default, setSZB2Default] = useState([]);
    const [SZB1Value, setSZB1Value] = useState([]);
    const [SZB2Value, setSZB2Value] = useState([]);
    const [SZBOptions2, setSZBOptions2] = useState([]);

    const [SZXT1Value, setSZXT1Value] = useState([]);
    const [SZXT1Default, setSZXT1Default] = useState([]);
    const [SZXTOptions1, setSZXTOptions1] = useState([]);

    const [XMGL1Value, setXMGL1Value] = useState([]);
    const [XMGL1Default, setXMGL1Default] = useState([]);
    const [XMGLOptions1, setXMGLOptions1] = useState([]);

    const [XMGL2Value, setXMGL2Value] = useState([]);
    const [XMGL2Default, setXMGL2Default] = useState([]);
    const [XMGLOptions2, setXMGLOptions2] = useState([]);

    const [backUpOptions1, setBackUpOptions1] = useState([]);
    const [backUpOptions2, setBackUpOptions2] = useState([]);
    const [backUpOptions3, setBackUpOptions3] = useState([]);
    const [dynamicFieldNames, setDynamicFieldNames] = useState({});

    const [showNewBtn, setShowNewBtn] = useState(false);

    const [showSZBEdit, setShowSZBEdit] = useState(false);
    const [showSZXTEdit, setShowSZXTEdit] = useState(false);
    const [showXMGLEdit, setShowXMGLEdit] = useState(false);

    const [form] = Form.useForm();
    const [normalForm] = Form.useForm();
    const [permissionForm] = Form.useForm();
    const [simpleSZBChecked, setSimpleSZBChecked] = useState(false);
    const [simpleSZXTChecked, setSimpleSZXTChecked] = useState(false);
    const [simpleXMGLChecked, setSimpleXMGLChecked] = useState(false);
    const showTotal = (total: number) => {
        return `??? ${total} ???`;
    };
    let currentInfo = localStorage.getItem('currentInfo')
        ? JSON.parse(localStorage.getItem('currentInfo'))
        : '';
    const columns = [
        {
            title: '??????',
            dataIndex: 'index',
            align: 'center',
            render: (index: any) => <span>{index + 1}</span>,
        },
        {
            title: '?????????',
            className: 'column-money',
            dataIndex: 'username',
            align: 'center',
        },
        {
            title: '????????????',
            className: 'column-money',
            dataIndex: 'real_name',
            align: 'center',
        },
        {
            title: '?????????',
            className: 'column-money',
            dataIndex: 'mobile',
            align: 'center',
        },
        {
            title: '????????????',
            dataIndex: 'role_name',
            align: 'center',
        },
        {
            title: '??????',
            dataIndex: 'avatar',
            align: 'center',
            render: (avatar: any) =>
                avatar ? (
                    <img className={styles.listAvatar} src={avatar} />
                ) : (
                    <span>??????</span>
                ),
        },
        {
            title: '??????',
            key: 'action',
            align: 'center',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <a onClick={() => popNormalEdit(record)}>
                        ?????? {record.name}
                    </a>
                    <Popconfirm
                        title="??????????????????????"
                        onConfirm={() => deleteAction(record)}
                    >
                        <a>??????</a>
                    </Popconfirm>
                    {!showSZBEdit && !showSZXTEdit && !showXMGLEdit ? null : (
                        <a onClick={() => popPermission(record)}>??????</a>
                    )}
                </Space>
            ),
        },
    ];
    const deleteAction = (record: any) => {
        let data = {
            id: record.id,
        };
        Apis.adminRemove(data)
            .then((res: any) => {
                if (res && res.code === 0) {
                    message.success('????????????');
                    setCurrent(1);
                    initRequest();
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const popNormalEdit = (record: any) => {
        setImageNormalUrl('');
        setFileNormalList([]);
        setShowEditNormal(true);
        normalForm.resetFields();
        normalForm.setFieldsValue({
            username: record.username,
            real_name: record.real_name,
            mobile: record.mobile,
            link: record.link,
            role_id: +record.role_id,
            avatar: [{ url: record.avatar }],
        });
        setIdForEdit(record.id);
        setImageNormalUrl(record.avatar);
        setFileNormalList([
            {
                url: record.avatar,
            },
        ]);
    };
    const popPermission = (record: any) => {
        console.log(record);
        setSimpleSZBChecked(false);
        setSimpleSZXTChecked(false);
        setSimpleXMGLChecked(false);
        setSZB1Value([]);
        setSZB2Value([]);
        setSZXT1Value([]);
        setXMGL1Value([]);
        setXMGL2Value([]);
        setSZB1Default([]);
        setSZB2Default([]);
        setSZXT1Default([]);
        setXMGL1Default([]);
        setXMGL2Default([]);
        setIdForEdit(record.id);
        setShowEditPermission(true);
        if (record.permissions) {
            if (record.permissions.szb_admin) {
                if (record.permissions.szb_admin.is_visit) {
                    setSimpleSZBChecked(true);
                    let arr1 = [];
                    let arr2 = [record.permissions.szb_admin.role_id];
                    if (record.permissions.szb_admin.village_id != 0) {
                        arr1 = [
                            record.permissions.szb_admin.city_id,
                            record.permissions.szb_admin.town_id,
                            record.permissions.szb_admin.village_id,
                        ];
                    } else {
                        if (record.permissions.szb_admin.town_id != 0) {
                            arr1 = [
                                record.permissions.szb_admin.city_id,
                                record.permissions.szb_admin.town_id,
                            ];
                        } else {
                            arr1 = [record.permissions.szb_admin.city_id];
                        }
                    }
                    setSZB1Value(arr1);
                    setSZB1Default(arr1);
                    setSZB2Value(arr2);
                    setSZB2Default(arr2);
                }
            }
            if (record.permissions.szxt_admin) {
                if (record.permissions.szxt_admin.is_visit) {
                    setSimpleSZXTChecked(true);
                    let arr1 =
                        record.permissions.szxt_admin &&
                        record.permissions.szxt_admin.ids
                            ? record.permissions.szxt_admin.ids
                            : [];
                    setSZXT1Value(arr1);
                    setSZXT1Default(arr1);
                }
            }
            if (record.permissions.xmgl_admin) {
                if (record.permissions.xmgl_admin.is_visit) {
                    setSimpleXMGLChecked(true);
                    let arr1 = [record.permissions.xmgl_admin.type];
                    let arr2 = [record.permissions.xmgl_admin.obj_unit_id];
                    setXMGL1Value(arr1);
                    setXMGL1Default(arr1);
                    setXMGL2Value(arr2);
                    setXMGL2Default(arr2);
                    if (arr1[0]) {
                        if (arr1[0] == 1) {
                            setXMGLOptions2(backUpOptions3);
                            setDynamicFieldNames({
                                value: 'id',
                                label: 'project_name',
                                children: 'children',
                            });
                        }
                        if (arr1[0] == 2) {
                            setXMGLOptions2(backUpOptions2);
                            setDynamicFieldNames({
                                value: 'id',
                                label: 'audit_name',
                                children: 'children',
                            });
                        }
                        if (arr1[0] == 3) {
                            setXMGLOptions2(backUpOptions1);
                            setDynamicFieldNames({
                                value: 'id',
                                label: 'build_name',
                                children: 'children',
                            });
                        }
                    }
                }
            }
        }
    };
    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    };
    const normFile = (e: any) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const commitGlobalTitle = (e: any) => {
        dispatch({
            type: 'baseModel/changeHomeTitle',
            payload: e,
        });
    };
    useEffect(() => {
        console.log(showSZBEdit);
        console.log(showSZXTEdit);
        console.log(showXMGLEdit);
        if (showSZBEdit || showSZXTEdit || showXMGLEdit) {
            setShowNewBtn(true);
        }
    }, [showSZBEdit, showSZXTEdit, showXMGLEdit]);
    const initAction = () => {
        commitGlobalTitle('benchAccount');
        let currentInfo = localStorage.getItem('currentInfo')
            ? JSON.parse(localStorage.getItem('currentInfo'))
            : '';
        if (currentInfo) {
            if (
                currentInfo.admin_info &&
                currentInfo.admin_info.permissions &&
                currentInfo.admin_info.permissions.szb_admin &&
                currentInfo.admin_info.permissions.szb_admin.role_type == '1'
            ) {
                // setShowNewBtn(true);
                setShowSZBEdit(true);
            }
            if (
                currentInfo.admin_info &&
                currentInfo.admin_info.permissions &&
                currentInfo.admin_info.permissions.szxt_admin &&
                currentInfo.admin_info.permissions.szxt_admin.type == '1'
            ) {
                setShowSZXTEdit(true);
                // setShowNewBtn(true);
            }
            if (
                currentInfo.admin_info &&
                currentInfo.admin_info.permissions &&
                currentInfo.admin_info.permissions.xmgl_admin &&
                currentInfo.admin_info.permissions.xmgl_admin.type == '0'
            ) {
                setShowXMGLEdit(true);
                // setShowNewBtn(true);
            }
        }
    };
    const initRoles = () => {
        Apis.roleAllList({})
            .then((res: any) => {
                if (res && res.code === 0) {
                    setRoleList(res.data.list);
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const initRequest = () => {
        let data = {
            search_username: leftSerach,
            page: current,
            pagesize: pagesize,
        };
        Apis.adminList(data)
            .then((res: any) => {
                if (res && res.code === 0) {
                    let bridge = res.data.data.map((ele: any, index: any) => {
                        return {
                            ...ele,
                            index,
                        };
                    });
                    setListData(bridge);
                    setTotal(res.data.total);
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const leftSerachChange = (e: any) => {
        setLeftSerach(e.target.value);
    };
    const active1Search = () => {
        setCurrent(1);
        initRequest();
    };
    const popNew = () => {
        setShowNew(true);
        setSimpleSZBChecked(false);
        setSimpleSZXTChecked(false);
        setSimpleXMGLChecked(false);
        setSZB1Value([]);
        setSZB2Value([]);
        setSZXT1Value([]);
        setXMGL1Value([]);
        setXMGL2Value([]);
        setSZB1Default([]);
        setSZB2Default([]);
        setSZXT1Default([]);
        setXMGL1Default([]);
        setXMGL2Default([]);
        setFileList([]);
        setImageUrl('');
        form.resetFields();
    };
    const onPagChange = (e: any) => {
        setCurrent(e);
    };
    const uploadButton = (
        <div>
            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>????????????</div>
        </div>
    );
    const handleEditPermissionOk = () => {
        permissionForm
            .validateFields()
            .then((res) => {
                console.log(res);
                console.log(simpleSZBChecked);
                console.log(simpleSZXTChecked);
                console.log(simpleXMGLChecked);
                console.log(SZB1Value);
                console.log(SZB2Value);
                console.log(SZXT1Value);
                console.log(XMGL1Value);
                console.log(XMGL2Value);
                let data = {
                    szb_admin: {},
                    szxt_admin: {},
                    xmgl_admin: {},
                };
                data.szb_admin.is_visit = simpleSZBChecked ? 1 : 0;
                data.szxt_admin.is_visit = simpleSZXTChecked ? 1 : 0;
                data.xmgl_admin.is_visit = simpleXMGLChecked ? 1 : 0;
                if (simpleSZBChecked) {
                    data.szb_admin.role_id = SZB2Value[0];
                    if (SZB1Value.length == 1) {
                        data.szb_admin.city_id = SZB1Value[0];
                        data.szb_admin.town_id = 0;
                        data.szb_admin.village_id = 0;
                    } else if (SZB1Value.length == 2) {
                        data.szb_admin.city_id = SZB1Value[0];
                        data.szb_admin.town_id = SZB1Value[1];
                        data.szb_admin.village_id = 0;
                    } else if (SZB1Value.length == 3) {
                        data.szb_admin.city_id = SZB1Value[0];
                        data.szb_admin.town_id = SZB1Value[1];
                        data.szb_admin.village_id = SZB1Value[2];
                    }
                }
                if (simpleSZXTChecked) {
                    data.szxt_admin.department_id =
                        SZXT1Value[SZXT1Value.length - 1];
                    data.szxt_admin.ids = SZXT1Value;
                }
                if (simpleXMGLChecked) {
                    data.xmgl_admin.type = XMGL1Value[0];
                    data.xmgl_admin.obj_unit_id =
                        XMGL1Value[0] == 0 ? 0 : XMGL2Value[0];
                    data.xmgl_admin.group_hashid = XMGL1Value[0];
                }
                let finalData = {
                    permissions: data,
                    id: idForEdit,
                };
                console.log(finalData);
                Apis.modifyUserPermission(finalData)
                    .then((res) => {
                        if (res && res.code === 0) {
                            setShowEditPermission(false);
                            message.success('????????????');
                            setCurrent(1);
                            initRequest();
                        } else {
                            message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleEditPermissionCancel = () => {
        setShowEditPermission(false);
    };
    const handleNormalOk = () => {
        normalForm
            .validateFields()
            .then((res) => {
                let data = {
                    username: res.username,
                    real_name: res.real_name,
                    mobile: res.mobile,
                    avatar: fileNormalList[0].url,
                    role_id: res.role_id,
                };
                data.id = idForEdit;
                Apis.adminModify(data)
                    .then((res: any) => {
                        if (res && res.code === 0) {
                            message.success('????????????');
                            setCurrent(1);
                            initRequest();
                            setShowEditNormal(false);
                        } else {
                            message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const handleNormalCancel = () => {
        setShowEditNormal(false);
    };
    const handleNewOk = () => {
        form.validateFields()
            .then((res) => {
                console.log(res);
                let data = {
                    szb_admin: {},
                    szxt_admin: {},
                    xmgl_admin: {},
                };
                data.szb_admin.is_visit = simpleSZBChecked ? 1 : 0;
                data.szxt_admin.is_visit = simpleSZXTChecked ? 1 : 0;
                data.xmgl_admin.is_visit = simpleXMGLChecked ? 1 : 0;
                if (simpleSZBChecked) {
                    data.szb_admin.role_id = SZB2Value[0];
                    if (SZB1Value.length == 1) {
                        data.szb_admin.city_id = SZB1Value[0];
                        data.szb_admin.town_id = 0;
                        data.szb_admin.village_id = 0;
                    } else if (SZB1Value.length == 2) {
                        data.szb_admin.city_id = SZB1Value[0];
                        data.szb_admin.town_id = SZB1Value[1];
                        data.szb_admin.village_id = 0;
                    } else if (SZB1Value.length == 3) {
                        data.szb_admin.city_id = SZB1Value[0];
                        data.szb_admin.town_id = SZB1Value[1];
                        data.szb_admin.village_id = SZB1Value[2];
                    }
                }
                if (simpleSZXTChecked) {
                    data.szxt_admin.ids = SZXT1Value;
                    data.szxt_admin.department_id =
                        SZXT1Value[SZXT1Value.length - 1];
                }
                if (simpleXMGLChecked) {
                    data.xmgl_admin.type = XMGL1Value[0];
                    data.xmgl_admin.obj_unit_id =
                        XMGL1Value[0] == 0 ? 0 : XMGL2Value[0];
                    data.xmgl_admin.group_hashid = XMGL1Value[0];
                }
                let finalData = {
                    permissions: data,
                    username: res.username,
                    real_name: res.real_name,
                    mobile: res.mobile,
                    avatar: fileList[0].url,
                    role_id: res.role_id,
                    password: res.password,
                    password2: res.password2,
                };
                console.log(finalData);
                Apis.adminAdd(finalData)
                    .then((res: any) => {
                        if (res && res.code === 0) {
                            message.success('????????????');
                            setShowNew(false);
                            setCurrent(1);
                            initRequest();
                        } else {
                            message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const handleNewCancel = () => {
        setShowNew(false);
    };
    const checkMobile = (_: any, value: { number: number }) => {
        const phoneReg = /^1[3-9]\d{9}$/;
        const result = phoneReg.test(value);
        if (value) {
            if (result) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error('????????????????????????'));
            }
        } else {
            return Promise.reject(new Error('?????????????????????'));
        }
    };
    const checkRepeatPassword = (_: any, value: { number: number }) => {
        let first = form.getFieldValue('password');
        if (!value) {
            return Promise.reject(new Error('????????????????????????'));
        } else {
            if (first != value) {
                return Promise.reject(new Error('?????????????????????????????????'));
            } else {
                return Promise.resolve();
            }
        }
    };
    const checkPermisson = (_: any, value: { number: number }) => {
        let first = form.getFieldValue('permission');
        console.log(SZB1Value);
        console.log(SZB2Value);
        console.log(SZXT1Value);
        console.log(XMGL1Value);
        console.log(XMGL2Value);
        if (!simpleSZBChecked && !simpleSZXTChecked && !simpleXMGLChecked) {
            return Promise.resolve();
        } else {
            if (simpleSZBChecked) {
                if (simpleSZXTChecked) {
                    if (simpleXMGLChecked) {
                        if (SZB1Value.length) {
                            if (SZB2Value.length) {
                                if (SZXT1Value.length) {
                                    if (XMGL1Value.length) {
                                        if (XMGL1Value[0] == 0) {
                                            return Promise.resolve();
                                        } else {
                                            if (XMGL2Value.length) {
                                                console.log(
                                                    'XMGL2Value',
                                                    XMGL2Value,
                                                );
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject(
                                                    new Error(
                                                        '??????????????????????????????',
                                                    ),
                                                );
                                            }
                                        }
                                    } else {
                                        return Promise.reject(
                                            new Error('??????????????????????????????'),
                                        );
                                    }
                                } else {
                                    return Promise.reject(
                                        new Error('??????????????????????????????'),
                                    );
                                }
                            } else {
                                return Promise.reject(
                                    new Error('?????????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('?????????????????????????????????'),
                            );
                        }
                    } else {
                        if (SZB1Value.length) {
                            if (SZB2Value.length) {
                                if (SZXT1Value.length) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject(
                                        new Error('??????????????????????????????'),
                                    );
                                }
                            } else {
                                return Promise.reject(
                                    new Error('?????????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('?????????????????????????????????'),
                            );
                        }
                    }
                } else {
                    if (simpleXMGLChecked) {
                        if (SZB1Value.length) {
                            if (SZB2Value.length) {
                                if (XMGL1Value.length) {
                                    if (XMGL1Value[0] == 0) {
                                        return Promise.resolve();
                                    } else {
                                        if (XMGL2Value.length) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(
                                                new Error(
                                                    '??????????????????????????????',
                                                ),
                                            );
                                        }
                                    }
                                } else {
                                    return Promise.reject(
                                        new Error('??????????????????????????????'),
                                    );
                                }
                            } else {
                                return Promise.reject(
                                    new Error('?????????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('?????????????????????????????????'),
                            );
                        }
                    } else {
                        if (SZB1Value.length) {
                            if (SZB2Value.length) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject(
                                    new Error('?????????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('?????????????????????????????????'),
                            );
                        }
                    }
                }
            } else {
                if (simpleSZXTChecked) {
                    if (simpleXMGLChecked) {
                        if (SZXT1Value.length) {
                            if (XMGL1Value.length) {
                                if (XMGL1Value[0] == 0) {
                                    return Promise.resolve();
                                } else {
                                    if (XMGL2Value.length) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject(
                                            new Error('??????????????????????????????'),
                                        );
                                    }
                                }
                            } else {
                                return Promise.reject(
                                    new Error('??????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('??????????????????????????????'),
                            );
                        }
                    } else {
                        if (SZXT1Value.length) {
                            return Promise.resolve();
                        } else {
                            return Promise.reject(
                                new Error('??????????????????????????????'),
                            );
                        }
                    }
                } else {
                    if (simpleXMGLChecked) {
                        if (XMGL1Value[0] == 0) {
                            return Promise.resolve();
                        } else {
                            console.log('asas', XMGL2Value);
                            if (XMGL2Value.length) {
                                if (XMGL1Value.length) {
                                    if (XMGL1Value[0] == 0) {
                                        return Promise.resolve();
                                    } else {
                                        if (XMGL2Value.length) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(
                                                new Error(
                                                    '??????????????????????????????',
                                                ),
                                            );
                                        }
                                    }
                                } else {
                                    return Promise.reject(
                                        new Error('??????????????????????????????'),
                                    );
                                }
                            } else {
                                return Promise.reject(
                                    new Error('??????????????????????????????'),
                                );
                            }
                        }
                    } else {
                        return Promise.resolve();
                    }
                }
            }
        }
    };
    const checkSelfPermisson = (_: any, value: { number: number }) => {
        let first = permissionForm.getFieldValue('permission');
        console.log(SZB1Value);
        console.log(SZB2Value);
        console.log(SZXT1Value);
        console.log(XMGL1Value);
        console.log(XMGL2Value);
        if (!simpleSZBChecked && !simpleSZXTChecked && !simpleXMGLChecked) {
            return Promise.resolve();
        } else {
            if (simpleSZBChecked) {
                if (simpleSZXTChecked) {
                    if (simpleXMGLChecked) {
                        if (SZB1Value.length) {
                            if (SZB2Value.length) {
                                if (SZXT1Value.length) {
                                    if (XMGL1Value.length) {
                                        if (XMGL1Value[0] == 0) {
                                            return Promise.resolve();
                                        } else {
                                            if (XMGL2Value.length) {
                                                console.log(
                                                    'XMGL2Value',
                                                    XMGL2Value,
                                                );
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject(
                                                    new Error(
                                                        '??????????????????????????????',
                                                    ),
                                                );
                                            }
                                        }
                                    } else {
                                        return Promise.reject(
                                            new Error('??????????????????????????????'),
                                        );
                                    }
                                } else {
                                    return Promise.reject(
                                        new Error('??????????????????????????????'),
                                    );
                                }
                            } else {
                                return Promise.reject(
                                    new Error('?????????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('?????????????????????????????????'),
                            );
                        }
                    } else {
                        if (SZB1Value.length) {
                            if (SZB2Value.length) {
                                if (SZXT1Value.length) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject(
                                        new Error('??????????????????????????????'),
                                    );
                                }
                            } else {
                                return Promise.reject(
                                    new Error('?????????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('?????????????????????????????????'),
                            );
                        }
                    }
                } else {
                    if (simpleXMGLChecked) {
                        if (SZB1Value.length) {
                            if (SZB2Value.length) {
                                if (XMGL1Value.length) {
                                    if (XMGL1Value[0] == 0) {
                                        return Promise.resolve();
                                    } else {
                                        if (XMGL2Value.length) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(
                                                new Error(
                                                    '??????????????????????????????',
                                                ),
                                            );
                                        }
                                    }
                                } else {
                                    return Promise.reject(
                                        new Error('??????????????????????????????'),
                                    );
                                }
                            } else {
                                return Promise.reject(
                                    new Error('?????????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('?????????????????????????????????'),
                            );
                        }
                    } else {
                        if (SZB1Value.length) {
                            if (SZB2Value.length) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject(
                                    new Error('?????????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('?????????????????????????????????'),
                            );
                        }
                    }
                }
            } else {
                if (simpleSZXTChecked) {
                    if (simpleXMGLChecked) {
                        if (SZXT1Value.length) {
                            if (XMGL1Value.length) {
                                if (XMGL1Value[0] == 0) {
                                    return Promise.resolve();
                                } else {
                                    if (XMGL2Value.length) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject(
                                            new Error('??????????????????????????????'),
                                        );
                                    }
                                }
                            } else {
                                return Promise.reject(
                                    new Error('??????????????????????????????'),
                                );
                            }
                        } else {
                            return Promise.reject(
                                new Error('??????????????????????????????'),
                            );
                        }
                    } else {
                        if (SZXT1Value.length) {
                            return Promise.resolve();
                        } else {
                            return Promise.reject(
                                new Error('??????????????????????????????'),
                            );
                        }
                    }
                } else {
                    if (simpleXMGLChecked) {
                        if (XMGL1Value[0] == 0) {
                            return Promise.resolve();
                        } else {
                            console.log('asas', XMGL2Value);
                            if (XMGL2Value.length) {
                                if (XMGL1Value.length) {
                                    if (XMGL1Value[0] == 0) {
                                        return Promise.resolve();
                                    } else {
                                        if (XMGL2Value.length) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(
                                                new Error(
                                                    '??????????????????????????????',
                                                ),
                                            );
                                        }
                                    }
                                } else {
                                    return Promise.reject(
                                        new Error('??????????????????????????????'),
                                    );
                                }
                            } else {
                                return Promise.reject(
                                    new Error('??????????????????????????????'),
                                );
                            }
                        }
                    } else {
                        return Promise.resolve();
                    }
                }
            }
        }
    };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const beforeUpload = (file: any) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('???????????????JPG/PNG??????!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('????????????????????????2MB!');
            return Upload.LIST_IGNORE;
        }
        return false;
    };
    const onRemoveImg = (file: any) => {
        setFileList([]);
        setImageUrl('');
    };
    const panelCallback = (key: any) => {
        console.log(key);
    };
    const panelPermissionCallback = (key: any) => {
        console.log(key);
    };
    const handleNormalChange = (info: any) => {
        if (info.fileList.length) {
            const formData = new FormData();
            formData.append('file', info.file);
            setUploadLoading(true);
            Apis.uploadImages(formData)
                .then((res: any) => {
                    if (res && res.code === 0) {
                        setImageNormalUrl(`${imgPre}${res.data.img_url}`);
                        setFileNormalList([
                            {
                                url: `${imgPre}${res.data.img_url}`,
                            },
                        ]);
                    } else {
                        message.error(res.msg);
                    }
                })
                .catch((err) => {
                    console.log('err', err);
                })
                .finally(() => {
                    setUploadLoading(false);
                });
        } else {
            setFileNormalList([]);
            setImageNormalUrl('');
        }
    };
    const onRemoveNormalImg = (file: any) => {
        setFileNormalList([]);
        setImageNormalUrl('');
    };
    const handleChange = (info: any) => {
        if (info.fileList.length) {
            const formData = new FormData();
            formData.append('file', info.file);
            setUploadLoading(true);
            Apis.uploadImages(formData)
                .then((res: any) => {
                    if (res && res.code === 0) {
                        setImageUrl(`${imgPre}${res.data.img_url}`);
                        setFileList([
                            {
                                url: `${imgPre}${res.data.img_url}`,
                            },
                        ]);
                    } else {
                        message.error(res.msg);
                    }
                })
                .catch((err) => {
                    console.log('err', err);
                })
                .finally(() => {
                    setUploadLoading(false);
                });
        } else {
            setFileList([]);
            setImageUrl('');
        }
    };
    const fetchPermissionRole = () => {
        Apis.getPermissionRoleVillage({})
            .then((res: any) => {
                if (res && res.code === 0) {
                    // console.log('res', res.data.list);
                    let track1 = res.data.list.find((ele) => {
                        return ele.platform_name == '?????????????????????';
                    });
                    let track2 = res.data.list.find((ele) => {
                        return ele.platform_name == '??????????????????';
                    });
                    let track3 = res.data.list.find((ele) => {
                        return ele.platform_name == '??????????????????????????????';
                    });
                    // console.log(track1);

                    if (track1) {
                        setSZBOptions1(track1.sub_info.szb_user_address_list);
                        setSZBOptions2(track1.sub_info.szb_user_role_list);
                    }

                    if (track3) {
                        setSZXTOptions1(track3.sub_info.szxt_department_list);
                    }
                    if (track2) {
                        setXMGLOptions1(track2.sub_info.xmgl_type_list);
                        setBackUpOptions1(track2.sub_info.xmgl_audit_list);
                        setBackUpOptions2(track2.sub_info.xmgl_build_list);
                        setBackUpOptions3(track2.sub_info.xmgl_project_list);
                    }

                    // console.log(track2);
                    // console.log(track3);
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    useEffect(() => {
        initAction();
        initRoles();
        initRequest();
        fetchPermissionRole();
    }, []);
    useEffect(() => {
        initRequest();
    }, [current]);
    let dynamicContent = (
        <div className={styles.active1TableMaster}>
            <div className={styles.active1NewCon}>
                {showNewBtn ? (
                    <Button
                        shape="round"
                        type="primary"
                        onClick={() => popNew()}
                    >
                        ??????
                    </Button>
                ) : null}
            </div>
            <div className={styles.active1TableCon}>
                <Table
                    columns={columns}
                    rowKey={(item) => item.id}
                    dataSource={listData}
                    pagination={false}
                    loading={loading}
                    bordered
                />
                <Pagination
                    className={styles.pagination}
                    hideOnSinglePage
                    total={total}
                    current={current}
                    pageSize={pagesize}
                    showTotal={showTotal}
                    showSizeChanger={false}
                    onChange={(e) => {
                        onPagChange(e);
                    }}
                />
            </div>
        </div>
    );
    let tabAddon = (
        <div className={styles.active1InputCon}>
            <div className={styles.active1InputLeftCon}>
                <span className={styles.active1InputLeftConTitle}>?????????</span>
                <Input
                    className={styles.leftSerach}
                    placeholder="???????????????"
                    allowClear
                    maxLength={20}
                    value={leftSerach}
                    onChange={(e) => {
                        leftSerachChange(e);
                    }}
                />
            </div>
            <div className={styles.active1InputRightCon}>
                <Button
                    shape="round"
                    type="primary"
                    onClick={() => active1Search()}
                >
                    ??????
                </Button>
            </div>
        </div>
    );
    let optionsArray = roleList.map((ele) => (
        <Option key={ele.id} value={ele.id}>
            {ele.role_name}
        </Option>
    ));
    const onSZB1Change = (value) => {
        setSZB1Value(value);
        console.log(value);
    };
    const onSZB2Change = (value) => {
        console.log(value);
        setSZB2Value(value);
    };
    const onSZXT1Change = (value) => {
        setSZXT1Value(value);
    };
    const SZBCheckedChange = () => {
        setSimpleSZBChecked(!simpleSZBChecked);
    };
    const SZXTCheckedChange = () => {
        setSimpleSZXTChecked(!simpleSZXTChecked);
    };
    const XMGLCheckedChange = () => {
        setSimpleXMGLChecked(!simpleXMGLChecked);
    };
    //     XMGL1Default
    const onXMGL1Change = (value) => {
        setXMGL1Value(value);
        setXMGL2Value([]);
        if (value[0]) {
            if (value[0] == 1) {
                setXMGLOptions2(backUpOptions3);
                setDynamicFieldNames({
                    value: 'id',
                    label: 'project_name',
                    children: 'children',
                });
            }
            if (value[0] == 2) {
                setXMGLOptions2(backUpOptions2);
                setDynamicFieldNames({
                    value: 'id',
                    label: 'audit_name',
                    children: 'children',
                });
            }
            if (value[0] == 3) {
                console.log('XMGLOptions2', XMGLOptions2);
                setXMGLOptions2(backUpOptions1);
                console.log(XMGL2Value);
                setDynamicFieldNames({
                    value: 'id',
                    label: 'build_name',
                    children: 'children',
                });
            }
        }
    };
    const onXMGL2Change = (value) => {
        console.log(value);
        setXMGL2Value(value);
    };
    return (
        <div className={styles.masterPageCon}>
            <Modal
                width={1000}
                maskClosable={false}
                centered
                destroyOnClose
                visible={showNew}
                title="??????"
                onOk={handleNewOk}
                onCancel={handleNewCancel}
            >
                <Form
                    {...layout}
                    form={form}
                    name="nest-messages"
                    labelAlign={'left'}
                >
                    <Form.Item
                        name="username"
                        label="?????????"
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        name="real_name"
                        label="????????????"
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        name="mobile"
                        label="?????????"
                        className={styles.requiredRed}
                        hasFeedback
                        rules={[{ validator: checkMobile }]}
                    >
                        <Input maxLength={11} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="?????????"
                        hasFeedback
                        rules={[
                            { required: true, message: '??????????????????' },
                            {
                                min: 6,
                                max: 15,
                                message: '???????????????6-15?????????',
                            },
                        ]}
                    >
                        <Input.Password maxLength={15} />
                    </Form.Item>
                    <Form.Item
                        name="password2"
                        label="????????????"
                        hasFeedback
                        className={styles.requiredRed}
                        rules={[{ validator: checkRepeatPassword }]}
                    >
                        <Input.Password maxLength={15} />
                    </Form.Item>
                    <Form.Item
                        name="role_id"
                        label="??????"
                        hasFeedback
                        rules={[{ required: true, message: '??????????????????' }]}
                    >
                        <Select>{optionsArray}</Select>
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="??????"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: '???????????????' }]}
                        extra="????????????????????????2MB???JPG/PNG??????"
                    >
                        <Upload
                            fileList={fileList}
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={{
                                showRemoveIcon: true,
                                showPreviewIcon: false,
                            }}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            onRemove={onRemoveImg}
                            maxCount={1}
                        >
                            {imageUrl ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="permission"
                        className={styles.requiredRed}
                        label="??????"
                        rules={[{ validator: checkPermisson }]}
                    >
                        <Collapse
                            defaultActiveKey={['1']}
                            onChange={panelCallback}
                        >
                            {showSZBEdit && SZBOptions1.length ? (
                                <Panel header="?????????????????????" key="1">
                                    <Checkbox
                                        checked={simpleSZBChecked}
                                        onChange={() => SZBCheckedChange()}
                                    >
                                        ????????????????????????
                                    </Checkbox>
                                    <Cascader
                                        changeOnSelect={true}
                                        className={styles.SZBOptions1Con}
                                        disabled={!simpleSZBChecked}
                                        fieldNames={{
                                            label: 'label',
                                            value: 'value',
                                            children: 'children',
                                        }}
                                        defaultValue={SZB1Default}
                                        options={SZBOptions1}
                                        onChange={(value) =>
                                            onSZB1Change(value)
                                        }
                                    />
                                    <Cascader
                                        className={styles.SZBOptions2Con}
                                        disabled={!simpleSZBChecked}
                                        fieldNames={{
                                            label: 'role_name',
                                            value: 'role_id',
                                            children: 'children',
                                        }}
                                        defaultValue={SZB2Default}
                                        options={SZBOptions2}
                                        onChange={(value) =>
                                            onSZB2Change(value)
                                        }
                                    />
                                </Panel>
                            ) : null}
                            {showSZXTEdit && SZXTOptions1.length ? (
                                <Panel header="????????????????????????" key="2">
                                    <Checkbox
                                        checked={simpleSZXTChecked}
                                        onChange={() => SZXTCheckedChange()}
                                    >
                                        ????????????????????????
                                    </Checkbox>
                                    <Cascader
                                        changeOnSelect={true}
                                        disabled={!simpleSZXTChecked}
                                        className={styles.SZBOptions1Con}
                                        fieldNames={{
                                            label: 'title',
                                            value: 'id',
                                            children: 'parent',
                                        }}
                                        defaultValue={SZXT1Default}
                                        options={SZXTOptions1}
                                        onChange={(value) =>
                                            onSZXT1Change(value)
                                        }
                                    />
                                </Panel>
                            ) : null}
                            {showXMGLEdit && XMGLOptions1.length ? (
                                <Panel header="??????????????????" key="3">
                                    <Checkbox
                                        checked={simpleXMGLChecked}
                                        onChange={() => XMGLCheckedChange()}
                                    >
                                        ????????????????????????
                                    </Checkbox>
                                    <Cascader
                                        className={styles.SZBOptions1Con}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'type',
                                            children: 'children',
                                        }}
                                        disabled={!simpleXMGLChecked}
                                        defaultValue={XMGL1Default}
                                        options={XMGLOptions1}
                                        onChange={(value) =>
                                            onXMGL1Change(value)
                                        }
                                    />
                                    {XMGL1Value[0] ? (
                                        <Cascader
                                            disabled={!simpleXMGLChecked}
                                            className={styles.SZBOptions2Con}
                                            fieldNames={dynamicFieldNames}
                                            defaultValue={XMGL2Default}
                                            options={XMGLOptions2}
                                            onChange={(value) =>
                                                onXMGL2Change(value)
                                            }
                                        />
                                    ) : null}
                                </Panel>
                            ) : null}
                        </Collapse>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                maskClosable={false}
                centered
                destroyOnClose
                visible={showEditNormal}
                title="??????"
                onOk={handleNormalOk}
                onCancel={handleNormalCancel}
            >
                <Form
                    {...layout}
                    form={normalForm}
                    name="nest-messages"
                    labelAlign={'left'}
                >
                    <Form.Item
                        name="username"
                        label="?????????"
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        name="real_name"
                        label="????????????"
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        name="mobile"
                        label="?????????"
                        className={styles.requiredRed}
                        hasFeedback
                        rules={[{ validator: checkMobile }]}
                    >
                        <Input maxLength={11} />
                    </Form.Item>
                    <Form.Item
                        name="role_id"
                        label="??????"
                        hasFeedback
                        rules={[{ required: true, message: '??????????????????' }]}
                    >
                        <Select>{optionsArray}</Select>
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="??????"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: '???????????????' }]}
                        extra="????????????????????????2MB???JPG/PNG??????"
                    >
                        <Upload
                            fileList={fileNormalList}
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={{
                                showRemoveIcon: true,
                                showPreviewIcon: false,
                            }}
                            beforeUpload={beforeUpload}
                            onChange={handleNormalChange}
                            onRemove={onRemoveNormalImg}
                            maxCount={1}
                        >
                            {imageNormalUrl ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                width={1000}
                maskClosable={false}
                centered
                destroyOnClose
                visible={showEditPermission}
                title="????????????"
                onOk={handleEditPermissionOk}
                onCancel={handleEditPermissionCancel}
            >
                <Form
                    {...layout}
                    form={permissionForm}
                    name="nest-messages"
                    labelAlign={'left'}
                >
                    <Form.Item
                        name="permission"
                        className={styles.requiredRed}
                        label="??????"
                        rules={[{ validator: checkSelfPermisson }]}
                    >
                        <Collapse
                            defaultActiveKey={['1']}
                            onChange={panelPermissionCallback}
                        >
                            {showSZBEdit && SZBOptions1.length ? (
                                <Panel header="?????????????????????" key="1">
                                    <Checkbox
                                        checked={simpleSZBChecked}
                                        onChange={() => SZBCheckedChange()}
                                    >
                                        ????????????????????????
                                    </Checkbox>
                                    <Cascader
                                        disabled={!simpleSZBChecked}
                                        className={styles.SZBOptions1Con}
                                        changeOnSelect={true}
                                        fieldNames={{
                                            label: 'label',
                                            value: 'value',
                                            children: 'children',
                                        }}
                                        defaultValue={SZB1Default}
                                        options={SZBOptions1}
                                        onChange={(value) =>
                                            onSZB1Change(value)
                                        }
                                    />
                                    <Cascader
                                        disabled={!simpleSZBChecked}
                                        className={styles.SZBOptions2Con}
                                        fieldNames={{
                                            label: 'role_name',
                                            value: 'role_id',
                                            children: 'children',
                                        }}
                                        defaultValue={SZB2Default}
                                        options={SZBOptions2}
                                        onChange={(value) =>
                                            onSZB2Change(value)
                                        }
                                    />
                                </Panel>
                            ) : null}

                            {showSZXTEdit && SZXTOptions1.length ? (
                                <Panel header="????????????????????????" key="2">
                                    <Checkbox
                                        checked={simpleSZXTChecked}
                                        onChange={() => SZXTCheckedChange()}
                                    >
                                        ????????????????????????
                                    </Checkbox>
                                    <Cascader
                                        changeOnSelect={true}
                                        disabled={!simpleSZXTChecked}
                                        className={styles.SZBOptions1Con}
                                        fieldNames={{
                                            label: 'title',
                                            value: 'id',
                                            children: 'parent',
                                        }}
                                        defaultValue={SZXT1Default}
                                        options={SZXTOptions1}
                                        onChange={(value) =>
                                            onSZXT1Change(value)
                                        }
                                    />
                                </Panel>
                            ) : null}

                            {showXMGLEdit && XMGLOptions1.length ? (
                                <Panel header="??????????????????" key="3">
                                    <Checkbox
                                        checked={simpleXMGLChecked}
                                        onChange={() => XMGLCheckedChange()}
                                    >
                                        ????????????????????????
                                    </Checkbox>
                                    <Cascader
                                        className={styles.SZBOptions1Con}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'type',
                                            children: 'children',
                                        }}
                                        disabled={!simpleXMGLChecked}
                                        defaultValue={XMGL1Default}
                                        options={XMGLOptions1}
                                        onChange={(value) =>
                                            onXMGL1Change(value)
                                        }
                                    />
                                    {XMGL1Value[0] ? (
                                        <Cascader
                                            className={styles.SZBOptions2Con}
                                            fieldNames={dynamicFieldNames}
                                            defaultValue={XMGL2Default}
                                            disabled={!simpleXMGLChecked}
                                            options={XMGLOptions2}
                                            onChange={(value) =>
                                                onXMGL2Change(value)
                                            }
                                        />
                                    ) : null}
                                </Panel>
                            ) : null}
                        </Collapse>
                    </Form.Item>
                </Form>
            </Modal>

            <div className={styles.innerCon}>
                <div className={styles.titleCon}>????????????</div>
                <div className={styles.tabAddonCon}>{tabAddon}</div>
                <div className={styles.dynamicContentCon}>{dynamicContent}</div>
            </div>
        </div>
    );
};

export default connect(({ baseModel }) => ({ baseModel }))(
    WorkBenchAccountPage,
);
