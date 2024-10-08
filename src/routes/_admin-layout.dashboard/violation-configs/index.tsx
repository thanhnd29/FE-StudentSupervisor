import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { evaluationApi } from '@/core/api/evaluation.api';
import { violationTypeApi } from '@/core/api/violation-type.api';
import { ICreateViolationConfigDto, IUpdateViolationConfigDto, violationConfigApi } from '@/core/api/violation-violation.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { toastError } from '@/core/utils/api.helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Danh sách Cấu hình vi phạm');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="violation-configs"
                    title="Danh sách Cấu hình vi phạm"
                    columns={[
                        {
                            key: 'violationConfigId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'violationTypeName',
                            title: 'Loại vi phạm',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'description',
                            title: 'Mô tả',
                            type: FieldType.MULTILINE_TEXT,
                        },
                        {
                            key: 'minusPoints',
                            title: 'Điểm trừ',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: violationConfigApi.getEnumStatuses,
                        },
                    ]}
                    queryApi={schoolId ? () => violationConfigApi.getBySchool(schoolId) : violationConfigApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Violation Config"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder<IUpdateViolationConfigDto>
                                            className="!p-0"
                                            apiAction={(dto) => violationConfigApi.update(record.violationTypeId, dto)}
                                            defaultValues={{
                                                description: record.description,
                                                minusPoints: record.minusPoints,
                                            }}
                                            fields={[
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Description',
                                                },
                                                {
                                                    name: 'minusPoints',
                                                    type: NKFormType.NUMBER,
                                                    label: 'Minus Points',
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                minusPoints: Joi.number().required().min(1).max(30).messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['violation-configs'],
                                                });
                                                close();
                                                toast.success(data.message || 'Successful');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            {/* <CTAButton
                                ctaApi={() => violationConfigApi.delete(record.violationConfigId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this violation config?"
                                extraOnError={toastError}
                                extraOnSuccess={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['violation-configs'],
                                    });

                                    toast.success(data.message || 'Successful');
                                }}
                            >
                                <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CTAButton> */}
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
                    // extraButtons={
                    //     <ModalBuilder
                    //         btnLabel="Create Violation Config"
                    //         btnProps={{
                    //             type: 'primary',
                    //             icon: <PlusOutlined />,
                    //         }}
                    //         title="Create Violation Config"
                    //     >
                    //         {(close) => {
                    //             return (
                    //                 <FormBuilder<ICreateViolationConfigDto>
                    //                     className="!p-0"
                    //                     apiAction={violationConfigApi.create}
                    //                     fields={[
                    //                         {
                    //                             name: 'description',
                    //                             type: NKFormType.TEXTAREA,
                    //                             label: 'Description',
                    //                         },
                    //                         {
                    //                             name: 'minusPoints',
                    //                             type: NKFormType.NUMBER,
                    //                             label: 'Minus Points',
                    //                         },
                    //                         {
                    //                             name: 'violationTypeId',
                    //                             type: NKFormType.SELECT_API_OPTION,
                    //                             label: 'Type',
                    //                             fieldProps: {
                    //                                 apiAction: (value) => violationTypeApi.getEnumSelectOptions(schoolId, value),
                    //                             },
                    //                         },
                    //                     ]}
                    //                     title=""
                    //                     schema={{
                    //                         description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                    //                         minusPoints: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    //                         violationTypeId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    //                     }}
                    //                     onExtraErrorAction={toastError}
                    //                     onExtraSuccessAction={(data) => {
                    //                         queryClient.invalidateQueries({
                    //                             queryKey: ['violation-configs'],
                    //                         });
                    //                         close();

                    //                         toast.success(data.message || 'Successful');
                    //                     }}
                    //                     defaultValues={{
                    //                         description: '',
                    //                         minusPoints: 0,
                    //                         violationTypeId: 0,
                    //                     }}
                    //                 />
                    //             );
                    //         }}
                    //     </ModalBuilder>
                    // }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/violation-configs/')({
    component: Page,
});
