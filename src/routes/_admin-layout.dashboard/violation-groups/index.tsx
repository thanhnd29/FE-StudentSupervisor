import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { ICreateViolationGroupDto, IUpdateViolationGroupDto, violationGroupApi } from '@/core/api/violation-group.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';
import { highSchoolApi } from '@/core/api/high-school.api';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Danh sách Nhóm vi phạm');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="violation-groups"
                    title="Danh sách Nhóm vi phạm"
                    columns={[
                        {
                            key: 'violationGroupId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'vioGroupCode',
                            title: 'Mã',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'vioGroupName',
                            title: 'Tên',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'description',
                            title: 'Mô tả',
                            type: FieldType.MULTILINE_TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: violationGroupApi.getEnumStatuses,
                        },
                    ]}
                    queryApi={schoolId ? () => violationGroupApi.getBySchool(schoolId) : violationGroupApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    type: 'primary',
                                    size: 'small',
                                    icon: <EyeOutlined />,
                                }}
                                title="Detail Violation Group"
                            >
                                <FieldBuilder
                                    title=""
                                    record={record}
                                    isPadding={false}
                                    fields={[
                                        {
                                            key: 'violationGroupId',
                                            title: 'ID',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'vioGroupCode',
                                            title: 'Mã',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'vioGroupName',
                                            title: 'Tên',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'description',
                                            title: 'Mô tả',
                                            type: FieldType.MULTILINE_TEXT,
                                        },
                                    ]}
                                />
                            </ModalBuilder>
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
                                        <FormBuilder<IUpdateViolationGroupDto>
                                            className="!p-0"
                                            apiAction={(dto) => violationGroupApi.update(record.violationGroupId, dto)}
                                            defaultValues={{
                                                schoolId: schoolId,
                                                vioGroupCode: record.vioGroupCode,
                                                vioGroupName: record.vioGroupName,
                                                description: record.description,
                                            }}
                                            fields={[
                                                {
                                                    name: 'schoolId',
                                                    label: 'Trường',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                        readonly: true
                                                    },
                                                },
                                                {
                                                    name: 'vioGroupCode',
                                                    label: 'Mã',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'vioGroupName',
                                                    label: 'Tên',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'description',
                                                    label: 'Mô tả',
                                                    type: NKFormType.TEXTAREA,
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                vioGroupCode: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                vioGroupName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                description: Joi.string().allow('').optional().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['violation-groups'],
                                                });
                                                close();
                                                toast.success(data.message || 'Successful');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => violationGroupApi.delete(record.violationGroupId)}
                                isConfirm
                                confirmMessage="Bạn có chắc chắn muốn xóa nhóm vi phạm này không?"
                                extraOnError={toastError}
                                extraOnSuccess={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['violation-groups'],
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
                            label: 'Tên',
                            comparator: FilterComparator.LIKE,
                            name: 'vioGroupName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Mã',
                            comparator: FilterComparator.LIKE,
                            name: 'code',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Tạo"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Tạo nhóm vi phạm"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder<ICreateViolationGroupDto>
                                        className="!p-0"
                                        apiAction={violationGroupApi.create}
                                        fields={[
                                            {
                                                name: 'schoolId',
                                                label: 'Trường',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                    readonly: true
                                                },
                                            },
                                            {
                                                name: 'vioGroupCode',
                                                label: 'Mã',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'vioGroupName',
                                                label: 'Tên',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'description',
                                                label: 'Mô tả',
                                                type: NKFormType.TEXTAREA,
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            vioGroupCode: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            vioGroupName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            description: Joi.string().allow('').optional().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violation-groups'],
                                            });
                                            close();
                                            toast.success(data.message || 'Successful');
                                        }}
                                        defaultValues={{
                                            vioGroupCode: '',
                                            vioGroupName: '',
                                            description: '',
                                            schoolId: schoolId || 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/violation-groups/')({
    component: Page,
});
