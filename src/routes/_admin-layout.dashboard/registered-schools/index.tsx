import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { highSchoolApi } from '@/core/api/high-school.api';
import { registerSchoolApi } from '@/core/api/register-school.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { toastError } from '@/core/utils/api.helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { FilterComparator } from '@/core/models/common';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Danh sách các trường đăng ký');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="registered-schools"
                    title="Danh sách các trường đăng ký"
                    columns={[
                        {
                            key: 'registeredId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'schoolCode',
                            title: 'Mã trường',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'schoolId',
                            title: 'Tên trường',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return highSchoolApi.getEnumSelectOptions(value);
                            },
                        },
                        {
                            key: 'city',
                            title: 'Thành phố',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'address',
                            title: 'Địa chỉ',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'phone',
                            title: 'Số điện thoại',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'webURL',
                            title: 'Web trường',
                            type: FieldType.LINK_BUTTON,
                        },
                        {
                            key: 'registeredDate',
                            title: 'Ngày đăng ký',
                            type: FieldType.TIME_DATE,
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
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return registerSchoolApi.getEnumStatus();
                            },
                        },
                    ]}
                    queryApi={schoolId ? () => registerSchoolApi.getBySchool(schoolId) : registerSchoolApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Cập nhật"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            apiAction={(dto) =>
                                                registerSchoolApi.update({
                                                    ...dto,
                                                    registeredId: record.registeredId,
                                                    registeredDate: dto.registeredDate.toISOString(),
                                                })
                                            }
                                            defaultValues={{
                                                description: record.description,
                                                registeredDate: new Date(record.registeredDate),
                                                registeredId: record.registeredId,
                                                schoolName: record.schoolName,
                                                status: record.status,
                                                schoolCode: record.schoolCode,
                                                city: record.city,
                                                address: record.address,
                                                phone: record.phone,
                                                webURL: record.webURL,
                                            }}
                                            fields={[
                                                {
                                                    name: 'schoolCode',
                                                    type: NKFormType.TEXT,
                                                    label: 'Mã trường',
                                                },
                                                {
                                                    name: 'schoolName',
                                                    type: NKFormType.TEXT,
                                                    label: 'Tên trường',
                                                },
                                                {
                                                    name: 'city',
                                                    type: NKFormType.TEXT,
                                                    label: 'Thành phố',
                                                },
                                                {
                                                    name: 'address',
                                                    type: NKFormType.TEXT,
                                                    label: 'Địa chỉ',
                                                },
                                                {
                                                    name: 'phone',
                                                    type: NKFormType.TEXT,
                                                    label: 'Số điện thoại',
                                                },
                                                {
                                                    name: 'webURL',
                                                    type: NKFormType.TEXT,
                                                    label: 'Web trường',
                                                },
                                                {
                                                    name: 'registeredDate',
                                                    type: NKFormType.DATE,
                                                    label: 'Ngày đăng ký',
                                                },
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Mô tả',
                                                },
                                                {
                                                    name: 'status',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Trạng thái',
                                                    fieldProps: {
                                                        apiAction: registerSchoolApi.getEnumStatus,
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                registeredDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                registeredId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                city: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolCode: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                webURL: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT)
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['registered-schools'],
                                                });

                                                close();

                                                toast.success(data.message || 'Successful');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => registerSchoolApi.delete(record.registeredId)}
                                isConfirm
                                confirmMessage="Bạn có chắc chắn muốn xóa trường đã đăng ký này không?"
                                extraOnError={toastError}
                                extraOnSuccess={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['registered-schools'],
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
                    filters={[
                        {
                            label: 'Mã trường',
                            comparator: FilterComparator.LIKE,
                            name: 'schoolCode',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Trạng thái',
                            comparator: FilterComparator.LIKE,
                            name: 'status',
                            type: NKFormType.SELECT_API_OPTION,
                            apiAction: registerSchoolApi.getEnumStatus,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Thêm trường đăng ký"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Thêm trường đăng ký"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        apiAction={(dto) => {
                                            return registerSchoolApi.create({
                                                ...dto,
                                                registeredDate: dto.registeredDate.toISOString(),
                                            });
                                        }}
                                        fields={[
                                            {
                                                name: 'schoolCode',
                                                type: NKFormType.TEXT,
                                                label: 'Mã trường',
                                            },
                                            {
                                                name: 'schoolName',
                                                type: NKFormType.TEXT,
                                                label: 'Tên trường',
                                            },
                                            {
                                                name: 'city',
                                                type: NKFormType.TEXT,
                                                label: 'Thành phố',
                                            },
                                            {
                                                name: 'address',
                                                type: NKFormType.TEXT,
                                                label: 'Địa chỉ',
                                            },
                                            {
                                                name: 'phone',
                                                type: NKFormType.TEXT,
                                                label: 'Số điện thoại',
                                            },
                                            {
                                                name: 'webURL',
                                                type: NKFormType.TEXT,
                                                label: 'Web trường',
                                            },
                                            {
                                                name: 'registeredDate',
                                                type: NKFormType.DATE,
                                                label: 'Ngày đăng ký',
                                            },
                                            {
                                                name: 'description',
                                                type: NKFormType.TEXTAREA,
                                                label: 'Mô tả',
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            registeredDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            city: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolCode: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            webURL: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT)
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['registered-schools'],
                                            });

                                            close();

                                            toast.success(data.message || 'Successful');
                                        }}
                                        defaultValues={{
                                            description: '',
                                            registeredDate: new Date(),
                                            schoolName: '',
                                            schoolCode: '',
                                            city: '',
                                            address: '',
                                            phone: '',
                                            webURL: '',
                                        }}
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

export const Route = createFileRoute('/_admin-layout/dashboard/registered-schools/')({
    component: Page,
});
