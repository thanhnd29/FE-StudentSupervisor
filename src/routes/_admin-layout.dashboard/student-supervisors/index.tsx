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

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Student Supervisors');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="student-supervisors"
                    title="Student Supervisors"
                    columns={[
                        {
                            key: 'studentSupervisorId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'supervisorCode',
                            title: 'Supervisor Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'supervisorName',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'userCode',
                            title: 'User Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'phone',
                            title: 'Phone',
                            type: FieldType.TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },
                        {
                            key: 'address',
                            title: 'Address',
                            type: FieldType.TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },
                        {
                            key: 'roleId',
                            title: 'Role',
                            type: FieldType.BADGE_API,
                            apiAction() {
                                return RoleList;
                            },
                        },
                    ]}
                    queryApi={schoolId ? () => studentSupervisorApi.getBySchool(schoolId) : studentSupervisorApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
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
                                                schoolAdminId: record.schoolAdminId,
                                                supervisorCode: record.supervisorCode,
                                                supervisorName: record.supervisorName,
                                                userCode: record.userCode,
                                            }}
                                            fields={[
                                                {
                                                    name: 'supervisorName',
                                                    type: NKFormType.TEXT,
                                                    label: 'Name',
                                                },
                                                {
                                                    name: 'supervisorCode',
                                                    type: NKFormType.TEXT,
                                                    label: 'Code',
                                                },
                                                {
                                                    name: 'userCode',
                                                    type: NKFormType.TEXT,
                                                    label: 'User Code',
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
                                                    name: 'schoolAdminId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'School Admin',
                                                    fieldProps: {
                                                        apiAction: (value) => schoolAdminApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolAdminId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                supervisorCode: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                supervisorName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                userCode: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['student-supervisors'],
                                                });

                                                close();

                                                toast.success('Update student supervisor successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => studentSupervisorApi.delete(record.studentSupervisorId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this student supervisor?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['student-supervisors'],
                                    });

                                    toast.success('Delete student supervisor successfully');
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
                            btnLabel="Create Student Supervisor"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Student Supervisor"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        apiAction={studentSupervisorApi.create}
                                        fields={[
                                            {
                                                name: 'supervisorName',
                                                type: NKFormType.TEXT,
                                                label: 'Name',
                                            },
                                            {
                                                name: 'supervisorCode',
                                                type: NKFormType.TEXT,
                                                label: 'Code',
                                            },
                                            {
                                                name: 'userCode',
                                                type: NKFormType.TEXT,
                                                label: 'User Code',
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
                                                name: 'schoolAdminId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'School Admin',
                                                fieldProps: {
                                                    apiAction: (value) => schoolAdminApi.getEnumSelectOptions(value),
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolAdminId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            supervisorCode: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            supervisorName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            userCode: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['student-supervisors'],
                                            });

                                            close();

                                            toast.success('Create student supervisor successfully');
                                        }}
                                        defaultValues={{
                                            address: '',
                                            description: '',
                                            password: '',
                                            phone: '',
                                            supervisorCode: '',
                                            schoolAdminId: 0,
                                            supervisorName: '',
                                            userCode: '',
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
