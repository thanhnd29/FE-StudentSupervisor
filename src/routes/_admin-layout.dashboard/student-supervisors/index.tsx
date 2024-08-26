import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { schoolAdminApi } from '@/core/api/school-admin.api';
import { IUpdateStudentSupervisorDto, studentSupervisorApi } from '@/core/api/student-supervisor.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { RoleList } from '@/core/models/user';
import { toastError } from '@/core/utils/api.helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { studentInClassApi } from '@/core/api/student-in-class.api';
import { highSchoolApi } from '@/core/api/high-school.api';
import { classApi } from '@/core/api/class.api';
import { useState } from 'react';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const [classT, setClassT] = useState<number | null>(null)

    useDocumentTitle('Danh sách Sao đỏ');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="student-supervisors"
                    title="Danh sách Sao đỏ"
                    columns={[
                        {
                            key: 'studentSupervisorId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'code',
                            title: 'Mã sao đỏ',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'supervisorName',
                            title: 'Tên sao đỏ',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'phone',
                            title: 'Số điện thoại',
                            type: FieldType.TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },
                        {
                            key: 'address',
                            title: 'Địa chỉ',
                            type: FieldType.TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },
                        {
                            key: 'description',
                            title: 'Mô tả',
                            type: FieldType.TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },
                        {
                            key: 'password',
                            title: 'Mật khẩu',
                            type: FieldType.TEXT,
                            formatter(value) {
                                return "***********";
                            },
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: studentSupervisorApi.getEnumStatuses
                        },
                    ]}
                    isSelectYear={true}
                    schoolId={schoolId}
                    queryApi={schoolId ? () => studentSupervisorApi.getBySchool(schoolId) : studentSupervisorApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            {/* <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Student Supervisor"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder<IUpdateStudentSupervisorDto>
                                            className="!p-0"
                                            apiAction={(data) => studentSupervisorApi.update(record.studentSupervisorId, data)}
                                            defaultValues={{
                                                address: record.address,
                                                description: record.description,
                                                password: record.password,
                                                phone: record.phone,
                                                code: record.code,
                                                supervisorName: record.supervisorName,
                                                schoolId: schoolId,
                                                studentInClassId: record.studentInClassId,
                                            }}
                                            fields={[
                                                {
                                                    label: 'Student',
                                                    name: 'studentInClassId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) =>
                                                            studentInClassApi.getEnumSelectOptions({
                                                                search: value,
                                                            }),
                                                        readonly: true
                                                    },
                                                },
                                                {
                                                    name: 'supervisorName',
                                                    type: NKFormType.TEXT,
                                                    label: 'Name',
                                                },
                                                {
                                                    name: 'code',
                                                    type: NKFormType.TEXT,
                                                    label: 'Code',
                                                },
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Description',
                                                },
                                                {
                                                    name: 'phone',
                                                    type: NKFormType.TEXT,
                                                    label: 'Phone',
                                                },
                                                {
                                                    name: 'address',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Address',
                                                },
                                                {
                                                    name: 'password',
                                                    type: NKFormType.PASSWORD,
                                                    label: 'Password',
                                                },
                                                {
                                                    name: 'schoolId',
                                                    label: 'School',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                        readonly: true
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                studentInClassId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                supervisorName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['student-supervisors'],
                                                });

                                                close();

                                                toast.success(data.message || 'Successful');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder> */}
                            <CTAButton
                                ctaApi={() => studentSupervisorApi.delete(record.studentSupervisorId)}
                                isConfirm
                                confirmMessage="Bạn có chắc chắn muốn xóa Sao đỏ này không?"
                                extraOnError={toastError}
                                extraOnSuccess={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['student-supervisors'],
                                    });

                                    toast.success(data.message || 'Successful');
                                }}
                            >
                                <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CTAButton>
                        </div>
                    )}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Tạo sao đỏ"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Tạo sao đỏ"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        apiAction={studentSupervisorApi.create}
                                        fields={[
                                            {
                                                label: 'Lớp',
                                                name: 'classId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) =>
                                                        classApi.getEnumSelectOptions({
                                                            search: value,
                                                            highSchoolId: schoolId,
                                                            year: Number(new Date().getFullYear())
                                                        }),
                                                },
                                                onChangeExtra: (value) => {
                                                    setClassT(value)
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['options', 'studentInClassId'],
                                                    });
                                                }
                                            },
                                            {
                                                label: 'Học sinh',
                                                name: 'studentInClassId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value, formMethods) => {
                                                        const classId = formMethods.getValues('classId');
                                                        return studentInClassApi.getEnumSelectOptions({
                                                            search: value,
                                                            classId: classId
                                                        });
                                                    },
                                                    queryKey: "studentInClassId",
                                                    disabled: !classT,
                                                },
                                            },
                                            {
                                                name: 'supervisorName',
                                                type: NKFormType.TEXT,
                                                label: 'Tên tài khoản',
                                            },
                                            {
                                                name: 'code',
                                                type: NKFormType.TEXT,
                                                label: 'Mã sao đỏ',
                                            },
                                            {
                                                name: 'phone',
                                                type: NKFormType.TEXT,
                                                label: 'Số điện thoại',
                                            },
                                            {
                                                name: 'address',
                                                type: NKFormType.TEXTAREA,
                                                label: 'Địa chỉ',
                                            },
                                            {
                                                name: 'password',
                                                type: NKFormType.PASSWORD,
                                                label: 'Mật khẩu',
                                            },
                                            {
                                                name: 'description',
                                                type: NKFormType.TEXTAREA,
                                                label: 'Mô tả',
                                            },
                                            {
                                                name: 'schoolId',
                                                label: 'Trường',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                    readonly: true
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            phone: Joi.string().required().length(9).messages(NKConstant.MESSAGE_FORMAT),
                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            supervisorName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            studentInClassId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['student-supervisors'],
                                            });

                                            close();

                                            toast.success(data.message || 'Successful');
                                        }}
                                        defaultValues={{
                                            address: '',
                                            description: '',
                                            password: '',
                                            phone: '',
                                            code: '',
                                            supervisorName: '',
                                            schoolId: schoolId || 0,
                                            studentInClassId: 0,
                                            classId: 0,
                                        }}
                                        isDebug
                                    />
                                );
                            }}
                        </ModalBuilder>
                    }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/student-supervisors/')({
    component: Page,
});
