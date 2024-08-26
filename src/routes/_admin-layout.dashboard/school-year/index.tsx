import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { highSchoolApi } from '@/core/api/high-school.api';
import { schoolYearApi } from '@/core/api/school-years.api';
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

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Danh sách năm học');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="school-year"
                    title="Danh sách năm học"
                    columns={[
                        {
                            key: 'schoolYearId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'year',
                            title: 'Niên khóa',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'startDate',
                            title: 'Ngày bắt đầu',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'endDate',
                            title: 'Ngày kết thúc',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return schoolYearApi.getEnumStatuses(value);
                            },
                        },
                    ]}
                    isSelectYear={true}
                    schoolId={schoolId}
                    queryApi={schoolId ? () => schoolYearApi.getBySchool(schoolId) : schoolYearApi.getAll}
                    actionColumns={(record) => {
                        return (
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
                                                title=""
                                                apiAction={(dto) => {
                                                    if (moment(dto.startDate).isAfter(dto.endDate)) {
                                                        toast.error('Start Date must be before end date');
                                                        return;
                                                    }

                                                    return schoolYearApi.update(record.schoolYearId, {
                                                        endDate: moment(dto.endDate).toISOString(),
                                                        schoolId: dto.schoolId,
                                                        startDate: moment(dto.startDate).toISOString(),
                                                        year: moment(dto.year).year(),
                                                    });
                                                }}
                                                defaultValues={{
                                                    endDate: new Date(record.endDate),
                                                    startDate: new Date(record.startDate),
                                                    schoolId: record.schoolId,
                                                    year: new Date().setUTCFullYear(record.year),
                                                }}
                                                schema={{
                                                    endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    year: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                }}
                                                fields={[
                                                    {
                                                        name: 'startDate',
                                                        label: 'Ngày bắt đầu',
                                                        type: NKFormType.DATE,
                                                    },
                                                    {
                                                        name: 'endDate',
                                                        label: 'Ngày kết thúc',
                                                        type: NKFormType.DATE,
                                                    },
                                                    {
                                                        name: 'schoolId',
                                                        label: 'Trường',
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        fieldProps: {
                                                            apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                            readonly: true,
                                                        },
                                                    },
                                                    {
                                                        name: 'year',
                                                        label: 'Niên khóa',
                                                        type: NKFormType.DATE_YEAR,
                                                        fieldProps: {
                                                            format: 'YYYY',
                                                        },
                                                    },
                                                ]}
                                                onExtraSuccessAction={(data) => {
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['school-year'],
                                                    });

                                                    close();

                                                    toast.success(data.message || 'Successful');
                                                }}
                                                onExtraErrorAction={toastError}
                                            />
                                        );
                                    }}
                                </ModalBuilder>
                                <CTAButton
                                    ctaApi={() => schoolYearApi.delete(record.schoolYearId)}
                                    isConfirm
                                    confirmMessage="Bạn có chắc chắn muốn xóa năm học này không?"
                                    extraOnError={toastError}
                                    extraOnSuccess={(data) => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['school-year'],
                                        });

                                        toast.success(data.message || 'Successful');
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        danger
                                        size="small"
                                        className="flex items-center justify-center"
                                        icon={<Trash className="h-4 w-4" />}
                                    ></Button>
                                </CTAButton>
                            </div>
                        );
                    }}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Tạo"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Tạo năm học"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        title=""
                                        apiAction={({ endDate, schoolId, startDate, year }) => {
                                            if (moment(startDate).isAfter(endDate)) {
                                                toast.error('Start Date must be before end date');
                                                return;
                                            }

                                            return schoolYearApi.create({
                                                endDate: moment(endDate).toISOString(),
                                                schoolId,
                                                startDate: moment(startDate).toISOString(),
                                                year: moment(year).year(),
                                            });
                                        }}
                                        defaultValues={{
                                            endDate: new Date(),
                                            startDate: new Date(),
                                            schoolId: schoolId || 0,
                                            year: new Date(),
                                        }}
                                        schema={{
                                            endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            year: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        fields={[
                                            {
                                                name: 'endDate',
                                                label: 'Ngày kết thúc',
                                                type: NKFormType.DATE,
                                            },
                                            {
                                                name: 'startDate',
                                                label: 'Ngày bắt đầu',
                                                type: NKFormType.DATE,
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
                                            {
                                                name: 'year',
                                                label: 'Niên khóa',
                                                type: NKFormType.DATE_YEAR,
                                                fieldProps: {
                                                    format: 'YYYY',
                                                },
                                            },
                                        ]}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['school-year'],
                                            });

                                            close();

                                            toast.success(data.message || 'Successful');
                                        }}
                                        onExtraErrorAction={toastError}
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

export const Route = createFileRoute('/_admin-layout/dashboard/school-year/')({
    component: Page,
});
