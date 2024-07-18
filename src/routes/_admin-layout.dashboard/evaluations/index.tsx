import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Joi from 'joi';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { evaluationApi } from '@/core/api/evaluation.api';
import { schoolYearApi } from '@/core/api/school-years.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';

interface PageProps {}

// TODO: Change columns
const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    useDocumentTitle('Evaluations');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="evaluations"
                    title="Evaluations"
                    columns={[
                        {
                            key: 'evaluationId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'from',
                            title: 'From',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'to',
                            title: 'To',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'point',
                            title: 'Point',
                            type: FieldType.NUMBER,
                        },

                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.MULTILINE_TEXT,
                        },
                        {
                            key: 'schoolYearId',
                            title: 'School year',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return schoolYearApi.getEnumSelectOptions({
                                    search: value,
                                    withSchoolName: true,
                                });
                            },
                        },
                    ]}
                    queryApi={evaluationApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Evaluation"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            beforeSubmit={(dto) => {
                                                if (moment(dto.from).isAfter(dto.to)) {
                                                    toast.error('From date must be before to date');
                                                    return false;
                                                }

                                                return true;
                                            }}
                                            apiAction={(dto) => {
                                                return evaluationApi.update({
                                                    description: dto.description,
                                                    evaluationId: record.evaluationId,
                                                    from: dto.from.toISOString(),
                                                    point: dto.point,
                                                    schoolYearId: dto.schoolYearId,
                                                    to: dto.to.toISOString(),
                                                });
                                            }}
                                            defaultValues={{
                                                description: record.description,
                                                evaluationId: record.evaluationId,
                                                from: new Date(record.from),
                                                point: record.point,
                                                schoolYearId: record.schoolYearId,
                                                to: new Date(record.to),
                                            }}
                                            fields={[
                                                {
                                                    name: 'from',
                                                    type: NKFormType.DATE,
                                                    label: 'From',
                                                },
                                                {
                                                    name: 'to',
                                                    type: NKFormType.DATE,
                                                    label: 'To',
                                                },
                                                {
                                                    name: 'point',
                                                    type: NKFormType.NUMBER,
                                                    label: 'Point',
                                                },
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Description',
                                                },
                                                {
                                                    name: 'schoolYearId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'School Year',
                                                    fieldProps: {
                                                        apiAction: (value) =>
                                                            schoolYearApi.getEnumSelectOptions({
                                                                search: value,
                                                                withSchoolName: true,
                                                            }),
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                evaluationId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                from: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                point: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolYearId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                to: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['evaluations'],
                                                });
                                                close();
                                                toast.success('Update evaluation successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            {/* <CTAButton
                                ctaApi={() => evaluationApi.delete(record.evaluationId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this evaluation?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['evaluations'],
                                    });

                                    toast.success('Delete evaluation successfully');
                                }}
                            >
                                <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CTAButton> */}
                        </div>
                    )}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Evaluation"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Evaluation"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        beforeSubmit={(dto) => {
                                            if (moment(dto.from).isAfter(dto.to)) {
                                                toast.error('From date must be before to date');
                                                return false;
                                            }

                                            return true;
                                        }}
                                        apiAction={(dto) => {
                                            return evaluationApi.create({
                                                description: dto.description,
                                                from: dto.from.toISOString(),
                                                point: dto.point,
                                                schoolYearId: dto.schoolYearId,
                                                to: dto.to.toISOString(),
                                            });
                                        }}
                                        fields={[
                                            {
                                                name: 'from',
                                                type: NKFormType.DATE,
                                                label: 'From',
                                            },
                                            {
                                                name: 'to',
                                                type: NKFormType.DATE,
                                                label: 'To',
                                            },
                                            {
                                                name: 'point',
                                                type: NKFormType.NUMBER,
                                                label: 'Point',
                                            },
                                            {
                                                name: 'description',
                                                type: NKFormType.TEXTAREA,
                                                label: 'Description',
                                            },
                                            {
                                                name: 'schoolYearId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'School Year',
                                                fieldProps: {
                                                    apiAction: (value) =>
                                                        schoolYearApi.getEnumSelectOptions({
                                                            search: value,
                                                            withSchoolName: true,
                                                        }),
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            from: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            point: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolYearId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            to: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['evaluations'],
                                            });
                                            close();
                                            toast.success('Create evaluation successfully');
                                        }}
                                        defaultValues={{
                                            from: new Date(),
                                            to: new Date(),
                                            description: '',
                                            point: 0,
                                            schoolYearId: 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/evaluations/')({
    component: Page,
});
