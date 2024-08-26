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
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { FilterComparator } from '@/core/models/common';
import { classApi } from '@/core/api/class.api';
import { useState } from 'react';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const [yearT, setYearT] = useState<number | null>(null)

    useDocumentTitle('Danh sách đánh giá');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="evaluations"
                    title="Danh sách đánh giá"
                    columns={[
                        {
                            key: 'evaluationId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'className',
                            title: 'Tên lớp',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'from',
                            title: 'Từ ngày',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'to',
                            title: 'Đến ngày',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'points',
                            title: 'Tổng điểm',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'description',
                            title: 'Mô tả',
                            type: FieldType.MULTILINE_TEXT,
                        },
                    ]}
                    // filters={[
                    //     {
                    //         label: 'Niên khóa',
                    //         comparator: FilterComparator.IN,
                    //         name: 'year',
                    //         type: NKFormType.TEXT,
                    //     },
                    // ]}
                    isSelectYear={true}
                    schoolId={schoolId}
                    queryApi={schoolId ? () => evaluationApi.getBySchool(schoolId) : evaluationApi.getAll}
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
                                                    points: dto.points,
                                                    to: dto.to.toISOString(),
                                                    classId: dto.classId,
                                                });
                                            }}
                                            defaultValues={{
                                                description: record.description,
                                                evaluationId: record.evaluationId,
                                                from: new Date(record.from),
                                                points: record.points,
                                                to: new Date(record.to),
                                                classId: record.classId
                                            }}
                                            fields={[
                                                {
                                                    name: 'from',
                                                    type: NKFormType.DATE,
                                                    label: 'Từ ngày',
                                                },
                                                {
                                                    name: 'to',
                                                    type: NKFormType.DATE,
                                                    label: 'Đến ngày',
                                                },
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Mô tả',
                                                },
                                                {
                                                    name: 'classId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Lớp',
                                                    fieldProps: {
                                                        apiAction: (value) =>
                                                            classApi.getEnumSelectOptions({
                                                                search: value,
                                                                highSchoolId: schoolId,
                                                            }),
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                evaluationId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                from: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                points: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                to: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['evaluations'],
                                                });
                                                close();
                                                toast.success(data.message || 'Successful');
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
                            btnLabel="Tạo"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Tạo bản đánh giá"
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
                                                classId: dto.classId,
                                                year: dto.year,
                                                to: dto.to.toISOString(),
                                            });
                                        }}
                                        fields={[
                                            {
                                                name: 'year',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Niên khóa',
                                                fieldProps: {
                                                    apiAction: (value) =>
                                                        schoolYearApi.getEnumSelectOptions({
                                                            search: value,
                                                            highSchoolId: schoolId
                                                        })
                                                    ,
                                                },
                                                onChangeExtra: (value) => {
                                                    setYearT(value)
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['options', 'classId'],
                                                    });
                                                }
                                            },
                                            {
                                                name: 'from',
                                                type: NKFormType.DATE,
                                                label: 'Từ ngày',
                                            },
                                            {
                                                name: 'to',
                                                type: NKFormType.DATE,
                                                label: 'Đến ngày',
                                            },
                                            {
                                                name: 'classId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Lớp',
                                                fieldProps: {
                                                    apiAction: (value, formMethods) => {
                                                        const year = formMethods.getValues('year');
                                                        return classApi.getEnumSelectOptions({
                                                            search: value,
                                                            highSchoolId: schoolId,
                                                            yearId: year ?? 0,
                                                        });
                                                    },
                                                    queryKey: "classId",
                                                    disabled: !yearT,
                                                },
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
                                            from: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            year: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            to: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['evaluations'],
                                            });
                                            close();
                                            toast.success(data.message || 'Successful');
                                        }}
                                        defaultValues={{
                                            from: new Date(),
                                            to: new Date(),
                                            description: '',
                                            classId: 0,
                                            year: 0,
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
