import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { violationGroupApi } from '@/core/api/violation-group.api';
import { ICreateViolationTypeDto, IUpdateViolationTypeDto, violationTypeApi } from '@/core/api/violation-type.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Danh sách Loại vi phạm');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="violation-types"
                    title="Danh sách Loại vi phạm"
                    columns={[
                        {
                            key: 'violationTypeId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'vioTypeName',
                            title: 'Tên',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'vioGroupName',
                            title: 'Nhóm vi phạm',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'isSupervisorOnly',
                            title: 'Sao đỏ',
                            type: FieldType.BOOLEAN,
                        },
                        {
                            key: 'description',
                            title: 'Mô tả',
                            type: FieldType.MULTILINE_TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: violationTypeApi.getEnumStatuses,
                        },
                    ]}
                    queryApi={schoolId ? () => violationTypeApi.getBySchool(schoolId) : violationTypeApi.getAll}
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
                                        <FormBuilder<IUpdateViolationTypeDto>
                                            className="!p-0"
                                            apiAction={(dto) => violationTypeApi.update(record.violationTypeId, dto)}
                                            defaultValues={{
                                                description: record.description || '',
                                                violationGroupId: record.violationGroupId,
                                                vioTypeName: record.vioTypeName,
                                                isSupervisorOnly: record.isSupervisorOnly
                                            }}
                                            fields={[
                                                {
                                                    name: 'vioTypeName',
                                                    type: NKFormType.TEXT,
                                                    label: 'Tên',
                                                },
                                                {
                                                    name: 'violationGroupId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Nhóm vi phạm',
                                                    fieldProps: {
                                                        apiAction: (value) => violationGroupApi.getEnumSelectOptions(value, schoolId, true),
                                                    },
                                                },
                                                {
                                                    label: 'Sao đỏ',
                                                    name: 'isSupervisorOnly',
                                                    type: NKFormType.BOOLEAN,
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
                                                violationGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                vioTypeName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                isSupervisorOnly: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['violation-types'],
                                                });
                                                close();
                                                toast.success(data.message || 'Successful');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => violationTypeApi.delete(record.violationTypeId)}
                                isConfirm
                                confirmMessage="Bạn có chắc chắn muốn xóa loại vi phạm này không?"
                                extraOnError={toastError}
                                extraOnSuccess={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['violation-types'],
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
                            label: 'Tên loại vi phạm',
                            comparator: FilterComparator.LIKE,
                            name: 'vioTypeName',
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
                            title="Tạo loại vi phạm"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder<ICreateViolationTypeDto>
                                        className="!p-0"
                                        apiAction={violationTypeApi.create}
                                        fields={[
                                            {
                                                name: 'vioTypeName',
                                                type: NKFormType.TEXT,
                                                label: 'Tên',
                                            },
                                            {
                                                name: 'violationGroupId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Nhóm vi phạm',
                                                fieldProps: {
                                                    apiAction: (value) => violationGroupApi.getEnumSelectOptions(value, schoolId, true),
                                                },
                                            },
                                            {
                                                label: 'Sao đỏ',
                                                name: 'isSupervisorOnly',
                                                type: NKFormType.BOOLEAN,
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
                                            violationGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            vioTypeName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            isSupervisorOnly: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violation-types'],
                                            });
                                            close();

                                            toast.success(data.message || 'Successful');
                                        }}
                                        defaultValues={{
                                            description: '',
                                            violationGroupId: 0,
                                            vioTypeName: '',
                                            isSupervisorOnly: false
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

export const Route = createFileRoute('/_admin-layout/dashboard/violation-types/')({
    component: Page,
});
