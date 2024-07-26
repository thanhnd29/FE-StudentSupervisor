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

    useDocumentTitle('Violation Types');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="violation-types"
                    title="Violation Types"
                    columns={[
                        {
                            key: 'violationTypeId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'vioTypeName',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'vioGroupName',
                            title: 'Group',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction: violationTypeApi.getEnumStatuses,
                        },
                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.MULTILINE_TEXT,
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
                                title="Edit Violation Type"
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
                                            }}
                                            fields={[
                                                {
                                                    name: 'vioTypeName',
                                                    type: NKFormType.TEXT,
                                                    label: 'Name',
                                                },
                                                {
                                                    name: 'violationGroupId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Group',
                                                    fieldProps: {
                                                        apiAction: (value) => violationGroupApi.getEnumSelectOptions(schoolId, value),
                                                    },
                                                },
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Description',
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                violationGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                vioTypeName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['violation-types'],
                                                });
                                                close();
                                                toast.success('Update violation type successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => violationTypeApi.delete(record.violationTypeId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this violation type?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['violation-types'],
                                    });

                                    toast.success('Delete violation type successfully');
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
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'vioTypeName',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Violation Type"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Violation Type"
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
                                                label: 'Name',
                                            },
                                            {
                                                name: 'violationGroupId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Group',
                                                fieldProps: {
                                                    apiAction: (value) => violationGroupApi.getEnumSelectOptions(schoolId, value),
                                                },
                                            },
                                            {
                                                name: 'description',
                                                type: NKFormType.TEXTAREA,
                                                label: 'Description',
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            violationGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            vioTypeName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violation-types'],
                                            });
                                            close();

                                            toast.success('Create violation type successfully');
                                        }}
                                        defaultValues={{
                                            description: '',
                                            violationGroupId: 0,
                                            vioTypeName: '',
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
